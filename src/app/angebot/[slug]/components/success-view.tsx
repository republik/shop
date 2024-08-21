"use client";
import useInterval from "@/lib/hooks/use-interval";
import { css } from "@/theme/css";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { MeDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import useTimeout from "@/lib/hooks/use-timeout";
import { useQuery } from "urql";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircleIcon } from "lucide-react";

export function SuccessView() {
  const { t } = useTranslation();
  const [meRes, refetchMe] = useQuery({
    query: MeDocument,
  });

  const [
    startCheckingForActiveSubscription,
    setStartCheckingForActiveSubscription,
  ] = useState(false);

  useTimeout(() => {
    setStartCheckingForActiveSubscription(true);
  }, 5_000);

  useInterval(
    () => {
      refetchMe({
        requestPolicy: "network-only",
      });
    },
    startCheckingForActiveSubscription ? 2_500 : null
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
  }, [meRes.data, startCheckingForActiveSubscription]);

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
        <AlertTitle>{t("checkout:success.title")}</AlertTitle>
        <AlertDescription>{t("checkout:success.description")}</AlertDescription>
      </Alert>
    </div>
  );
}
