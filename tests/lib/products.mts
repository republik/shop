type ProductTest = {
  id: string;
  offerId: string;
  name: string;
  expectedAmount: string | RegExp;
  futureAmount?: string | RegExp;
  futurePriceDescription?: string | RegExp;
  requiresAddress: boolean;
  requiresLogin: boolean;
  promoCode?: string;
  donationOption?:
    | { name: string; interval?: string }
    | { amount: string; interval?: string };
  discountOption?: { name: string; reason: string };
};

export const PRODUCTS: ProductTest[] = [
  {
    id: "monthly",
    offerId: "MONTHLY",
    name: "Monats-Abo",
    expectedAmount: "22",
    futurePriceDescription: "pro Monat",
    requiresAddress: false,
    requiresLogin: true,
  },
  {
    id: "yearly",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "240",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "199",
    futureAmount: "240",
    futurePriceDescription: "im ersten Jahr, danach jährlich CHF 240",
    promoCode: "E2ETEST",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with multi-year promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "163",
    // futureAmount: "240",
    futurePriceDescription: "für 2 Jahre, danach jährlich CHF 240",
    promoCode: "COOL",
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
    donationOption: { name: "CHF 60" },
    expectedAmount: "300",
    futurePriceDescription: "pro Jahr",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with custom one-time donation)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    donationOption: { amount: "240", interval: "einmalig" },
    expectedAmount: "480",
    futureAmount: "240",
    futurePriceDescription: "im ersten Jahr, danach jährlich CHF 240",
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly (with donation AND promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    donationOption: { amount: "240" },
    expectedAmount: "439",
    promoCode: "E2ETEST",
    futureAmount: "480",
    futurePriceDescription: "im ersten Jahr, danach jährlich CHF 480",
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
  {
    id: "benefactor (with donation)",
    offerId: "BENEFACTOR",
    name: "Gönnerschaft",
    donationOption: { name: "CHF 500" },
    expectedAmount: /1\.?500/, // account for formatting in Stripe embedded checkout
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "benefactor (with custom donation)",
    offerId: "BENEFACTOR",
    name: "Gönnerschaft",
    donationOption: { amount: "750" },
    expectedAmount: /1\.?750/, // account for formatting in Stripe embedded checkout
    requiresAddress: true,
    requiresLogin: true,
  },
  {
    id: "yearly reduced",
    offerId: "YEARLY_REDUCED",
    name: "Mitgliedschaft",
    discountOption: { name: "CHF -120", reason: "Test" },
    expectedAmount: "120",
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
