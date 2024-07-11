"use client";

import { LoginForm } from "@/app/(auth)/login/login-form";
import { css } from "@/theme/css";
import Link from "next/link";

const PRIVACY_POLICY_HREF = `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`;

interface LoginViewProps {
  logoutAction: () => Promise<void>;
}

export function LoginView(props: LoginViewProps) {
  return (
    <LoginForm
      submitButtonText="Weiter"
      loginFormHeader={
        <>
          <h1
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
            })}
          >
            Login oder Konto eröffnen
          </h1>
          <p>
            Loggen Sie sich ein, oder erstellen Sie ein Republik Konto, um den
            Kauf abzuschliessen.
          </p>
        </>
      }
      loginFormInfo={
        <>
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            Mit der Anmeldung akzeptieren Sie die{" "}
            <Link href={PRIVACY_POLICY_HREF} target="_blank">
              Datenschutzbestimmungen
            </Link>
            .
          </p>
        </>
      }
      renderCodeFormHint={(email) => (
        <>
          <p>
            Wir haben Ihnen einen Code an
            {email} geschickt. Geben Sie ihn ein um ihre E-Mail Adresse zu
            bestätigen.
          </p>
          <button
            onClick={() => props.logoutAction()}
            className={css({
              textDecoration: "underline",
              alignSelf: "flex-start",
            })}
          >
            E-Mail-Adresse ändern
          </button>
        </>
      )}
    />
  );
}
