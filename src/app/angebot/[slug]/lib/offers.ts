import { GetOfferDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export async function fetchOffer(offerId: string, promoCode?: string) {
  const gql = getClient();

  const { data } = await gql.query(GetOfferDocument, { offerId, promoCode });

  return data?.offer;
}
