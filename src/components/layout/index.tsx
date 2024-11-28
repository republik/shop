import { css } from "@/theme/css";
import Link from "next/link";
import { ReactNode } from "react";
import { Footer } from "./footer";
import { Logo } from "@/components/logo";

interface PageLayoutProps {
  children: ReactNode;
}

export async function PageLayout({ children }: PageLayoutProps) {
  // const me = await fetchMe();
  // const t = await getTranslations();

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        minHeight: "[100dvh]",
      })}
    >
      <header
        className={css({
          display: "flex",
          justifyContent: "center",
          py: "4",
          px: "4",
          borderBottomColor: "divider",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Link href={process.env.NEXT_PUBLIC_MAGAZIN_URL} title="Republik">
            <Logo />
          </Link>
        </div>
        {/* <div>{me && <Portrait me={me} />}</div> */}
      </header>
      <main
        className={css({
          flexGrow: 1,
          // mx: "auto",
          px: "4",
          py: "8",
          // display: "flex",
        })}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
