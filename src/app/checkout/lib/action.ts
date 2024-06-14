import { initStripe } from "./stripe/server";

const monthlyAboApiID = "MONTHLY_ABO";

type MonthlyAboPurchase = {
  clientSecret: string;
};

export async function initMonthlyAboPurchase(): Promise<MonthlyAboPurchase> {
  const stripe = initStripe("REPUBLIK");

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "custom" as any,
    // The URL of your payment completion page
    return_url: "/foo",
  });

  if (!session.client_secret) {
    throw new Error("Missing client secret");
  }

  return {
    clientSecret: session.client_secret,
  };
}
