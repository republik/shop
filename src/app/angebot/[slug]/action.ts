"use server";

import { fetchMe } from "@/lib/auth/fetch-me";
import {
  SubscriptionType,
  SubscriptionsConfiguration,
  subscriptionsTypes,
} from "./lib/config";
import { initStripe } from "./lib/stripe/server";
import {
  ANALYTICS_COOKIE_NAME,
  AnalyticsObject,
  fromAnalyticsCookie,
} from "@/lib/analytics";
import { cookies } from "next/headers";
import { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { redirect } from "next/navigation";
import { StripeService } from "./lib/stripe/service";

function readAnalyticsParamsFromCookie(): AnalyticsObject {
  const cookie = cookies().get(ANALYTICS_COOKIE_NAME);
  if (!cookie) {
    return {};
  }
  return fromAnalyticsCookie(cookie.value);
}

function ensureValidSubscriptionType(
  subscriptionType: string
): SubscriptionType {
  if (subscriptionsTypes.includes(subscriptionType as SubscriptionType)) {
    throw new Error(
      `Invalid SubscriptionType '${subscriptionType}', must be one of ${String(
        Object.keys(SubscriptionsConfiguration)
      )}`
    );
  }
  return subscriptionType as SubscriptionType;
}

export async function createCheckout(formData: FormData): Promise<{}> {
  const subscriptionType = ensureValidSubscriptionType(
    formData.get("subscriptionType")?.toString() || ""
  );
  const price = formData.get("price");

  const me = await fetchMe();
  const subscriptionConfig = SubscriptionsConfiguration[subscriptionType];

  const analyticsParams = readAnalyticsParamsFromCookie();

  const stripe = initStripe(
    SubscriptionsConfiguration[subscriptionType].stripeAccount
  );

  const checkoutSession = await StripeService(stripe).initializeCheckoutSession(
    subscriptionType,
    {
      email: me?.email || undefined, // TODO: don't require me as a parameter
      userPrice: subscriptionConfig.customPrice
        ? Math.max(
            subscriptionConfig.customPrice.min,
            price ? Number(price) : 0
          ) * 100
        : undefined,
      analytics: analyticsParams,
    }
  );

  if (!checkoutSession.client_secret) {
    throw new Error("No client_secret in checkout session");
  }

  cookies().set(CHECKOUT_SESSION_ID_COOKIE, checkoutSession.id, {
    expires: 1000 * 60 * 30, // expire after30min
  });

  redirect(`/angebot/${subscriptionType}`);
}
