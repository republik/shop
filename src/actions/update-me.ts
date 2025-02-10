"use server";

import {
  RedeemGiftVoucherDocument,
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

type UpdateMeState =
  | { ok: false; errors: Record<string, string> }
  | { ok: true; errors: Record<string, string> };

export async function updateMe(
  previousState: UpdateMeState,
  formData: FormData
): Promise<UpdateMeState> {
  const gql = await getClient();
  const data = Object.fromEntries(formData);
  const input = MeInput.safeParse(data);
  const code = CodeInput.safeParse(data.code);

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

  if (redeemError) {
    return { ok: false, errors: {} };
  }

  redirect(
    `/angebot/abholen?success=true&aboType=${redeemData?.redeemGiftVoucher?.aboType}&starting=${redeemData?.redeemGiftVoucher?.starting}`
  );

  return { ok: true, errors: {} };
}
