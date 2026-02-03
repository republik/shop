import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { OverviewLink } from "../overview-link";

export function LandingPageLayout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("landing");

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
            <OverviewLink>{t("goBack")}</OverviewLink>
          </p>
        </div>
      </main>
    </>
  );
}
