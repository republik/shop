"use client";
import { css } from "@/theme/css";
import useTranslation from "next-translate/useTranslation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircleIcon, MessageCircleWarningIcon } from "lucide-react";

export function ErrorView() {
  const { t } = useTranslation();

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "3",
      })}
    >
      <Alert variant="error">
        <MessageCircleWarningIcon
          className={css({
            height: "8",
            width: "8",
          })}
        />
        <AlertTitle>{t("checkout:checkout.failed.title")}</AlertTitle>
        <AlertDescription>
          {t("checkout:checkout.failed.description")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
