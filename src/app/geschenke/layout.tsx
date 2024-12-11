import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { css } from "@/theme/css";
import { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <main
        className={css({
          flexGrow: 1,
          px: "4",
          py: "16",
          background: "[#B7A5EC]",
          "&:has([value='ABO_GIVE_MONTHS']:checked)": {
            background: "[#EFAC9D]",
          },
          transition: "background",
        })}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
