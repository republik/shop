import { OfferCheckoutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export async function fetchOffer(offerId: string, promoCode?: string) {
  const gql = await getClient();

  const { data } = await gql.query(
    OfferCheckoutDocument,
    {
      offerId,
      promoCode,
    },
    {
      fetchOptions: {
        // Should be safe because cache keys use headers
        cache: "force-cache",
        next: {
          revalidate: 60,
        },
      },
    }
  );

  return data?.offer ?? undefined;
}
