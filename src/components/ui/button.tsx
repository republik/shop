import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils";
import { cva, cx, type RecipeVariantProps } from "@/theme/css";

const buttonVariants = cva({
  base: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "md",
    fontSize: "xs",
    lineHeight: "1",
    fontWeight: "medium",
    whiteSpace: "nowrap",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color, fill, stroke",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "300ms",
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
        px: "4",
        py: "2",
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
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cx(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
