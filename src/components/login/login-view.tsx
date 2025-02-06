"use client";

import { SignOutDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { LoginForm } from "@/components/login/login-form";
import { StepperChangeStepButton } from "@/checkout/components/stepper";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useClient } from "urql";

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

interface LoginViewProps {
  title?: string;
  description?: string;
}

export function LoginView({ title, description }: LoginViewProps) {
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
            {title ?? t("loginStep.email.title")}
          </h1>
          <p>{description ?? t("loginStep.email.description")}</p>
        </>
      }
      loginFormInfo={
        <>
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            {t.rich("loginStep.privacyPolicy", {
              privacyLink: (chunks) => (
                <Link
                  key="privacyPolicyLink"
                  href={PRIVACY_POLICY_HREF}
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </>
      }
      renderCodeFormHint={(email) => (
        <>
          <p>
            {t.rich("loginStep.code.description", {
              email: () => <strong>{email}</strong>,
            })}
          </p>
        </>
      )}
    />
  );
}
