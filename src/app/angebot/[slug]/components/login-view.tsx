"use client";

import { LoginForm } from "@/app/(auth)/login/login-form";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import Trans from "next-translate/Trans";
import Link from "next/link";
import { useClient } from "urql";
import { SignOutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { StepperChangeStepButton } from "@/app/angebot/[slug]/components/stepper";

const PRIVACY_POLICY_HREF = `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`;

export function StepperSignOutButton() {
  const gql = useClient();

  return (
    <StepperChangeStepButton
      onChange={() => {
        gql.mutation(SignOutDocument, {}).then(() => window.location.reload());
      }}
    />
  );
}

interface LoginViewProps {}

export function LoginView(_: LoginViewProps) {
  const t = useTranslations("checkout");

  return (
    <LoginForm
      submitButtonText={t("actions.next")}
      loginFormHeader={
        <>
          <h1
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
            })}
          >
            {t("loginStep.email.title")}
          </h1>
          <p>{t("loginStep.email.description")}</p>
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
              i18nKey="loginStep.privacyPolicy"
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
            {t("loginStep.code.description", {
              email,
            })}
          </p>
          <button
            type="button" // Important, so this button isn't used to submit the form
            onClick={() => window.location.reload()}
            className={css({
              textDecoration: "underline",
              alignSelf: "flex-start",
            })}
          >
            {t("loginStep.code.changeEmailAction")}
          </button>
        </>
      )}
    />
  );
}
