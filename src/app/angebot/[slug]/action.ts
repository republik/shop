"use server";

import { fetchMe } from "@/lib/auth/fetch-me";
import { SubscriptionTypes, SubscriptionsConfiguration } from "./lib/config";
import {
  getAccountPaymentsConfiguration,
  initStripe,
} from "./lib/stripe/server";
import { UTM_COOKIE_NAME, UtmObject, fromUtmCookie } from "@/lib/utm";
import { cookies } from "next/headers";
import { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { redirect } from "next/navigation";
import { StripeAccount } from "./lib/stripe/types";
import { Me } from "@/lib/auth/types";
import { isEligibleForEntryCoupon } from "@/lib/auth/discount-eligability";

function getUTM(): UtmObject {
  const utmCookie = cookies().get(UTM_COOKIE_NAME);
  if (!utmCookie) {
    return {};
  }
  return fromUtmCookie(utmCookie.value);
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
  utm?: UtmObject;
}

async function initializeCheckout(
  subscriptionType: SubscriptionTypes,
  options: CheckoutOptions
): Promise<void> {
  const me = await fetchMe();
  const subscriptionConfig = SubscriptionsConfiguration[subscriptionType];
  const stripe = await initStripe(subscriptionConfig.stripeAccount);

  const [price, product, coupon] = await Promise.all([
    stripe.prices.retrieve(subscriptionConfig.priceId),
    stripe.products.retrieve(subscriptionConfig.productId),
    subscriptionConfig.couponCode
      ? stripe.coupons.retrieve(subscriptionConfig.couponCode).catch(() => null)
      : null,
  ]);
  const utmObj = getUTM();

  const stripeCustomer = getRelevantStripeCustomer(
    me!,
    subscriptionConfig.stripeAccount
  );

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
      metadata: { ...utmObj },
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

  if (!session.client_secret) {
    throw new Error("No client_secret in checkout session");
  }

  cookies().set(CHECKOUT_SESSION_ID_COOKIE, session.id, {
    expires: 1000 * 60 * 30, // expire after30min
  });
}

export async function createCheckout(formData: FormData): Promise<{}> {
  const subscriptionType = formData.get("subscriptionType");
  const price = formData.get("price");

  if (!subscriptionType || typeof subscriptionType !== "string") {
    throw new Error(`SubscriptionType "${subscriptionType}" is invalid`);
  }

  if (!Object.keys(SubscriptionsConfiguration).includes(subscriptionType)) {
    throw new Error(
      `Invalid AboType '${subscriptionType}'. AboType must be one of ${String(
        Object.keys(SubscriptionsConfiguration)
      )}`
    );
  }

  const me = await fetchMe();
  const subscriptionConfig =
    SubscriptionsConfiguration[subscriptionType as SubscriptionTypes];

  await initializeCheckout(subscriptionType, {
    email: me?.email || undefined,
    userPrice: subscriptionConfig.customPrice
      ? Math.max(240, price ? Number(price) : 0) * 100
      : undefined,
  });

  redirect(`/angebot/${subscriptionType}`);
}
