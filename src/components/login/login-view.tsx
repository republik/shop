"use client";

import {
  SignOutDocument,
  type OfferCheckoutQuery,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { LoginForm } from "@/components/login/login-form";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useClient } from "urql";

const PRIVACY_POLICY_HREF = `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/datenschutz`;

export function useSignOut() {
  const gql = useClient();

  return () =>
    gql.mutation(SignOutDocument, {}).then(() => window.location.reload());
}

interface LoginViewProps {
  title?: string;
  description?: string;
  offer?: NonNullable<OfferCheckoutQuery["offer"]>;
}

export function LoginView({ title, description, offer }: LoginViewProps) {
  const t = useTranslations("checkout");

  return (
    <>
      <h1 className={css({ textStyle: "h2Sans" })}>
        {offer
          ? t("loginStep.email.titleOffer", { offerName: offer.name })
          : t("loginStep.email.title")}
      </h1>
      <LoginForm
        submitButtonText={t("actions.next")}
        loginFormHeader={
          <div className={css({ textAlign: "center" })}>
            <p>{description ?? t("loginStep.email.description")}</p>
          </div>
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
          <div className={css({ textAlign: "center" })}>
            <p>
              {t.rich("loginStep.code.description", {
                email: () => <strong>{email}</strong>,
              })}
            </p>
          </div>
        )}
      />
    </>
  );
}
