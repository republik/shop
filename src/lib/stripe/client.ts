"use client";
import { loadStripe as stripeLoadStripe, type Stripe } from "@stripe/stripe-js";

export function getStripePublishablekey(company: string): string {
  switch (company) {
    case "REPUBLIK":
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK;
    case "PROJECT_R":
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R;
    default:
      throw new Error(`Invalid account: ${company}`);
  }
}

export async function loadStripe(company: string): Promise<Stripe | null> {
  const stripePublishableKey = getStripePublishablekey(company);

  return stripeLoadStripe(stripePublishableKey, {
    betas: ["custom_checkout_beta_2"],
  });
}
