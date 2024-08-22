import Stripe from "stripe";
import {
  SubscriptionConfiguration,
  StripeSubscriptonItems,
  StripeAccount,
} from "./types";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";
import { getAccountPaymentsConfiguration } from "./server";
import { UtmObject } from "@/lib/utm";
import { Me } from "@/lib/auth/types";
import { SubscriptionsConfiguration, SubscriptionTypes } from "../config";
import { fetchMe } from "@/lib/auth/fetch-me";

async function fetchStripeSubscriptionData(
  stripe: Stripe,
  subscriptionConfig: SubscriptionConfiguration
): Promise<StripeSubscriptonItems> {
  const [product, price, coupon] = await Promise.all([
    stripe.products.retrieve(subscriptionConfig.productId),
    stripe.prices.retrieve(subscriptionConfig.priceId),
    subscriptionConfig.couponCode
      ? stripe.coupons.retrieve(subscriptionConfig.couponCode).catch(() => null)
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
  analytics?: {
    utm?: UtmObject;
    referrerId?: string;
  };
}

async function initializeCheckout(
  stripe: Stripe,
  subscriptionType: SubscriptionTypes,
  options: CheckoutOptions
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  const subscriptionConfig = SubscriptionsConfiguration[subscriptionType];

  const [price, product, coupon] = await Promise.all([
    stripe.prices.retrieve(subscriptionConfig.priceId),
    stripe.products.retrieve(subscriptionConfig.productId),
    subscriptionConfig.couponCode
      ? stripe.coupons.retrieve(subscriptionConfig.couponCode).catch(() => null)
      : null,
  ]);

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
        price:
          !!options.userPrice && subscriptionConfig.customPrice
            ? undefined
            : price.id,
        price_data:
          !!options.userPrice && subscriptionConfig.customPrice
            ? {
                product: product.id,
                unit_amount: options.userPrice,
                currency: price.currency,
                recurring: {
                  interval: "year",
                  interval_count: 1,
                },
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
    return_url: `${process.env.NEXT_PUBLIC_URL}/angebot/${subscriptionType}?session_id={CHECKOUT_SESSION_ID}`,
    locale: "de",
    redirect_on_completion: "if_required",
    billing_address_collection: "required",
    subscription_data: {
      metadata: {
        ...options.analytics?.utm,
        referrerId: options.analytics?.referrerId || null,
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
  ): Promise<StripeSubscriptonItems> =>
    fetchStripeSubscriptionData(stripe, options),
  initializeCheckoutSession: async (
    subscriptionType: SubscriptionTypes,
    options: CheckoutOptions
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> =>
    initializeCheckout(stripe, subscriptionType, options),
});
