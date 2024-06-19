import { getClient } from "@/lib/apollo/client";
import { checkoutConfig } from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { notFound, redirect } from "next/navigation";
import { CheckoutView } from "./components/checkout-view";
import { StripeService } from "./lib/stripe/service";
import { initializeCheckout } from "./action";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = getClient();
  const meRes = await client.query({ query: MeDocument });
  // TODO: ensure you are only able to access this page if you are logged in
  if (!meRes.data.me) {
    const url = new URL("/anmelden", process.env.NEXT_PUBLIC_MAGAZIN_URL);
    const afterLoginUrl = new URL(
      `/${params.slug}`,
      process.env.NEXT_PUBLIC_URL
    );
    url.searchParams.append("redirect", afterLoginUrl.toString());

    redirect(url.toString());
  }

  const aboConfig = checkoutConfig[params.slug];
  const stripe = await initStripe(aboConfig.stripeAccount);
  const aboData = await StripeService(stripe)
    .getAboTypeData(aboConfig)
    .catch((error) => {
      console.error(error);
      return notFound();
    });

  const { clientSecret } = await initializeCheckout(
    params.slug,
    meRes?.data?.me?.email || undefined
  );

  return (
    <CheckoutView
      email={meRes.data?.me?.email || undefined}
      aboType={params.slug}
      aboPurchaseOptions={aboConfig}
      aboData={aboData}
      clientSecret={clientSecret}
    />
  );
}
