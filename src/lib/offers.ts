import { OfferCheckoutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export async function fetchOffer(offerId: string, promoCode?: string) {
  const gql = await getClient();

  const { data } = await gql.query(OfferCheckoutDocument, {
    offerId,
    promoCode,
  });

  return data?.offer ?? undefined;
}
