import { LogoutButton } from "@/components/login/logout-button";
import { fetchMe } from "@/lib/auth/fetch-me";

export async function LoginStatus() {
  const me = await fetchMe();

  if (!me) {
    return null;
  }

  return (
    <span>
      Angemeldet als <strong>{me?.email}</strong>{" "}
      <LogoutButton>Abmelden</LogoutButton>
    </span>
  );
}
