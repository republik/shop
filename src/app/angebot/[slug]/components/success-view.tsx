"use client";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import type { CheckoutSessionData } from "@/app/angebot/[slug]/lib/stripe/server";
import useInterval from "@/lib/hooks/use-interval";
import useTimeout from "@/lib/hooks/use-timeout";
import { css } from "@/theme/css";
import { CheckCircleIcon, HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "urql";

type SuccessProps = {
  offer: { id: string; name: string };
  session: CheckoutSessionData;
};

const linkStyle = css({
  borderRadius: "sm",
  fontSize: "md",
  whiteSpace: "nowrap",
  px: "4",
  py: "2",
  display: "inline-block",
  fontWeight: "medium",
  textAlign: "center",
  background: "text",
  color: "text.inverted",
});

const containerStyle = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "4",
  textAlign: "center",
  margin: "auto",
});

export function SubscriptionSuccess({ offer, session }: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.subscription");

  const [meRes, refetchMe] = useQuery({
    query: MeDocument,
  });

  const ready = !!meRes.data?.me?.activeMagazineSubscription || true;

  const [
    startCheckingForActiveSubscription,
    setStartCheckingForActiveSubscription,
  ] = useState(false);

  const plausible = usePlausible();

  useEffect(() => {
    plausible("Checkout Success", { props: { offer: offer.id } });
  }, [plausible, offer.id]);

  useTimeout(() => {
    setStartCheckingForActiveSubscription(true);
  }, 1_000);

  useInterval(
    () => {
      refetchMe({
        requestPolicy: "network-only",
      });
    },
    startCheckingForActiveSubscription ? 1_000 : null
  );

  // useEffect(() => {
  //   if (
  //     startCheckingForActiveSubscription &&
  //     meRes.data?.me?.activeMagazineSubscription
  //   ) {
  //     window.location.assign(
  //       `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten?context=pledge&package=ABO`
  //     );
  //   }
  // }, [meRes.data, startCheckingForActiveSubscription]);

  return (
    <div className={containerStyle}>
      <CheckCircleIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("title")}
      </h1>
      {ready ? (
        <>
          <p className={css({ mb: "4" })}>{t("ready")}</p>
          <Link
            className={linkStyle}
            href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten?context=pledge&package=ABO`}
          >
            {t("action")}
          </Link>
        </>
      ) : (
        <p>{t("waiting")}</p>
      )}
    </div>
  );
}

export function GiftSuccess({ offer, session }: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.gift");

  const plausible = usePlausible();

  useEffect(() => {
    plausible("Checkout Success", { props: { offer: offer.id } });
  }, [plausible, offer.id]);

  return (
    <div className={containerStyle}>
      <CheckCircleIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("title")}
      </h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">
              {session.email}
            </strong>
          ),
        })}
      </p>
      <Link
        className={linkStyle}
        href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}
      >
        {t("action")}
      </Link>
    </div>
  );
}

export function RedeemSuccess({
  email,
  // aboType
  // starting
}: {
  email: string;
  // aboType: string;
  // starting: string;
}) {
  const t = useTranslations("checkout.checkout.success.redeem");

  const plausible = usePlausible();

  // useEffect(() => {
  //   plausible("Redeem Success", { props: { offer: aboType } });
  // }, [plausible, aboType]);

  return (
    <div className={containerStyle}>
      <HeartIcon
        className={css({
          height: "10",
          width: "10",
          fill: "[#B7A5EC]",
        })}
      />
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("title")}
      </h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">{email}</strong>
          ),
        })}
      </p>
      <Link
        className={linkStyle}
        href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}
      >
        {t("action")}
      </Link>
    </div>
  );
}
