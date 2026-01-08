"use client";
import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";

export function LandingPageLayout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("landing");
  const searchParams = useSearchParams();
  const overviewHref = `/?${searchParams}`;

  return (
    <>
      <main
        className={cx(
          css({
            flexGrow: 1,
            px: "4",
            py: "16",

            transition: "background",
          }),
          className,
        )}
      >
        <div
          className={css({
            width: "full",
            maxWidth: "content.narrow",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8",
          })}
        >
          {children}

          <p>
            <Link href={overviewHref}>{t("goBack")}</Link>
          </p>
        </div>
      </main>
    </>
  );
}
