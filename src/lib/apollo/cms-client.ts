import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/experimental-nextjs-app-support";
import { HttpLink } from "@apollo/client";

/**
 * Get a apollo client to interact with DatoCMS on the server.
 *
 * @returns ApolloClient to interact with DatoCMS
 */

export const {
  getClient: getCMSClient,
  query: queryCMS,
  PreloadQuery: PreloadCMSQuery,
} = registerApolloClient(() => {
  if (!process.env.DATO_CMS_API_URL) {
    throw new Error("Missing DatoCMS API URL");
  }
  if (!process.env.DATO_CMS_API_TOKEN) {
    throw new Error("Missing DatoCMS API token");
  }

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

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.DATO_CMS_API_URL,
      headers,
    }),
  });
});
