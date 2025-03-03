type ProductTest = {
  id: string;
  offerId: string;
  name: string;
  expectedAmount: string;
  requiresAddress: boolean;
  requiresLogin: boolean;
  promoCode?: string;
};

export const PRODUCTS: ProductTest[] = [
  {
    id: "monthly",
    offerId: "MONTHLY",
    name: "Monats-Abo",
    expectedAmount: "11",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "222",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "199",
    promoCode: "E2ETEST",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with invalid promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "240",
    promoCode: "NOPE",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "student",
    offerId: "STUDENT",
    name: "Ausbildungs-Mitgliedschaft",
    expectedAmount: "140",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "gift (yearly)",
    offerId: "GIFT_YEARLY",
    name: "Geschenk-Mitgliedschaft",
    expectedAmount: "222",
    requiresAddress: true,
    requiresLogin: false,
  },
];
