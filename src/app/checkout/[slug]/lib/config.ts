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

export const aboTypesMeta: Record<
  AboTypes,
  { title: string; description: string; projectR: boolean }
> = {
  MONTHLY: {
    title: "Monats-Abo",
    description: "Das Abo für XYZ",
    projectR: false,
  },
  YEARLY: {
    title: "Jahresmitgliedschaft",
    description: "Das reguläre Abo der Republik",
    projectR: true,
  },
  BENEFACTOR: {
    title: "Gönner-Mitgliedschaft",
    description: "Much cash, very wow",
    projectR: true,
  },
  CUSTOM: {
    title: "Wählen Sie Ihren Preis",
    description:
      "Sie können sich den regulären Preis nicht leisten? Oder wollen Sie uns noch mehr unterstützen? Hier können Sie den Preis für Ihr Abo selbst bestimmen.",
    projectR: true,
  },
} as const;
