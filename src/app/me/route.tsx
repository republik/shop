import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/apollo/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  headers(); // opt out of caching 🤡
  const res = await getClient().query({
    query: MeDocument,
  });

  return NextResponse.json(res.data.me);
};
