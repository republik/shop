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

      me: Me;
    }
  | {
      step: "ERROR";
      error: "NO_CODE" | "CODE_NOT_VALID";
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
  if (!voucher) {
    return { step: "ERROR", error: "NO_CODE" };
  }

  const me = await fetchMe();

  if (!me) {
    return {
      step: "LOGIN",
    };
  }

  if (step === "success") {
    return { step: "SUCCESS", me };
  }

  const { valid, company, isLegacyVoucher } = await validateVoucher(voucher);

  if (isLegacyVoucher) {
    return { step: "LEGACY_CODE", voucher: voucher };
  }

  if (valid) {
    return {
      step: "INFO",
      addressRequired: company === "PROJECT_R",
      me,
      voucher,
      currentStep: 1,
      totalSteps: 1,
    };
  }

  return {
    step: "ERROR",
    error: "CODE_NOT_VALID",
    me,
  };
}
