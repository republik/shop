"use server";

import { UpdateMeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
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
