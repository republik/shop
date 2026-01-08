"use client";
import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";

export function Hero({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const overviewHref = `/?${searchParams}`;

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
      <Link className={css({ mb: "8" })} href={overviewHref}>
        <Logo />
      </Link>
      {children}
    </section>
  );
}
