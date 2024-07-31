import Stripe from "stripe";

export type StripeAccount = "REPUBLIK" | "PROJECT-R";

export interface AboConfiguration {
  stripeAccount: StripeAccount;
  productId: string;
  priceId: string;
  couponCode?: string;
  customPrice?: boolean;
}

export type AboStripeConfig = {
  product: Stripe.Product;
  price: Stripe.Price;
  coupon: Stripe.Coupon | null;
};
