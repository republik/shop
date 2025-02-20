"use server";

import {
  RedeemGiftResult,
  RedeemGiftVoucherDocument,
  RedeemGiftVoucherMutation,
  UpdateMeDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import { redirect } from "next/navigation";

import * as z from "zod";

const MeInput = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  name: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  postalCode: z.string(),
  city: z.string(),
  country: z.string(),
});

const CodeInput = z.string();

type UpdateMeResult =
  | { ok: false; errors: Record<string, string> }
  | { ok: true; errors: Record<string, string> };

async function updateMe(
  data: Record<string, FormDataEntryValue>
): Promise<UpdateMeResult> {
  const gql = await getClient();
  const input = MeInput.safeParse(data);

  if (input.error) {
    return {
      ok: false,
      errors: Object.fromEntries(
        input.error.errors.map((e) => [e.path[0], "valueMissing"])
      ),
    };
  }

  if (input.data) {
    const { error, data } = await gql.mutation(UpdateMeDocument, {
      firstName: input.data.firstName,
      lastName: input.data.lastName,
      address: {
        name: input.data.name,
        line1: input.data.line1,
        line2: input.data.line2,
        postalCode: input.data.postalCode,
        city: input.data.city,
        country: input.data.country,
      },
    });

    if (error) {
      // TODO: figure out which errors are actually happening
      console.dir(error.graphQLErrors, { depth: 3 });
      return { ok: false, errors: {} };
    }
  }

  return { ok: true, errors: {} };
}

type RedeemGiftVoucherState =
  | { ok: false; errors: Record<string, string> }
  | { ok: true; data: RedeemGiftResult; errors: Record<string, string> };

async function redeemGiftVoucher(
  data: Record<string, FormDataEntryValue>
): Promise<RedeemGiftVoucherState> {
  const gql = await getClient();

  const code = CodeInput.safeParse(data.code);

  if (code.error) {
    return {
      ok: false,
      errors: { code: "valueMissing" },
    };
  }

  const { data: redeemData, error: redeemError } = await gql.mutation(
    RedeemGiftVoucherDocument,
    { voucher: code.data }
  );

  if (redeemError || !redeemData?.redeemGiftVoucher) {
    return { ok: false, errors: {} };
  }

  return { ok: true, data: redeemData.redeemGiftVoucher, errors: {} };
}

export async function updateMeCheckout(
  previousState: UpdateMeResult,
  formData: FormData
): Promise<UpdateMeResult> {
  const data = Object.fromEntries(formData);

  const updateMeResult = await updateMe(data);

  return updateMeResult;
}

export async function updateMeRedeemGiftVoucher(
  previousState: UpdateMeResult,
  formData: FormData
): Promise<UpdateMeResult> {
  const data = Object.fromEntries(formData);

  const updateMeResult = await updateMe(data);

  if (!updateMeResult.ok) {
    return updateMeResult;
  }

  const redeemGiftVoucherResult = await redeemGiftVoucher(data);

  if (!redeemGiftVoucherResult.ok) {
    return redeemGiftVoucherResult;
  }

  redirect(
    `/angebot/abholen?success=true&aboType=${redeemGiftVoucherResult.data.aboType}&starting=${redeemGiftVoucherResult.data.starting}`
  );
}
