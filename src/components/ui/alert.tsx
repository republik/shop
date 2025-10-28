import { css, cva, cx, type RecipeVariantProps } from "@/theme/css";
import * as React from "react";

const alertVariants = cva({
  base: {
    width: "full",
    padding: "4",
    borderRadius: "lg",
    display: "inline-grid",
    rowGap: "2",
    columnGap: "3",
    gridTemplateColumns: "auto 1fr",
    gridTemplateRows: "auto",
    "& > svg": {
      gridColumnStart: "1",
      gridColumnEnd: "1",
      color: "text",
      width: "5",
      height: "5",
    },
  },
  variants: {
    variant: {
      info: {
        backgroundColor: "background.light",
        "& > svg": { color: "text" },
      },
      error: { backgroundColor: "red.50", "& > svg": { color: "red.700" } },
      warning: {
        backgroundColor: "yellow.50",
        "& > svg": { color: "yellow.700" },
      },
      success: {
        backgroundColor: "green.50",
        "& > svg": { color: "green.700" },
      },
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    RecipeVariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cx(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ ...props }, ref) => (
  <h5
    ref={ref}
    className={css({
      fontWeight: "medium",
      fontSize: "sm",
      gridColumnStart: "2",
      gridColumnEnd: "2",
    })}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => (
  <div
    ref={ref}
    className={css({
      fontSize: "sm",
      gridColumnStart: "2",
      gridColumnEnd: "2",
    })}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
