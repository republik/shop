import { LoginForm } from "@/app/(auth)/login/login-form";
import { css } from "@/theme/css";
import { container } from "@/theme/patterns";

export default function Page() {
  return (
    <div className={container()}>
      <h1 className={css({ textStyle: "h1Sans", mb: "8" })}>
        Melden Sie sich an
      </h1>
      <LoginForm />
    </div>
  );
}
