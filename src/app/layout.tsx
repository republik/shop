import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { AnalyticsProvider } from "@/lib/analytics-provider";
import { GraphQLProvider } from "@/lib/graphql/client-browser";
import { css } from "@/theme/css";
import "@/theme/fonts.css";
import "@/theme/styles.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { type ReactNode } from "react";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
    title: {
      default: t("meta.title"),
      template: `%s – ${t("meta.title")}`,
    },
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
          minHeight: "[100dvh]",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GraphQLProvider>
            <div
              className={css({
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                smDown: {
                  minHeight: "[100dvh]",
                },
              })}
            >
              {children}
            </div>
            <Footer />
            <Toaster />
          </GraphQLProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
