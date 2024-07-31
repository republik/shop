"use client";

import { LoginForm } from "@/app/(auth)/login/login-form";
import { css } from "@/theme/css";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import Link from "next/link";

const PRIVACY_POLICY_HREF = `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`;

interface LoginViewProps {
  logoutAction: () => Promise<void>;
}

export function LoginView(props: LoginViewProps) {
  const { t } = useTranslation("shop");
  return (
    <LoginForm
      submitButtonText={t("checkout:actions.next")}
      loginFormHeader={
        <>
          <h1
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
            })}
          >
            {t("checkout:loginStep.email.title")}
          </h1>
          <p>{t("checkout:loginStep.email.description")}</p>
        </>
      }
      loginFormInfo={
        <>
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            <Trans
              i18nKey="checkout:loginStep.privacyPolicy"
              components={[
                <Link
                  key="privacyPolicyLink"
                  href={PRIVACY_POLICY_HREF}
                  target="_blank"
                />,
              ]}
            />
          </p>
        </>
      }
      renderCodeFormHint={(email) => (
        <>
          <p>
            {t("checkout:loginStep.code.description", {
              email,
            })}
          </p>
          <button
            onClick={() => props.logoutAction()}
            className={css({
              textDecoration: "underline",
              alignSelf: "flex-start",
            })}
          >
            {t("checkout:loginStep.code.changeEmailAction")}
          </button>
        </>
      )}
    />
  );
}
