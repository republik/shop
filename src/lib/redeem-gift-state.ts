"use server";

import { ValidateGiftVoucherDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { fetchMe } from "@/lib/auth/fetch-me";
import type { Me } from "@/lib/auth/types";
import { getClient } from "@/lib/graphql/client";

async function validateVoucher(voucher: string) {
  const gql = await getClient();
  const { data } = await gql.query(ValidateGiftVoucherDocument, {
    voucher,
  });

  return data?.validateGiftVoucher ?? { valid: false, isLegacyVoucher: false };
}

type GiftRedeemState =
  | {
      step: "LOGIN";
    }
  // | {
  //     step: "INITIAL";
  //     me?: Me;
  //     totalSteps: number;
  //     currentStep: number;
  //   }
  | {
      step: "INFO";
      addressRequired: boolean;
      me: Me;
      voucher: string;
      totalSteps: number;
      currentStep: number;
    }
  | {
      step: "SUCCESS";
      voucher: string;
      me: Me;
    }
  | {
      step: "REDEEM_FAILED";
      voucher: string;
      me: Me;
    }
  | {
      step: "ERROR";
      error: "VOUCHER_MISSING" | "VOUCHER_INVALID";
      voucher?: string;
      me?: Me;
    }
  | {
      step: "LEGACY_CODE";
      voucher: string;
      me?: Me;
    };

export async function getGiftRedeemState({
  step,
  voucher,
}: {
  step: string | undefined;
  voucher?: string;
}): Promise<GiftRedeemState> {
  const me = await fetchMe();

  if (!me) {
    return {
      step: "LOGIN",
    };
  }

  if (!voucher) {
    return { step: "ERROR", error: "VOUCHER_MISSING" };
  }

  if (step === "success") {
    return { step: "SUCCESS", voucher, me };
  }

  if (step === "redeem-failed") {
    return { step: "REDEEM_FAILED", voucher, me };
  }

  const { valid, company, isLegacyVoucher } = await validateVoucher(voucher);

  if (isLegacyVoucher) {
    return { step: "LEGACY_CODE", voucher };
  }

  if (!valid) {
    return {
      step: "ERROR",
      error: "VOUCHER_INVALID",
      me,
    };
  }

  return {
    step: "INFO",
    addressRequired: company === "PROJECT_R",
    me,
    voucher,
    currentStep: 1,
    totalSteps: 1,
  };
}
