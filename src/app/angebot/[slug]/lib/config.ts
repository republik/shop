import { SubscriptionConfiguration } from "./stripe/types";

export const SubscriptionsConfiguration: Record<
  string,
  SubscriptionConfiguration
> = {
  MONTHLY: {
    stripeAccount: "REPUBLIK",
    // productId: "prod_Ccmy87SuPqF5OM",
    // priceId: "MONTHLY_ABO",
    lookupKey: "MONTHLY_ABO",
    taxRateId: "txr_1PqUouD5iIOpR5wNiT5EiKld",
    couponCode: "jgxhEDj9",
  },
  YEARLY: {
    stripeAccount: "PROJECT_R",
    // productId: "prod_G7dVG5BtM4wDxl",
    // priceId: "ABO-SUB",
    lookupKey: "ABO",
  },
  BENEFACTOR: {
    stripeAccount: "PROJECT_R",
    // productId: "prod_G7dVG5BtM4wDxl",
    // priceId: "price_1PMVJrFHX910KaTHymVJY6Vp",
    lookupKey: "BENEFACTOR_ABO",
    metaData: {
      isBenefactor: "true",
    },
  },
  STUDENT: {
    stripeAccount: "PROJECT_R",
    // productId: "prod_G7dVG5BtM4wDxl",
    // priceId: "price_1PTg6ZFHX910KaTHlAFB6YvK",
    lookupKey: "STUDENT_ABO",
    metaData: {
      isStudent: "true",
    },
  },
  CUSTOM: {
    stripeAccount: "PROJECT_R",
    // productId: "prod_G7dVG5BtM4wDxl",
    // priceId: "price_1PMWNCFHX910KaTH4xiYtyqW",
    lookupKey: "CUSTOM_ABO",
    customPrice: {
      max: 1000,
      min: 240,
      step: 5,
      recurring: {
        interval: "year",
        interval_count: 1,
      },
    },
  },
} as const;

export type SubscriptionTypes = keyof typeof SubscriptionsConfiguration;

export type SubscriptionMeta = {
  title: string;
  description: string;
  projectR: boolean;
  // Predicate to check if a logged in user can buy the product.
  upsellNode?: JSX.Element;
};

export const SubscriptionsMeta: Record<SubscriptionTypes, SubscriptionMeta> = {
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
