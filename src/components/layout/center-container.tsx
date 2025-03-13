import { css, cx } from "@/theme/css";
import type { ReactNode } from "react";

export function CenterContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "4",
          textAlign: "center",
          margin: "auto",
          px: "6",
          py: "4",
        }),
        className
      )}
    >
      {children}
    </div>
  );
}
