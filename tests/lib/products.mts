type ProductTest = {
  id: string;
  offerId: string;
  name: string;
  expectedAmount: string | RegExp;
  requiresAddress: boolean;
  requiresLogin: boolean;
  promoCode?: string;
  donationOption?: { name: string; amount?: string };
};

export const PRODUCTS: ProductTest[] = [
  {
    id: "monthly",
    offerId: "MONTHLY",
    name: "Monats-Abo",
    expectedAmount: "11",
    requiresAddress: false,
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
    id: "yearly (with donation)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    donationOption: { name: "CHF 20.00" },
    expectedAmount: "242",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with custom donation)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    donationOption: { name: "Betrag", amount: "333" },
    expectedAmount: "555",
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
    id: "benefactor",
    offerId: "BENEFACTOR",
    name: "Gönnerschaft",
    expectedAmount: /1\.?000/, // account for formatting in Stripe embedded checkout
    requiresAddress: true,
    requiresLogin: true,
  },
];

export const GIFTS: ProductTest[] = [
  {
    id: "gift (yearly)",
    offerId: "GIFT_YEARLY",
    name: "Geschenk-Mitgliedschaft",
    expectedAmount: "222",
    requiresAddress: true,
    requiresLogin: false,
  },
  {
    id: "gift (monthly)",
    offerId: "GIFT_MONTHLY",
    name: "Geschenk-Abo",
    expectedAmount: "48",
    requiresAddress: false,
    requiresLogin: false,
  },
];
