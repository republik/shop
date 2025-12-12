import {
  CompanyName,
  MeDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import type { Me } from "./types";

export async function fetchMe(): Promise<Me | undefined> {
  const gql = await getClient();
  const { data, error } = await gql.query(MeDocument, {});
  if (error) {
    throw new Error(error.message, {
      ...error,
    });
  }
  return data?.me || undefined;
}
