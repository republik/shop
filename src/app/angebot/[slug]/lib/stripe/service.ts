import Stripe from "stripe";
import { SubscriptionConfiguration, StripeSubscriptonItems } from "./types";

export const StripeService = (stripe: Stripe) => ({
  getAboTypeData: async (
    options: SubscriptionConfiguration
  ): Promise<StripeSubscriptonItems> => {
    const [product, price, coupon] = await Promise.all([
      stripe.products.retrieve(options.productId),
      stripe.prices.retrieve(options.priceId),
      options.couponCode
        ? stripe.coupons.retrieve(options.couponCode).catch(() => null)
        : null,
    ]);
    return { product, price, coupon };
  },
});
