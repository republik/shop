import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AboTypes, aboTypesMeta } from "../checkout/[slug]/lib/config";
import { AboPurchaseOptions } from "../checkout/[slug]/lib/action";
import { initStripe } from "../checkout/[slug]/lib/stripe/server";
import { BuyButton } from "./buy-button";
import { getClient } from "@/lib/apollo/client";
import { MeDocument } from "../../../graphql/republik-api/__generated__/gql/graphql";

type ProductCardProps = {
  aboType: AboTypes;
  aboPurchaseOptions: AboPurchaseOptions;
};

const priceStr = (price: number, currency = "CHF") =>
  `${currency} ${(price / 100).toFixed(2)}`;

export async function ProductCard({
  aboType,
  aboPurchaseOptions,
}: ProductCardProps) {
  const meRes = await getClient().query({ query: MeDocument });
  const meta = aboTypesMeta[aboType];
  const stripe = await initStripe(aboPurchaseOptions.stripeAccount);
  const [product, price] = await Promise.all([
    stripe.products.retrieve(aboPurchaseOptions.productId),
    stripe.prices.retrieve(aboPurchaseOptions.priceId),
  ]);

  const mayUseCoupon = (meRes?.data?.me?.memberships || []).length == 0;
  const fetchCoupon = async () => {
    if (mayUseCoupon && aboPurchaseOptions?.couponCode) {
      return await stripe.coupons.retrieve(aboPurchaseOptions.couponCode);
    }
    return null;
  };
  const coupon = await fetchCoupon();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{meta.title}</CardTitle>
        <CardDescription>{meta.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {coupon && coupon.amount_off && price.unit_amount && (
          <div className="bg-green-200/60 mb-8 p-4 border border-green-400/80 font-medium">
            🎁 Für {priceStr(price.unit_amount - coupon.amount_off)} anstatt{" "}
            {priceStr(price.unit_amount)} bei der ersten Zahlung.
          </div>
        )}
        <ul>
          <li>✅ Im Abo enthalten!</li>
          <li>✅ Das auch</li>

          <li>
            {meta.projectR ? "✅" : "❌"} Du wirst Teil der Project-R
            Genossenschaft
          </li>
        </ul>
        <details>
          <summary>data</summary>
          {JSON.stringify(product, null, 2)}
          {JSON.stringify(price, null, 2)}
        </details>
      </CardContent>
      <CardFooter>
        <BuyButton
          aboType={aboType}
          price={!price.unit_amount || coupon ? undefined : price.unit_amount}
        />
      </CardFooter>
    </Card>
  );
}
