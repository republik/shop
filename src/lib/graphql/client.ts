"use server";
import { Client, fetchExchange } from "@urql/core";
import { cookies, headers } from "next/headers";

interface GetClientOptions {
  // In case of actions or route-handlers, the received cookies can be set via nextjs' `cookies` accessor.
  setReceivedCookies?: boolean;
}

/**
 * Get a pre-configured urql-client instance.
 * @param {GetClientOptions} options
 * @returns {Client} urql-client
 */
export async function getClient(
  options: GetClientOptions = {
    setReceivedCookies: false,
  }
): Promise<Client> {
  const _headers = await headers();
  const _cookies = await cookies();
  const reqHeaders = {
    cookie: _headers.get("cookie") ?? "",
    accept: _headers.get("accept") ?? "",
    Authorization: _headers.get("Authorization") ?? "",
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
  });

  return client;
}
