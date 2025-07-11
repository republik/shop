import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import Link from "next/link";
import { type ReactNode } from "react";

export function Hero({ children }: { children: ReactNode }) {
  return (
    <section
      className={css({
        width: "full",
        maxWidth: "content.wide",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "xl",
        textAlign: "center",
      })}
    >
      <Link className={css({ mb: "8" })} href={process.env.NEXT_PUBLIC_URL}>
        <Logo />
      </Link>
      {children}
    </section>
  );
}
