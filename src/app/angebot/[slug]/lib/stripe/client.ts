"use client";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { StripeAccount } from "./types";

export function getStripePublishablekey(account: StripeAccount): string {
  switch (account) {
    case "REPUBLIK":
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK;
    case "PROJECT_R":
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R;
    default:
      throw new Error(`Invalid account: ${account}`);
  }
}

export async function initStripe(account: StripeAccount): Promise<Stripe> {
  const stripePublishableKey = getStripePublishablekey(account);

  const stripe = await loadStripe(stripePublishableKey, {
    betas: ["custom_checkout_beta_2"],
  });
  if (!stripe) {
    throw new Error("Failed to load Stripe");
  }
  return stripe;
}
