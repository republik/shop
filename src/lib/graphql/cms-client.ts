import { Client, fetchExchange } from "@urql/core";

export function getCMSClient() {
  const headers: Record<string, string> = {
    Authorization: process.env.DATO_CMS_API_TOKEN,
    "X-Exclude-Invalid": "true",
  };

  if (process.env.DATO_CMS_ENVIRONMENT) {
    headers["X-Environment"] = process.env.DATO_CMS_ENVIRONMENT;
  }

  if (process.env.DATO_CMS_INCLUDE_DRAFTS === "true") {
    headers["X-Include-Drafts"] = "true";
  }

  return new Client({
    url: process.env.DATO_CMS_API_URL,
    exchanges: [fetchExchange],
    requestPolicy: "network-only",
    fetchOptions: {
      headers,
      cache: "no-store",
    },
  });
}
