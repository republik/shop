import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "../graphql/client";

export const fetchMe = async () => {
  const { data } = await getClient().query(MeDocument, {});
  return data?.me || null;
};
