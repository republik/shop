import Stripe from "stripe";
import { StripeAccount } from "./types";

const API_VERSION = "2020-08-27; custom_checkout_beta=v1";

// check env var is present or throw error
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getAccountPaymentsConfiguration(
  account: StripeAccount
): string {
  return getEnvVar(`STRIPE_PAYMENT_CONFIGURATION_${account}`);
}

function getStripeSecretKey(account: StripeAccount): string {
  return getEnvVar(`STRIPE_SECRET_KEY_${account}`);
}

export function initStripe(account: StripeAccount): Stripe {
  const stripePublishableKey = getStripeSecretKey(account);

  return new Stripe(stripePublishableKey, {
    // @ts-expect-error - custom_checkout_beta is not a valid API version
    apiVersion: API_VERSION,
  });
}
