"use client";

import { Spinner } from "@/components/ui/spinner";
import { css, cva, cx, type RecipeVariantProps } from "@/theme/css";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

const buttonVariants = cva({
  base: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "md",
    fontSize: "md",
    lineHeight: "1",
    fontWeight: "medium",
    whiteSpace: "nowrap",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "in-out",
    transitionDuration: "fast",
    cursor: "pointer",
    '&:disabled:not([data-loading], [aria-busy="true"])': {
      opacity: "50%",
      cursor: "default",
    },
    _loading: {
      cursor: "default",
    },
  },
  variants: {
    variant: {
      default: {
        bg: "primary",
        color: "text.primaryForeground",
        _hover: {
          bg: "primaryHover",
        },
      },
      ghost: {
        bg: "transparent",
        color: "current",
        _hover: {
          textDecoration: "underline",
        },
      },
      outline: {
        bg: "transparent",
        borderColor: "current",
        borderStyle: "solid",
        borderWidth: "1px",
      },
      //         destructive:
      //           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      //         outline:
      //           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      //         secondary:
      //           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      //         ghost: "hover:bg-accent hover:text-accent-foreground",
      //         link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: {
        px: "6",
        py: "3",
      },
      large: {
        px: "6",
        py: "3",
        fontSize: "lg",
        width: "full",
      },
      // default: "h-10 px-4 py-2",
      // sm: "h-9 rounded-md px-3",
      // lg: "h-11 rounded-md px-8",
      // icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonVariants = RecipeVariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean;
    loading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, children, loading, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const content = React.useMemo(() => {
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
          buttonVariants({ variant, size }),
          loading && css({ cursor: "loading" }),
          className
        )}
        ref={ref}
        aria-busy={loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
