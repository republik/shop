import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "../graphql/client";

export const fetchMe = async () => {
  const { me } = await getClient()
    .request(MeDocument)
    .catch(() => ({ me: null }));
  return me;
};
