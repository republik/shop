/**
 * ================================
 * Sample configuration for the checkout,
 * that we could extract to the CMS
 * ================================
 */

import { AboPurchaseOptions } from "./action";

export const checkoutConfig: Record<string, AboPurchaseOptions> = {
  MONTHLY: {
    stripeAccount: "REPUBLIK",
    productId: "prod_Ccmy87SuPqF5OM",
    priceId: "MONTHLY_ABO",
  },
  YEARLY: {
    stripeAccount: "PROJECT-R",
    productId: "prod_G7dVG5BtM4wDxl",
    priceId: "ABO-SUB",
  },
  BENEFACTOR: {
    stripeAccount: "PROJECT-R",

    productId: "prod_G7dVG5BtM4wDxl",
    priceId: "price_1PMVJrFHX910KaTHymVJY6Vp",
  },
  CUSTOM: {
    stripeAccount: "PROJECT-R",
    productId: "prod_G7dVG5BtM4wDxl",
    priceId: "price_1PMWNCFHX910KaTH4xiYtyqW",
  },
} as const;

export type AboTypes = keyof typeof checkoutConfig;
