import { Header } from "@/components/layout/header";
import { css } from "@/theme/css";
import { type ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main
        className={css({
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        })}
      >
        {children}
      </main>
    </>
  );
}
