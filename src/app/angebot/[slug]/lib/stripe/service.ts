import Stripe from "stripe";
import {
  SubscriptionConfiguration,
  StripeSubscriptionItems,
  StripeAccount,
} from "./types";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";
import { getAccountPaymentsConfiguration } from "./server";
import { AnalyticsObject } from "@/lib/analytics";
import { Me } from "@/lib/auth/types";
import { SubscriptionsConfiguration, SubscriptionType } from "../config";
import { fetchMe } from "@/lib/auth/fetch-me";

async function fetchStripeSubscriptionData(
  stripe: Stripe,
  subscriptionConfig: SubscriptionConfiguration
): Promise<StripeSubscriptionItems> {
  const prices = await stripe.prices.list({
    lookup_keys: [subscriptionConfig.lookupKey],
  });
  const price = prices.data?.[0] || null;
  if (!price) {
    throw new Error(
      `No price with lookup-key '${subscriptionConfig.lookupKey}'`
    );
  }
  const [product, coupon] = await Promise.all([
    stripe.products.retrieve(price.product as string),
    subscriptionConfig.firstTimeCustomerCouponId
      ? stripe.coupons.retrieve(subscriptionConfig.firstTimeCustomerCouponId)
      : null,
  ]);
  return { product, price, coupon };
}

function getRelevantStripeCustomer(
  me: Me,
  stripeAccount: StripeAccount
): string | undefined {
  switch (stripeAccount) {
    case "REPUBLIK":
      return me?.stripeCustomerRepublik?.customerId;
    case "PROJECT_R":
      return me?.stripeCustomerProjectR?.customerId;
    default:
      return undefined;
  }
}

interface CheckoutOptions {
  email?: string;
  userPrice?: number;
  analytics?: AnalyticsObject;
}

async function initializeCheckout(
  stripe: Stripe,
  subscriptionType: SubscriptionType,
  options: CheckoutOptions
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  const subscriptionConfig = SubscriptionsConfiguration[subscriptionType];

  const { price, product, coupon } = await fetchStripeSubscriptionData(
    stripe,
    subscriptionConfig
  );

  const me = await fetchMe();
  const stripeCustomer = me
    ? getRelevantStripeCustomer(me, subscriptionConfig.stripeAccount)
    : undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ui_mode: "embedded",
    customer: stripeCustomer,
    customer_email: !stripeCustomer ? options.email : undefined,
    line_items: [
      {
        price: !subscriptionConfig.customPrice ? price.id : undefined,
        price_data:
          subscriptionConfig.customPrice && options.userPrice
            ? {
                product: product.id,
                unit_amount: options.userPrice,
                currency: price.currency,
                recurring: subscriptionConfig.customPrice.recurring,
              }
            : undefined,
        tax_rates: subscriptionConfig.taxRateId
          ? [subscriptionConfig.taxRateId]
          : undefined,
        quantity: 1,
      },
    ],
    currency: price.currency,
    discounts:
      isEligibleForEntryCoupon(me) && coupon
        ? [{ coupon: coupon.id }]
        : undefined,
    // '{CHECKOUT_SESSION_ID}' is prefilled by stripe
    return_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${subscriptionType}?session_id={CHECKOUT_SESSION_ID}`,
    locale: "de",
    redirect_on_completion: "if_required",
    billing_address_collection: "required",
    subscription_data: {
      metadata: {
        ...options.analytics,
        ...subscriptionConfig.metaData,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
    payment_method_configuration: getAccountPaymentsConfiguration(
      subscriptionConfig.stripeAccount
    ),
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
  });

  return session;
}

export const StripeService = (stripe: Stripe) => ({
  getStripeSubscriptionItems: async (
    options: SubscriptionConfiguration
  ): Promise<StripeSubscriptionItems> =>
    fetchStripeSubscriptionData(stripe, options),
  initializeCheckoutSession: async (
    subscriptionType: SubscriptionType,
    options: CheckoutOptions
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> =>
    initializeCheckout(stripe, subscriptionType, options),
});
