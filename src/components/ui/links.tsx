import { css } from "@/theme/css";
import { ArrowLeftIcon } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes } from "react";

export function BackLink({
  children,
  ...props
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link {...props}>
      <ArrowLeftIcon
        size={"1.2em"}
        className={css({
          display: "inline-block",
          verticalAlign: "middle",
          mr: "2",
        })}
      />
      <span className={css({ textDecoration: "underline" })}>{children}</span>
    </Link>
  );
}
