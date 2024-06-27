import { checkoutConfig } from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import { notFound, redirect } from "next/navigation";
import { CheckoutView } from "./components/checkout-view";
import { StripeService } from "./lib/stripe/service";
import { initializeCheckout } from "./action";
import { fetchMe } from "@/lib/auth/fetch-me";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const me = await fetchMe();
  // TODO: ensure you are only able to access this page if you are logged in
  if (!me) {
    const url = new URL("/anmelden", process.env.NEXT_PUBLIC_MAGAZIN_URL);
    const afterLoginUrl = new URL(
      `/angebot/${params.slug}`,
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
    me.email || undefined
  );

  return (
    <CheckoutView
      email={me.email || undefined}
      aboType={params.slug}
      aboPurchaseOptions={aboConfig}
      aboData={aboData}
      clientSecret={clientSecret}
    />
  );
}
