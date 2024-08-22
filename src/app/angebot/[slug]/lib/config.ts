import { SubscriptionConfiguration } from "./stripe/types";

export const SubscriptionsConfiguration: Record<
  string,
  SubscriptionConfiguration
> = {
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
  },
  STUDENT: {
    stripeAccount: "PROJECT_R",
    productId: "prod_G7dVG5BtM4wDxl",
    priceId: "price_1PTg6ZFHX910KaTHlAFB6YvK",
  },
  CUSTOM: {
    stripeAccount: "PROJECT_R",
    productId: "prod_G7dVG5BtM4wDxl",
    priceId: "price_1PMWNCFHX910KaTH4xiYtyqW",
    customPrice: true,
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
