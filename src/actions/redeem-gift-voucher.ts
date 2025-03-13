"use server";

import { RedeemGiftVoucherDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export async function redeemGiftVoucher(voucher: string) {
  const gql = await getClient();

  const res = await gql.mutation(RedeemGiftVoucherDocument, { voucher });

  if (res.error) {
    throw Error(res.error.message);
  }

  if (!res.data) {
    throw Error("no redeem result");
  }

  return res.data.redeemGiftVoucher;
}
