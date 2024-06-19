"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AboTypes, checkoutConfig } from "./checkout/[slug]/lib/config";
import {
  AboPurchaseOptions,
  initAboPurchase,
} from "./checkout/[slug]/lib/action";

export async function initPurchase(
  aboType: AboTypes,
  userEmail?: string
): Promise<void> {
  const purchaseConfig: AboPurchaseOptions = checkoutConfig[aboType];
  const { clientSecret } = await initAboPurchase(purchaseConfig);
  // Keep track of the clientSecret in a cookie that lives for 1h
  cookies().set("checkout-clientSecret", clientSecret, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // expires in 1hour
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
  // redirect to the corresponding checkout page
  redirect(`/checkout/${aboType}`);
}
