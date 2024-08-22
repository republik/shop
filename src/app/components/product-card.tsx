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
import { AboConfiguration } from "../angebot/[slug]/lib/stripe/types";
import { fetchMe } from "@/lib/auth/fetch-me";
import { UtmObject } from "@/lib/utm";
import { css } from "@/theme/css";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";

type ProductCardProps = {
  aboType: AboTypes;
  aboPurchaseOptions: AboConfiguration;
  utm?: UtmObject;
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
  const [price, coupon] = await Promise.all([
    // stripe.products.retrieve(aboPurchaseOptions.productId),
    stripe.prices.retrieve(aboPurchaseOptions.priceId),
    aboPurchaseOptions.couponCode
      ? stripe.coupons.retrieve(aboPurchaseOptions.couponCode).catch(() => null)
      : null,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{meta.title}</CardTitle>
        <CardDescription>{meta.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {coupon &&
          coupon.amount_off &&
          isEligibleForEntryCoupon(me) &&
          price.unit_amount && (
            <div
              className={css({
                bg: "disabled",
                mb: "8",
                p: "4",
                textStyle: "body",
                fontWeight: "medium",
              })}
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
