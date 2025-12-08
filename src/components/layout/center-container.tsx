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
          display: "grid",
          placeContent: "center",
          placeItems: "center",
          gap: "4",
          textAlign: "center",
          margin: "auto",
          px: "6",
          py: "8",
        }),
        className,
      )}
    >
      {children}
    </div>
  );
}
