"use server";

import { UpdateMeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

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
): Promise<
  { ok: false; errors: Record<string, string> } | { ok: true; errors: null }
> {
  const input = MeInput.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      ok: false,
      errors: Object.fromEntries(
        input.error.errors.map((e) => [e.path[0], "valueMissing"])
      ),
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
      // TODO: figure out which errors are actually happening

      return { ok: false, errors: {} };
    }
  }

  return { ok: true, errors: null };
}
