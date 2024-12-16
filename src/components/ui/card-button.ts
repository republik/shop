import { cva } from "@/theme/css";

export const cardButton = cva({
  base: {
    borderRadius: "sm",
    fontSize: "lg",
    whiteSpace: "nowrap",
    px: "6",
    py: "3",
    display: "block",
    fontWeight: "medium",
    textAlign: "center",
  },
  variants: {
    visual: {
      solid: { background: "var(--text)", color: "var(--cta)" },
      outline: { borderWidth: "1px", borderColor: "black", color: "black" },
    },
  },
  defaultVariants: {
    visual: "solid",
  },
});
