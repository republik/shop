"use server";

import { UpdateMeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import { getTranslations } from "next-intl/server";

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

export async function updateMe(
  previousState: any,
  formData: FormData
): Promise<{ ok: false; errors: string[] } | { ok: true }> {
  const t = getTranslations("formValidation");

  const input = MeInput.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    name: formData.get("name"),
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),
  });

  if (input.error) {
    console.dir(input.error, { depth: 99 });
    return {
      ok: false,
      errors: input.error.errors.map((e) => e.path[0]),
    };
  }

  if (input.data) {
    const { error, data } = await getClient().mutation(UpdateMeDocument, {
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
      console.log(error);
      return { ok: false, error: { message: error.message } };
    }
  }

  return { ok: true };
}
