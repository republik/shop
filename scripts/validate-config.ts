import { SubscriptionsConfiguration } from "@/app/angebot/[slug]/lib/config";
import { initStripe } from "@/app/angebot/[slug]/lib/stripe/server";
import { StripeAccount } from "@/app/angebot/[slug]/lib/stripe/types";
import { loadEnvConfig } from "@next/env";
import path from "path";
import Stripe from "stripe";

type ScriptEnvironment = "dev" | "production" | "test";

function isValidScriptEnvironment(
  environment: string
): environment is ScriptEnvironment {
  return ["dev", "production", "test"].includes(environment);
}

function readArgWithFallback(index: number, fallback: string): string {
  return process.argv[index] || fallback;
}

const environment = readArgWithFallback(2, "dev");
if (!isValidScriptEnvironment(environment)) {
  throw new Error("Invalid environment " + environment);
}

const projectRoot = path.join(__dirname, "../");
loadEnvConfig(projectRoot, environment === "dev");

async function checkStripeItemExists(
  account: StripeAccount,
  type: "price" | "taxRate" | "coupon",
  id: string,
  func?: (id: string) => Promise<unknown>
) {
  if (!func) {
    return;
  }
  const errMsg = `Stripe item '${type}' with id '${id}' not found for account ${account}`;
  try {
    const res = await func(id);
    if (!res) {
      throw new Error(errMsg);
    }
    return res;
  } catch (error) {
    // console.error(error);
    throw new Error(errMsg);
  }
}

/**
 * Checks the configuration of the stripe products and prices.
 * Check
 * @returns Promise<void>
 */
function validateStripeProductConfiguration() {
  const republikStripe = initStripe("REPUBLIK");
  const projectRStripe = initStripe("PROJECT_R");

  return Promise.all(
    Object.keys(SubscriptionsConfiguration).map(async (slug) => {
      const subscriptionConfig = SubscriptionsConfiguration[slug];
      const stripe =
        subscriptionConfig.stripeAccount === "REPUBLIK"
          ? republikStripe
          : projectRStripe;

      const stripePriceFromLookupKey = (
        lookupKey: string
      ): Promise<Stripe.Price> =>
        stripe.prices
          .list({
            lookup_keys: [lookupKey],
          })
          .then((prices) => {
            const price = prices.data?.[0] || null;
            if (!price) {
              throw new Error(`No price with lookup-key '${lookupKey}'`);
            }
            return price;
          });

      await checkStripeItemExists(
        subscriptionConfig.stripeAccount,
        "price",
        subscriptionConfig.lookupKey,
        stripePriceFromLookupKey
      );

      if (subscriptionConfig.taxRateId) {
        await checkStripeItemExists(
          subscriptionConfig.stripeAccount,
          "taxRate",
          subscriptionConfig.taxRateId,
          async (id) => {
            const taxRate = await stripe.taxRates.retrieve(id);
            return taxRate;
          }
        );
      }

      if (subscriptionConfig.couponId) {
        await checkStripeItemExists(
          subscriptionConfig.stripeAccount,
          "coupon",
          subscriptionConfig.couponId,
          async (id) => {
            const coupon = await stripe.coupons.retrieve(id);
            if (!coupon) {
              throw new Error(`Coupon ${id} not found`);
            }
            const price = await stripePriceFromLookupKey(
              subscriptionConfig.lookupKey
            );
            if (
              coupon.applies_to &&
              !coupon.applies_to.products.includes(price.product as string)
            ) {
              throw new Error(
                `Coupon ${id} can't be applied to product ${price.product} associated with price '${subscriptionConfig.lookupKey}'`
              );
            }
            return coupon;
          }
        );
      }

      console.log(
        `Stripe product configuration for subscription '${slug}' is valid`
      );
    })
  );
}

console.log("======> VALIDATING STRIPE PRODUCT CONFIGURATION");
validateStripeProductConfiguration().then(() => {
  console.log("======> VALIDATING STRIPE PRODUCT CONFIGURATION DONE");
});
