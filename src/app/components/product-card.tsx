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
import {
  SubscriptionTypes,
  SUBSCRIPTION_META,
} from "../angebot/[slug]/lib/config";
import Link from "next/link";
import { SubscriptionConfiguration } from "../angebot/[slug]/lib/stripe/types";
import { AnalyticsObject } from "@/lib/analytics";
import { css } from "@/theme/css";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";
import { Me } from "@/lib/auth/types";

type ProductCardProps = {
  me?: Me | null | undefined;
  subscriptionType: SubscriptionTypes;
  subscriptionConfiguration: SubscriptionConfiguration;
  utm?: AnalyticsObject;
};

const priceStr = (price: number, currency = "CHF") =>
  `${currency} ${(price / 100).toFixed(2)}`;

export async function ProductCard({
  me,
  subscriptionType,
  subscriptionConfiguration,
}: ProductCardProps) {
  const subscriptionMeta = SUBSCRIPTION_META[subscriptionType];
  const stripe = await initStripe(subscriptionConfiguration.stripeAccount);
  const [price, coupon] = await Promise.all([
    stripe.prices.retrieve(subscriptionConfiguration.priceId),
    subscriptionConfiguration.couponCode
      ? stripe.coupons
          .retrieve(subscriptionConfiguration.couponCode)
          .catch(() => null)
      : null,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subscriptionMeta.title}</CardTitle>
        <CardDescription>{subscriptionMeta.description}</CardDescription>
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
            {subscriptionMeta.projectR ? "✅" : "❌"} Du wirst Teil der
            Project-R Genossenschaft
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/angebot/${subscriptionType}`}>Zum Angebot</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
