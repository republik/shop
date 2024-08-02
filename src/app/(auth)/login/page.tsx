import { LoginForm } from "@/app/(auth)/login/login-form";
import { fetchMe } from "@/lib/auth/fetch-me";
import { css } from "@/theme/css";
import { container } from "@/theme/patterns";
import { redirect } from "next/navigation";

export default async function Page() {
  const me = await fetchMe();

  if (me) {
    redirect("/");
  }

  return (
    <div className={container()}>
      <h1 className={css({ textStyle: "h1Sans", mb: "8" })}>
        Melden Sie sich an
      </h1>
      <LoginForm />
    </div>
  );
}
