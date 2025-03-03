import { LogoutButton } from "@/components/login/logout-button";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";

export async function LoginStatus() {
  const me = await fetchMe();

  if (!me) {
    return null;
  }

  return (
    <div className={css({ fontSize: "sm" })}>
      Angemeldet als <strong>{me?.email}</strong>{" "}
      <LogoutButton>Abmelden</LogoutButton>
    </div>
  );
}
