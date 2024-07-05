import { checkoutConfig } from "./lib/config";
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
