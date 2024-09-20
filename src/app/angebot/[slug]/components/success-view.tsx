"use client";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useInterval from "@/lib/hooks/use-interval";
import useTimeout from "@/lib/hooks/use-timeout";
import { css } from "@/theme/css";
import { CheckCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { useQuery } from "urql";

export function SuccessView() {
  const t = useTranslations();
  const [meRes, refetchMe] = useQuery({
    query: MeDocument,
  });

  const [
    startCheckingForActiveSubscription,
    setStartCheckingForActiveSubscription,
  ] = useState(false);

  const plausible = usePlausible();

  useTimeout(() => {
    setStartCheckingForActiveSubscription(true);
    plausible("Checkout Success");
  }, 1_000);

  useInterval(
    () => {
      refetchMe({
        requestPolicy: "network-only",
      });
    },
    startCheckingForActiveSubscription ? 1_000 : null
  );

  useEffect(() => {
    if (
      startCheckingForActiveSubscription &&
      meRes.data?.me?.activeMagazineSubscription
    ) {
      window.location.assign(
        `${process.env.NEXT_PUBLIC_MAGAZIN_URL}/einrichten?context=pledge&package=ABO`
      );
    }
  }, [meRes.data, startCheckingForActiveSubscription, plausible]);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "3",
      })}
    >
      <Alert variant="success">
        <CheckCircleIcon
          className={css({
            height: "8",
            width: "8",
          })}
        />
        <AlertTitle>{t("checkout.checkout.success.title")}</AlertTitle>
        <AlertDescription>
          {t("checkout.checkout.success.description")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
