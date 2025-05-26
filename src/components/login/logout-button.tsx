"use client";

import { SignOutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { css } from "@/theme/css";
import { type ReactNode } from "react";
import { useClient } from "urql";

export function LogoutButton({ children }: { children: ReactNode }) {
  const gql = useClient();

  function signOut() {
    gql.mutation(SignOutDocument, {}).then(() => window.location.reload());
  }
  return (
    <button
      onClick={signOut}
      className={css({ textDecoration: "underline", cursor: "pointer" })}
    >
      {children}
    </button>
  );
}
