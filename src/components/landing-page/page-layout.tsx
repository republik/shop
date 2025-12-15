import { Footer } from "@/components/layout/footer";
import { css, cx } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { type ReactNode } from "react";

export async function LandingPageLayout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const t = await getTranslations("landing");

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
            <Link href={"/"}>{t("goBack")}</Link>
          </p>
        </div>
      </main>
    </>
  );
}
