"use server";

import { getSubscriptionsConfiguration } from "@/app/angebot/[slug]/lib/get-config";
import {
  ANALYTICS_COOKIE_NAME,
  AnalyticsObject,
  fromAnalyticsCookie,
} from "@/lib/analytics";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CHECKOUT_SESSION_ID_COOKIE } from "./components/checkout";
import { initStripe } from "./lib/stripe/server";
import { StripeService } from "./lib/stripe/service";

function readAnalyticsParamsFromCookie(): AnalyticsObject {
  const cookie = cookies().get(ANALYTICS_COOKIE_NAME);
  if (!cookie) {
    return {};
  }
  return fromAnalyticsCookie(cookie.value);
}

export async function createCheckout(formData: FormData): Promise<void> {
  const subscriptionType = formData.get("subscriptionType")?.toString() ?? "";
  const price = formData.get("price");

  const subscriptionConfig = getSubscriptionsConfiguration(subscriptionType);

  const analyticsParams = readAnalyticsParamsFromCookie();

  const stripe = initStripe(subscriptionConfig.stripeAccount);

  const checkoutSession = await StripeService(stripe).initializeCheckoutSession(
    subscriptionType,
    {
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
