import { checkoutConfig } from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import { notFound, redirect } from "next/navigation";
import { StripeService } from "./lib/stripe/service";
import { fetchMe } from "@/lib/auth/fetch-me";
import { PreCheckout } from "./pre-checkout";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { price: string };
}) {
  const me = await fetchMe();
  const aboConfig = checkoutConfig[params.slug];

  const stripe = await initStripe(aboConfig.stripeAccount);
  // const aboData = await StripeService(stripe)
  //   .getAboTypeData(aboConfig)
  //   .catch((error) => {
  //     console.error(error);
  //     return notFound();
  //   });

  if (!me) {
    return <p>[ SHOW LOGIN ]</p>;
  }

  return (
    <PreCheckout
      me={me}
      aboType={params.slug}
      aboConfig={aboConfig}
      // aboData={aboData}
      initialPrice={
        aboConfig.customPrice && searchParams.price
          ? Number(searchParams.price)
          : undefined
      }
    />
  );
}
