import { OfferCheckoutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export async function fetchOffer(offerId: string) {
  const gql = getClient();

  const { data } = await gql.query(OfferCheckoutDocument, { offerId });

  return data?.offer;
}
