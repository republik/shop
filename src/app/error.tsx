"use client";

import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import * as Sentry from "@sentry/nextjs";
import { CircleXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const t = useTranslations("error");

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4",
        textAlign: "center",
        margin: "auto",
      })}
    >
      <CircleXIcon
        className={css({ color: "zinc.800", width: "10", height: "10" })}
      />
      <h1 className={css({ fontSize: "lg" })}>{t("generic")}</h1>
      <p>
        {t("globalError.message")}{" "}
        <a
          href={
            "mailto:kontakt@republik.ch?subject=Fehlermeldung%20auf%20" +
            process.env.NEXT_PUBLIC_URL +
            window.location.pathname
          }
        >
          kontakt@republik.ch
        </a>
        .
      </p>
      <Button
        onClick={() => {
          window.location.reload();
        }}
      >
        {t("globalError.reloadPage")}
      </Button>
    </div>
  );
}
