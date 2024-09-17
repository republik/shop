import { SubscriptionConfiguration } from "./stripe/types";

export const SUBSCRIPTION_CONFIGURATIONS: Record<
  string,
  Record<string, SubscriptionConfiguration>
> = {
  test: {
    MONTHLY: {
      stripeAccount: "REPUBLIK",
      productId: "prod_Ccmy87SuPqF5OM",
      priceId: "MONTHLY_ABO",
      taxRateId: "txr_1PqUouD5iIOpR5wNiT5EiKld",
      couponCode: "jgxhEDj9",
    },
    YEARLY: {
      stripeAccount: "PROJECT_R",
      productId: "prod_G7dVG5BtM4wDxl",
      priceId: "ABO-SUB",
    },
    BENEFACTOR: {
      stripeAccount: "PROJECT_R",
      productId: "prod_G7dVG5BtM4wDxl",
      priceId: "price_1PMVJrFHX910KaTHymVJY6Vp",
      metaData: {
        isBenefactor: "true",
      },
    },
    STUDENT: {
      stripeAccount: "PROJECT_R",
      productId: "prod_G7dVG5BtM4wDxl",
      priceId: "price_1PTg6ZFHX910KaTHlAFB6YvK",
      metaData: {
        isStudent: "true",
      },
    },
    CUSTOM: {
      stripeAccount: "PROJECT_R",
      productId: "prod_G7dVG5BtM4wDxl",
      priceId: "price_1PMWNCFHX910KaTH4xiYtyqW",
      customPrice: {
        max: 1000,
        min: 240,
        step: 5,
      },
    },
  },
  production: {
    MONTHLY: {
      stripeAccount: "REPUBLIK",
      productId: "prod_C7VZTy0Xao40t4",
      priceId: "MONTHLY_ABO",
      taxRateId: "txr_1Q00SXD5iIOpR5wNM71PX8nI",
      couponCode: "z943tBMK",
    },
    YEARLY: {
      stripeAccount: "PROJECT_R",
      productId: "prod_QprPOc48HYG6FO",
      priceId: "price_1PyBgDFHX910KaTHm6ZeAQiP",
    },
  },
} as const;

export type SubscriptionTypes = keyof typeof SUBSCRIPTION_CONFIGURATIONS;

export type SubscriptionMeta = {
  title: string;
  description: string;
  projectR: boolean;
  // Predicate to check if a logged in user can buy the product.
  upsellNode?: JSX.Element;
};

export const SUBSCRIPTION_META: Record<SubscriptionTypes, SubscriptionMeta> = {
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
  STUDENT: {
    title: "Ausbildungs-Mitgliedschaft",
    description: "Für Studierende und Auszubildende",
    projectR: true,
  },
  CUSTOM: {
    title: "Wählen Sie Ihren Preis",
    description:
      "Sie können sich den regulären Preis nicht leisten? Oder wollen Sie uns noch mehr unterstützen? Hier können Sie den Preis für Ihr Abo selbst bestimmen.",
    projectR: true,
  },
} as const;
