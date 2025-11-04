"use client";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { CenterContainer } from "@/components/layout/center-container";
import { Button } from "@/components/ui/button";
import useInterval from "@/lib/hooks/use-interval";
import useTimeout from "@/lib/hooks/use-timeout";
import type { CheckoutSessionData } from "@/lib/checkout-session";
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

export function SubscriptionSuccess({ offer }: SuccessProps) {
  const t = useTranslations("checkout.checkout.success.subscription");

  const [meRes, refetchMe] = useQuery({
    query: MeDocument,
    variables: { stripeCompany: null },
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
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("title")}
      </h1>
      {ready ? (
        <>
          <p className={css({ mb: "4" })}>{t("ready")}</p>
          <Button asChild>
            <Link
              href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten?context=pledge&package=ABO`}
            >
              {t("action")}
            </Link>
          </Button>
        </>
      ) : (
        <p>{t("waiting")}</p>
      )}
    </CenterContainer>
  );
}

export function GiftSuccess({ offer, session }: SuccessProps) {
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
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("title")}
      </h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">
              {/* TODO {session.email}*/}
            </strong>
          ),
        })}
      </p>
      <Button asChild>
        <Link href={`/`}>{t("action")}</Link>
      </Button>
    </CenterContainer>
  );
}

export function DonationSuccess({ offer, session }: SuccessProps) {
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
      <h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
        {t("title")}
      </h1>
      <p className={css({ mb: "4" })}>
        {t.rich("description", {
          email: () => (
            <strong data-testid="success-recipient-email">
              {/* TODO {session.email} */}
            </strong>
          ),
        })}
      </p>
      <Button asChild>
        <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}`}>
          {t("action")}
        </Link>
      </Button>
    </CenterContainer>
  );
}
