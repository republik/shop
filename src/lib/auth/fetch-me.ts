import {
  MeDocument,
  MeQuery,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "../graphql/client";

export type Me = MeQuery["me"];

export async function fetchMe(): Promise<Me | null> {
  const { data, error } = await getClient().query(MeDocument, {});
  if (error) {
    throw new Error(error.message, {
      ...error,
    });
  }
  return data?.me || null;
}
