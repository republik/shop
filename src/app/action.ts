"use server";

import { cookies } from "next/headers";
import { initMonthlyAboPurchase } from "./checkout/lib/action";
import { redirect } from "next/navigation";

export async function initPurchase(): Promise<void> {
  const { clientSecret } = await initMonthlyAboPurchase();
  cookies().set("checkout-clientSecret", clientSecret, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // expires in 1hour
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
  redirect("/checkout");
}
