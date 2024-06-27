import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { fetchMe } from "@/lib/auth/fetch-me";
import { getClient } from "@/lib/graphql/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  headers(); // opt out of caching 🤡
  const me = await fetchMe();
  return NextResponse.json(me);
};
