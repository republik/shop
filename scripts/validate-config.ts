import { SUBSCRIPTION_CONFIGURATIONS } from "@/app/angebot/[slug]/lib/config";
import { initStripe } from "@/app/angebot/[slug]/lib/stripe/server";
import { StripeAccount } from "@/app/angebot/[slug]/lib/stripe/types";
import { loadEnvConfig } from "@next/env";
import path from "path";

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
  type: "product" | "price" | "taxRate" | "coupon",
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

  const configMode = process.env.NEXT_PUBLIC_PRODUCT_CONFIGURATION ?? "test";
  const config = SUBSCRIPTION_CONFIGURATIONS[configMode];

  return Promise.all(
    Object.keys(config).map(async (slug) => {
      const subscriptionConfig = config[slug];
      const stripe =
        subscriptionConfig.stripeAccount === "REPUBLIK"
          ? republikStripe
          : projectRStripe;

      await checkStripeItemExists(
        subscriptionConfig.stripeAccount,
        "product",
        subscriptionConfig.productId,
        async (id) => {
          const product = await stripe.products.retrieve(id);
          return product;
        }
      );

      await checkStripeItemExists(
        subscriptionConfig.stripeAccount,
        "price",
        subscriptionConfig.priceId,
        async (id) => {
          const price = await stripe.prices.retrieve(id);
          if (price.product !== subscriptionConfig.productId) {
            throw new Error(
              `Product id ${subscriptionConfig.productId} does not match product associated with price id ${id}`
            );
          }
          return price;
        }
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

      if (subscriptionConfig.couponCode) {
        await checkStripeItemExists(
          subscriptionConfig.stripeAccount,
          "coupon",
          subscriptionConfig.couponCode,
          async (id) => {
            const coupon = await stripe.coupons.retrieve(id);
            if (
              coupon.applies_to &&
              !coupon.applies_to.products.includes(subscriptionConfig.productId)
            ) {
              throw new Error(
                `Coupon ${id} does not apply to product ${subscriptionConfig.productId}`
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
