import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import { type ReactNode } from "react";
import { OverviewLink } from "../overview-link";

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
      <OverviewLink className={css({ mb: "8" })}>
        <Logo />
      </OverviewLink>
      {children}
    </section>
  );
}
