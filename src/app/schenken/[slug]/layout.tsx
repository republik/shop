import { PageLayout } from "@/components/layout";
import { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
