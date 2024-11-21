import {
  CompanyName,
  MeDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "../graphql/client";
import { Me } from "./types";

export async function fetchMe(stripeCompany?: CompanyName): Promise<Me | null> {
  const { data, error } = await getClient().query(MeDocument, {
    stripeCompany: stripeCompany ?? null,
  });
  if (error) {
    throw new Error(error.message, {
      ...error,
    });
  }
  return data?.me || null;
}
