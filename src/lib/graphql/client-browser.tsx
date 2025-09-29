"use client";
import { type ReactNode } from "react";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

const client = new Client({
  url: process.env.NEXT_PUBLIC_API_URL,
  exchanges: [cacheExchange, fetchExchange],
  preferGetMethod: false,
  fetchOptions: {
    credentials: "include",
    cache: "no-store",
  },
});

export function GraphQLProvider({ children }: { children: ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}
