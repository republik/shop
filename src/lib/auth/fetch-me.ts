import {
  CompanyName,
  MeDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import { Me } from "./types";

export async function fetchMe(
  stripeCompany?: CompanyName
): Promise<Me | undefined> {
  const gql = await getClient();
  const { data, error } = await gql.query(MeDocument, {
    stripeCompany: stripeCompany ?? null,
  });
  if (error) {
    throw new Error(error.message, {
      ...error,
    });
  }
  return data?.me || undefined;
}
