"use client";

import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const { t } = useTranslation("error");

  return <h1>{t("generic")}</h1>;
}
