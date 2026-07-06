"use server";

import { RequestAccessDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client-server";

type RequestAccessState =
  | { type: "idle" }
  | { type: "success" }
  | { type: "error"; message: string };

export async function requestAccess(
  campaignId: string,
  motivation: string,
): Promise<RequestAccessState> {
  const gql = await getClient();
  const { data, error } = await gql.mutation(RequestAccessDocument, {
    campaignId,
    payload: { source: "first-time-voters-landingpage", motivation },
  });

  if (error || !data?.requestAccess) {
    const message =
      error?.graphQLErrors?.[0]?.message ?? "requestAccess failed";
    console.error("requestAccess error", message);
    return { type: "error", message };
  }

  return { type: "success" };
}
