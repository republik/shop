import { Me } from "@/lib/auth/types";
import Stripe from "stripe";

export type StripeAccount = "REPUBLIK" | "PROJECT_R";

type ProductAvailabilityResult = {
  available: boolean;
  reason?: string;
};

export type IsProductAvailableForUserPredicate = (
  me: Me
) => ProductAvailabilityResult;

export interface SubscriptionConfiguration {
  stripeAccount: StripeAccount;
  productId: string;
  priceId: string;
  taxRateId?: string;
  couponCode?: string;
  customPrice?: boolean;
}

export type StripeSubscriptonItems = {
  product: Stripe.Product;
  price: Stripe.Price;
  coupon: Stripe.Coupon | null;
};
