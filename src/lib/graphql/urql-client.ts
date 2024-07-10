import { Client, fetchExchange } from "@urql/core";
import { cookies, headers } from "next/headers";
import { parse } from "set-cookie-parser";

export function getClient() {
  const reqHeaders = {
    cookie: headers().get("cookie") ?? "",
    accept: headers().get("accept") ?? "",
    Authorization: headers().get("Authorization") ?? "",
  };

  const client = new Client({
    url: process.env.NEXT_PUBLIC_API_URL,
    exchanges: [fetchExchange],
    requestPolicy: "network-only",
    fetchOptions: {
      headers: reqHeaders,
      credentials: "include",
      cache: "no-store",
    },
    // Intercept fetch response from API to re-send cookies to the client
    async fetch(...args) {
      const res = await fetch(...args);
      const setCookies = parse(res.headers.getSetCookie());
      for (const cookie of setCookies) {
        cookies().set(cookie);
      }
      return res;
    },
  });

  return client;
}
