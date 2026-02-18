import "server-only";
import { Client, fetchExchange } from "@urql/core";
import { headers } from "next/headers";

/**
 * Get a pre-configured urql-client instance.
 * @returns {Client} urql-client
 */
export async function getClient(): Promise<Client> {
  const requestHeaders = await headers();

  const client = new Client({
    url: process.env.API_URL,
    exchanges: [fetchExchange],
    requestPolicy: "network-only",
    preferGetMethod: false,
    fetchOptions: {
      headers: {
        cookie: requestHeaders.get("cookie") ?? "",
        authorization: requestHeaders.get("authorization") ?? "",
        "x-api-gateway-client": process.env.API_GATEWAY_CLIENT ?? "",
        "x-api-gateway-token": process.env.API_GATEWAY_TOKEN ?? "",
      },
      credentials: "include",
      cache: "no-store",
    },
  });

  return client;
}
