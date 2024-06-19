import { getClient } from "@/lib/apollo/client";
import { checkoutConfig } from "./checkout/lib/config";
import { initStripe } from "./checkout/lib/stripe/server";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { notFound, redirect } from "next/navigation";
import { BuyButton } from "../../components/buy-button";

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
  const [price, product, coupon] = await Promise.all([
    stripe.prices.retrieve(aboConfig.priceId),
    stripe.products.retrieve(aboConfig.productId),
    aboConfig.couponCode ? stripe.coupons.retrieve(aboConfig.couponCode) : null,
  ]);

  if (!price || !product) {
    notFound();
  }

  return (
    <div>
      <h1>Product Page</h1>
      <div></div>
      <div>
        <details>
          <summary>Product details</summary>
          <pre>{JSON.stringify(product, null, 2)}</pre>
        </details>
      </div>
      <div>
        <details>
          <summary>Price details</summary>
          <pre>{JSON.stringify(price, null, 2)}</pre>{" "}
        </details>
      </div>
      {coupon && (
        <div>
          <details>
            <summary>Coupon details</summary>
            <pre>{JSON.stringify(coupon, null, 2)}</pre>{" "}
          </details>
        </div>
      )}
      <BuyButton aboType={params.slug} price={price.unit_amount || 0} />
    </div>
  );
}
