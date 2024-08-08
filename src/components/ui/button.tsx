"use client";

import { css, cva, cx, type RecipeVariantProps } from "@/theme/css";
import { Slot } from "@radix-ui/react-slot";
import { LoaderIcon } from "lucide-react";
import * as React from "react";

const buttonVariants = cva({
  base: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "md",
    fontSize: "md",
    lineHeight: "1",
    fontWeight: "bold",
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
          <svg
            className={css({
              h: "4",
              w: "4",
              color: "white",
              ml: "3",
              mr: "-1",
              animation: "[spin 1s ease-in-out infinite]",
            })}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className={css({
                opacity: "0.25",
              })}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className={css({
                opacity: "0.75",
              })}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
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
