import { Me } from "@/lib/auth/types";
import { MetadataParam } from "@stripe/stripe-js";
import Stripe from "stripe";

export type StripeAccount = "REPUBLIK" | "PROJECT_R";

type ProductAvailabilityResult = {
  available: boolean;
  reason?: string;
};

export type IsProductAvailableForUserPredicate = (
  me: Me
) => ProductAvailabilityResult;

type BaseSubscriptionConfiguration = {
  stripeAccount: StripeAccount;
  lookupKey: string;
  taxRateId?: string;
  couponCode?: string;
  // Data to be appended to the subscription's metadata.
  metaData?: MetadataParam;
};

type CustomPricingConfiguration = {
  max: number;
  min: number;
  step: number;
  // configure in what interval the subscription is charged
  recurring: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring;
};

export type SubscriptionConfiguration = BaseSubscriptionConfiguration & {
  customPrice?: CustomPricingConfiguration;
};

export type StripeSubscriptionItems = {
  product: Stripe.Product;
  price: Stripe.Price;
  coupon: Stripe.Coupon | null;
};
