import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { LogoutButton } from "@/app/angebot/[slug]/components/logout-button";
import { Button } from "@/components/ui/button";
import { getClient } from "@/lib/graphql/client";
import { css } from "@/theme/css";

export async function LoginStatus() {
  const { data } = await getClient().query(MeDocument, {});

  if (!data?.me) {
    return null;
  }

  return (
    <div className={css({ fontSize: "sm" })}>
      Angemeldet als <strong>{data?.me?.email}</strong>{" "}
      <LogoutButton>Abmelden</LogoutButton>
    </div>
  );
}
