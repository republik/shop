"use server";

import {
  RedeemGiftVoucherDocument,
  type RedeemGiftVoucherMutation,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

type RedeemGiftVoucherState =
  | { type: "error"; errors: Record<string, string> }
  | {
      type: "success";
      data: NonNullable<RedeemGiftVoucherMutation["redeemGiftVoucher"]>;
    };

export async function redeemGiftVoucher(
  voucher: string
): Promise<RedeemGiftVoucherState> {
  const gql = await getClient();

  const { data, error } = await gql.mutation(RedeemGiftVoucherDocument, {
    voucher,
  });

  if (error || !data?.redeemGiftVoucher) {
    // TODO: map errors
    return { type: "error", errors: {} };
  }

  return { type: "success", data: data.redeemGiftVoucher };
}
