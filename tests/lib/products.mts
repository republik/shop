export const PRODUCTS = [
  {
    id: "monthly",
    offerId: "MONTHLY",
    name: "Monats-Abo",
    expectedAmount: "11",
  },
  {
    id: "yearly",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "222",
    requiresAddress: true,
  },
  {
    id: "yearly (with promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "199",
    promoCode: "E2ETEST",
    requiresAddress: true,
  },
  {
    id: "yearly (with invalid promo code)",
    offerId: "YEARLY",
    name: "Jahresmitgliedschaft",
    expectedAmount: "240",
    promoCode: "NOPE",
    requiresAddress: true,
  },
  {
    id: "student",
    offerId: "STUDENT",
    name: "Ausbildungs-Mitgliedschaft",
    expectedAmount: "140",
    requiresAddress: true,
  },
];

export const GIFTS = [
  // { offerId: "GIFT_MONTHLY", Geschenk" },
  { offerId: "GIFT_YEARLY" },
];
