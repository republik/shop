"use server";

import {
  type RedeemGiftResult,
  RedeemGiftVoucherDocument,
  UpdateMeDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

import * as z from "zod";

const Address = z.object({
  // name is required for the mutation but if not present, we assemble it from firstName and lastName
  name: z.string().optional(),
  line1: z.string().nonempty(),
  line2: z.string().optional(),
  postalCode: z.string().nonempty(),
  city: z.string().nonempty(),
  country: z.string().nonempty(),
});

const MeInput = z.discriminatedUnion("addressRequired", [
  z
    .object({
      addressRequired: z.literal("required"),
      firstName: z.string().nonempty(),
      lastName: z.string().nonempty(),
    })
    .merge(Address),
  z.object({
    addressRequired: z.literal("notRequired"),
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
  }),
]);

const CodeInput = z.string();

type UpdateMeState =
  | {
      type: "error";
      errors: Record<string, string>;
      data: Record<string, string | null | undefined>;
    }
  | {
      type: "success";
      errors?: Record<string, string>;
      data: Record<string, string | null | undefined>;
    }
  | {
      type: "initial";
      errors?: Record<string, string>;
      data: Record<string, string | null | undefined>;
    };

export async function updateMe(
  previousState: UpdateMeState,
  formData: FormData
): Promise<UpdateMeState> {
  const gql = await getClient();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const input = MeInput.safeParse(data);

  if (input.error) {
    return {
      type: "error",
      errors: Object.fromEntries(
        input.error.errors.map((e) => [e.path[0], "valueMissing"])
      ),
      data,
    };
  }

  if (input.data) {
    const { firstName, lastName } = input.data;
    const address = Address.safeParse(input.data);

    const res = await gql.mutation(UpdateMeDocument, {
      firstName,
      lastName,
      address: address.data
        ? {
            name: `${firstName} ${lastName}`,
            ...address.data,
          }
        : null,
    });

    if (res.data?.updateMe) {
      return { type: "success", errors: {}, data };
    }

    if (res.error) {
      // TODO: figure out which errors are actually happening
      console.dir(res.error.graphQLErrors, { depth: 3 });
      return { type: "error", errors: {}, data };
    }
  }
  return previousState;
}

type RedeemGiftVoucherState =
  | { type: "error"; errors: Record<string, string> }
  | { ok: true; data: RedeemGiftResult; errors: Record<string, string> };

async function redeemGiftVoucher(
  data: Record<string, FormDataEntryValue>
): Promise<RedeemGiftVoucherState> {
  const gql = await getClient();

  const code = CodeInput.safeParse(data.code);

  if (code.error) {
    return {
      type: "error",
      errors: { code: "valueMissing" },
    };
  }

  const { data: redeemData, error: redeemError } = await gql.mutation(
    RedeemGiftVoucherDocument,
    { voucher: code.data }
  );

  if (redeemError || !redeemData?.redeemGiftVoucher) {
    return { type: "error", errors: {} };
  }

  return { ok: true, data: redeemData.redeemGiftVoucher, errors: {} };
}

// export async function updateMeRedeemGiftVoucher(
//   previousState: UpdateMeResult,
//   formData: FormData
// ): Promise<UpdateMeResult> {
//   const data = Object.fromEntries(formData);

//   const updateMeResult = await updateMe(data);

//   if (!updateMeResult.ok) {
//     return updateMeResult;
//   }

//   const redeemGiftVoucherResult = await redeemGiftVoucher(data);

//   if (!redeemGiftVoucherResult.ok) {
//     return redeemGiftVoucherResult;
//   }

//   redirect(
//     `/angebot/abholen?success=true&aboType=${redeemGiftVoucherResult.data.aboType}&starting=${redeemGiftVoucherResult.data.starting}`
//   );
// }
