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
import { SubscriptionsConfiguration, SubscriptionTypes } from "../config";
import { fetchMe } from "@/lib/auth/fetch-me";

async function fetchStripeSubscriptionData(
  stripe: Stripe,
  subscriptionConfig: SubscriptionConfiguration,
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

function getRelevantStripeCustomer(
  me: Me,
  stripeAccount: StripeAccount,
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
  subscriptionType: SubscriptionTypes,
  options: CheckoutOptions,
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  const subscriptionConfig = SubscriptionsConfiguration[subscriptionType];

  const { price, product, coupon } = await fetchStripeSubscriptionData(
    stripe,
    subscriptionConfig,
  );

  const me = await fetchMe();
  if (!me) {
    throw Error("you are not logged in");
  }
  const stripeCustomer = getRelevantStripeCustomer(
    me,
    subscriptionConfig.stripeAccount,
  );
  if (!stripeCustomer) {
    throw Error("Stripe customer is missing");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ui_mode: "embedded",
    customer: stripeCustomer,
    custom_fields: requiredCustomFields(me),
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
                // TODO: add recurring for custom prices into SubscriptionConfiguration object
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
      subscriptionConfig.stripeAccount,
    ),
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
  });

  return session;
}

export function requiredCustomFields(
  me: Me,
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
    options: SubscriptionConfiguration,
  ): Promise<StripeSubscriptionItems> =>
    fetchStripeSubscriptionData(stripe, options),
  initializeCheckoutSession: async (
    subscriptionType: SubscriptionTypes,
    options: CheckoutOptions,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> =>
    initializeCheckout(stripe, subscriptionType, options),
});
