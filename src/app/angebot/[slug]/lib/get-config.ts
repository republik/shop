import { SUBSCRIPTION_CONFIGURATIONS } from "@/app/angebot/[slug]/lib/config";
import { SubscriptionConfiguration } from "@/app/angebot/[slug]/lib/stripe/types";

export function getSubscriptionsConfiguration(
  key: string
): SubscriptionConfiguration {
  const configMode = process.env.NEXT_PUBLIC_PRODUCT_CONFIGURATION ?? "test";

  const config = SUBSCRIPTION_CONFIGURATIONS[configMode][key];

  if (!config) {
    throw new Error(`Invalid subscriptionType '${key}'`);
  }

  return config;
}
