import { css, cx } from "@/theme/css";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
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
