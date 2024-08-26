import * as React from "react";
import { cva, cx, type RecipeVariantProps } from "@/theme/css";

const badgeVariants = cva({
  base: {
    px: "1.5",
    py: "0.5",
    fontSize: "xs",
    fontWeight: "semibold",
    display: "inline-flex",
    borderRadius: "md",
  },
  variants: {
    variant: {
      default: {
        color: "black",
        backgroundColor: "yellow.300",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  RecipeVariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cx(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
