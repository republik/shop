import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClient } from "@/lib/apollo/client";
import { MeDocument } from "../../../graphql/republik-api/__generated__/gql/graphql";
import { initStripe } from "../angebot/[slug]/lib/stripe/server";
import { AboTypes, aboTypesMeta } from "../angebot/[slug]/lib/config";
import Link from "next/link";
import { AboPurchaseOptions } from "../angebot/[slug]/lib/stripe/types";

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
  const [product, price, coupon] = await Promise.all([
    stripe.products.retrieve(aboPurchaseOptions.productId),
    stripe.prices.retrieve(aboPurchaseOptions.priceId),
    aboPurchaseOptions.couponCode
      ? stripe.coupons.retrieve(aboPurchaseOptions.couponCode).catch(() => null)
      : null,
  ]);

  const eligibleForCoupon = (meRes?.data?.me?.memberships || []).length == 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{meta.title}</CardTitle>
        <CardDescription>{meta.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {coupon &&
          coupon.amount_off &&
          eligibleForCoupon &&
          price.unit_amount && (
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
        <Button asChild className="w-full">
          <Link href={`/angebot/${aboType}`}>Zum Angebot</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
