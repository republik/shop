"use client";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { CenterContainer } from "@/components/layout/center-container";
import { Button } from "@/components/ui/button";
import type { CheckoutState } from "@/lib/checkout-state";
import useInterval from "@/lib/hooks/use-interval";
import useTimeout from "@/lib/hooks/use-timeout";
import { css } from "@/theme/css";
import { CheckCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "urql";

type SuccessProps = {
  checkoutState: Extract<CheckoutState, { step: "SUCCESS" }>;
};

export function SubscriptionSuccess({
  checkoutState: { offer },
}: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.subscription");

  const [meRes, refetchMe] = useQuery({
    query: MeDocument,
  });

  const ready = !!meRes.data?.me?.activeMagazineSubscription;

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
    startCheckingForActiveSubscription ? 1_000 : null,
  );

  return (
    <CenterContainer>
      <CheckCircleIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
      {ready ? (
        <>
          <p>{t("ready", { offer: offer.id })}</p>
          <p className={css({ mb: "4" })}>
            {t.rich("tips", { b: (chunks) => <b>{chunks}</b> })}
          </p>
          <Button asChild size="large">
            <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten`}>
              {t("action")}
            </Link>
          </Button>
        </>
      ) : (
        <p>{t("waiting", { offer: offer.id })}</p>
      )}
    </CenterContainer>
  );
}

export function UpgradeSuccess({
  checkoutState: { offer, me, checkoutSession },
}: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.upgrade");

  const plausible = usePlausible();

  useEffect(() => {
    plausible("Checkout Success", { props: { offer: offer.id } });
  }, [plausible, offer.id]);

  return (
    <CenterContainer>
      <CheckCircleIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
      <p className={css({ mb: "4" })}>
        {checkoutSession.breakdown?.startDate &&
          me?.activeMagazineSubscription &&
          t.rich("description", {
            currentSubscription: me.activeMagazineSubscription.type,
            upgradeSubscription: offer.id,
            startDate: new Date(checkoutSession.breakdown.startDate),
            b: (chunks) => (
              <b
                className={css({
                  whiteSpace: "nowrap",
                  fontWeight: "medium",
                })}
              >
                {chunks}
              </b>
            ),
          })}
      </p>
      <Button asChild size="large">
        <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}>
          {t("action")}
        </Link>
      </Button>
      <Link
        className={css({ textDecoration: "underline" })}
        href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/konto`}
      >
        {t("action2")}
      </Link>
    </CenterContainer>
  );
}

export function GiftSuccess({ checkoutState: { offer, me } }: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.gift");

  const plausible = usePlausible();

  useEffect(() => {
    plausible("Checkout Success", { props: { offer: offer.id } });
  }, [plausible, offer.id]);

  return (
    <CenterContainer>
      <CheckCircleIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">{me?.email}</strong>
          ),
        })}
      </p>
      <Button asChild size="large">
        <Link href={`/`}>{t("action")}</Link>
      </Button>
    </CenterContainer>
  );
}

export function DonationSuccess({
  checkoutState: { offer, me },
}: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.donation");

  const plausible = usePlausible();

  useEffect(() => {
    plausible("Checkout Success", { props: { offer: offer.id } });
  }, [plausible, offer.id]);

  return (
    <CenterContainer>
      <CheckCircleIcon
        className={css({
          height: "10",
          width: "10",
        })}
      />
      <h1 className={css({ textStyle: "h2Sans" })}>{t("title")}</h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">{me?.email}</strong>
          ),
        })}
      </p>
      <Button asChild size="large">
        <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}>
          {t("action")}
        </Link>
      </Button>
    </CenterContainer>
  );
}
