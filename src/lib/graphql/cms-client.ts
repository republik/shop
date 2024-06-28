/**
 * Get a apollo client to interact with DatoCMS on the server.
 *
 * @returns ApolloClient to interact with DatoCMS
 */

import { GraphQLClient } from "graphql-request";

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

  return new GraphQLClient(process.env.DATO_CMS_API_URL, {
    headers,
  });
}
