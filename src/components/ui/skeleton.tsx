import { css, cx } from "@/theme/css";
import {HTMLAttributes} from "react";

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        css({ bg: "neutral.200", animation: "pulse", borderRadius: "lg" }),
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
