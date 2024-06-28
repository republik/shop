import Stripe from "stripe";
import { AboPurchaseOptions, AboTypeData } from "./types";

export const StripeService = (stripe: Stripe) => ({
  getAboTypeData: async (options: AboPurchaseOptions): Promise<AboTypeData> => {
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
