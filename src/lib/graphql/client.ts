import { GraphQLClient } from "graphql-request";
import { headers } from "next/headers";

export function getClient() {
  const reqHeaders = {
    cookie: headers().get("cookie") ?? "",
    accept: headers().get("accept") ?? "",
    Authorization: headers().get("Authorization") ?? "",
  };
  return new GraphQLClient(process.env.NEXT_PUBLIC_API_URL, {
    headers: reqHeaders,
    credentials: "include",
    cache: "no-store",
  });
}
