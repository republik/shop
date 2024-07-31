import { PageLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

import "@/theme/styles.css";
import "@/theme/fonts.css";
import { css } from "@/theme/css";
import "./globals.css";
import getTranslation from "next-translate/useTranslation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = getTranslation("common");

  return {
    title: t("common:meta.title"),
    description: t("common:meta.descrpition"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={css({
          textStyle: "body",
        })}
      >
        <PageLayout>{children}</PageLayout>
        <Toaster />
      </body>
    </html>
  );
}
