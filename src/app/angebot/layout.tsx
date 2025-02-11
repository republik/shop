import { LoginStatus } from "@/components/login/login-status";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { css } from "@/theme/css";
import { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main
        className={css({
          flexGrow: 1,
          pb: "8",

          maxWidth: "[510px]",
          width: "full",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
        })}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
