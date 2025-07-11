"use client";

import { Spinner } from "@/components/ui/spinner";
import { css, cx } from "@/theme/css";
import { button, type ButtonVariantProps } from "@/theme/recipes";
import { Slot } from "radix-ui";
import { useMemo } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    asChild?: boolean;
    loading?: boolean;
  };

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  children,
  loading,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  const content = useMemo(() => {
    if (!loading) {
      return children;
    }
    return (
      <div className={css({ display: "flex", flexDirection: "row" })}>
        {children}
        <Spinner />
      </div>
    );
  }, [children, loading]);

  return (
    <Comp
      className={cx(
        button({ variant, size }),
        loading && css({ cursor: "loading" }),
        className
      )}
      aria-busy={loading}
      {...props}
    >
      {content}
    </Comp>
  );
};
