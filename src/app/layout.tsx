import { PageLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

import "@/theme/styles.css";
import "@/theme/fonts.css";
import { css } from "@/theme/css";
import "./globals.css";
import getTranslation from "next-translate/useTranslation";
import { GraphQLProvider } from "@/lib/graphql/client-browser";
import { ReactNode } from "react";
import { AnalyticsProvider } from "@/lib/analytics-provider";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = getTranslation("common");

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
    title: {
      default: t("common:meta.title"),
      template: `%s – ${t("common:meta.title")}`,
    },
    description: t("common:meta.description"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <AnalyticsProvider />
      </head>
      <body
        className={css({
          textStyle: "body",
        })}
      >
        <GraphQLProvider>
          <PageLayout>{children}</PageLayout>
          <Toaster />
        </GraphQLProvider>
      </body>
    </html>
  );
}
