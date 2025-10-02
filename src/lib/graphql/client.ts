"use server";
import { Client, fetchExchange } from "@urql/core";
import { headers } from "next/headers";

/**
 * Get a pre-configured urql-client instance.
 * @param {GetClientOptions} options
 * @returns {Client} urql-client
 */
export async function getClient(): Promise<Client> {
  const _headers = await headers();

  const reqHeaders = {
    cookie: _headers.get("cookie") ?? "",
    Authorization: _headers.get("Authorization") ?? "",
  };

  const client = new Client({
    url: process.env.NEXT_PUBLIC_API_URL,
    exchanges: [fetchExchange],
    requestPolicy: "network-only",
    preferGetMethod: false,
    fetchOptions: {
      headers: reqHeaders,
      credentials: "include",
      cache: "no-store",
    },
  });

  return client;
}
