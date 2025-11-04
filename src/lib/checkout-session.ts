import {
  GetCheckoutSessionDocument,
  type GetCheckoutSessionQuery,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export type CheckoutSessionData = NonNullable<
  GetCheckoutSessionQuery["checkoutSession"]
>;

export async function getCheckoutSession({
  orderId,
}: {
  orderId: string;
}): Promise<CheckoutSessionData | undefined> {
  const gql = await getClient();

  const { data } = await gql.query(GetCheckoutSessionDocument, {
    orderId,
  });

  return data?.checkoutSession ?? undefined;
}
