import { Me } from "@/lib/auth/types";
import Stripe from "stripe";
import { StripeSubscriptionItems, SubscriptionConfiguration } from "./types";

async function fetchStripeSubscriptionData(
  stripe: Stripe,
  subscriptionConfig: SubscriptionConfiguration
): Promise<StripeSubscriptionItems> {
  const [product, price, coupon] = await Promise.all([
    stripe.products.retrieve(subscriptionConfig.productId),
    stripe.prices.retrieve(subscriptionConfig.priceId),
    subscriptionConfig.couponCode
      ? stripe.coupons.retrieve(subscriptionConfig.couponCode).catch(() => null)
      : null,
  ]);
  return { product, price, coupon };
}

export function requiredCustomFields(
  me: Me
): Stripe.Checkout.SessionCreateParams["custom_fields"] {
  if (!me.firstName && !me.lastName) {
    return [
      {
        key: "firstName",
        type: "text",
        optional: false,
        label: {
          custom: "Vorname",
          type: "custom",
        },
      },
      {
        key: "lastName",
        type: "text",
        optional: false,
        label: {
          custom: "Nachname",
          type: "custom",
        },
      },
    ];
  }

  return [];
}

export const StripeService = (stripe: Stripe) => ({
  getStripeSubscriptionItems: async (
    options: SubscriptionConfiguration
  ): Promise<StripeSubscriptionItems> =>
    fetchStripeSubscriptionData(stripe, options),
});
