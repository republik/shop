import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { initStripe } from "../angebot/[slug]/lib/stripe/server";
import { AboTypes, aboTypesMeta } from "../angebot/[slug]/lib/config";
import Link from "next/link";
import { AboPurchaseOptions } from "../angebot/[slug]/lib/stripe/types";
import { fetchMe } from "@/lib/auth/fetch-me";
import { UtmObject } from "@/lib/utm";
import { css } from "@/theme/css";

type ProductCardProps = {
  aboType: AboTypes;
  aboPurchaseOptions: AboPurchaseOptions;
  utm: UtmObject;
};

const priceStr = (price: number, currency = "CHF") =>
  `${currency} ${(price / 100).toFixed(2)}`;

export async function ProductCard({
  aboType,
  aboPurchaseOptions,
}: ProductCardProps) {
  const me = await fetchMe();
  const meta = aboTypesMeta[aboType];
  const stripe = await initStripe(aboPurchaseOptions.stripeAccount);
  const [product, price, coupon] = await Promise.all([
    stripe.products.retrieve(aboPurchaseOptions.productId),
    stripe.prices.retrieve(aboPurchaseOptions.priceId),
    aboPurchaseOptions.couponCode
      ? stripe.coupons.retrieve(aboPurchaseOptions.couponCode).catch(() => null)
      : null,
  ]);

  const eligibleForCoupon = (me?.memberships || []).length == 0;

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
            <div
              className={css({
                bg: "disabled",
                mb: "8",
                p: "4",
                textStyle: "body",
                fontWeight: "medium",
              })}
              // className="bg-green-200/60 mb-8 p-4 border border-green-400/80 font-medium"
            >
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
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/angebot/${aboType}`}>Zum Angebot</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
