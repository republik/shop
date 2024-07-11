import Stripe from "stripe";
import { AboConfiguration, AboStripeConfig } from "./types";

export const StripeService = (stripe: Stripe) => ({
  getAboTypeData: async (
    options: AboConfiguration
  ): Promise<AboStripeConfig> => {
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
