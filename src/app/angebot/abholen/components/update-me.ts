"use server";

import { UpdateMeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

import * as z from "zod";

const MeInput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    postalCode: z.string(),
    city: z.string(),
    country: z.string(),
  }),
});

export async function updateMe(
  previousState: any,
  formData: FormData
): Promise<{ error: { message: string } } | {}> {
  const input = MeInput.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address: {
      name: formData.get("name"),
      line1: formData.get("line1"),
      line2: formData.get("line2"),
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country"),
    },
  });

  if (input.error) {
    console.dir(input.error, { depth: 99 });
    return { ok: false, error: { message: input.error.message } };
  }

  if (input.data) {
    const { error, data } = await getClient().mutation(
      UpdateMeDocument,
      input.data
    );

    if (error) {
      console.log(error);
      return { ok: false, error: { message: error.message } };
    }
  }

  return { ok: true };
}
