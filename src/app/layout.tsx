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
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GraphQLProvider>
            <PageLayout>{children}</PageLayout>
            <Toaster />
          </GraphQLProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
