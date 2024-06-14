import { initStripe } from "./stripe/server";

const monthlyAboProductId = "prod_Ccmy87SuPqF5OM";

type MonthlyAboPurchase = {
  clientSecret: string;
};

export async function initMonthlyAboPurchase(): Promise<MonthlyAboPurchase> {
  const stripe = initStripe("REPUBLIK");

  const monthlyAboProduct = await stripe.products.retrieve(monthlyAboProductId);
  // const price = await stripe.prices.retrieve(monthlyAboApiID);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "chf",
          product: monthlyAboProduct.id,
          unit_amount: 2200,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    billing_address_collection: "required",
    mode: "subscription",
    ui_mode: "custom" as any,
    // The URL of your payment completion page
    return_url: `${process.env.NEXT_PUBLIC_URL}/foo`,
  });

  if (!session.client_secret) {
    throw new Error("Missing client secret");
  }

  return {
    clientSecret: session.client_secret,
  };
}
