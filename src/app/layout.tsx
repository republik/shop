import { PageLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

import "@/theme/styles.css";
import "@/theme/fonts.css";
import { css } from "@/theme/css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shop - Republik",
  description: "",
};

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
