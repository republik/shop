import { css, cx } from "@/theme/css";
import {
  useId,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type Props = {
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value: string;
  // Use children for the label
  children: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;
export function LandingPageOption({ children, ...inputProps }: Props) {
  const id = useId();

  return (
    <label
      className={css({
        w: "full",
        display: "flex",
        gap: "4",
        alignItems: "center",
        "&:has(:checked)": {
          borderColor: "text",
        },
        fontSize: "xl",
      })}
    >
      <input
        id={id}
        {...inputProps}
        type="radio"
        className={cx(
          css({
            flexShrink: 0,
            // Custom checkbox style, see https://moderncss.dev/pure-css-custom-styled-radio-buttons/
            appearance: "none",
            backgroundColor: "transparent",
            margin: "0",
            color: "current",
            width: "[1.15em]",
            height: "[1.15em]",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "text",
            borderRadius: "full",
            display: "grid",
            placeContent: "center",
            outline: "none",
            _before: {
              content: '""',
              width: "[0.35em]",
              height: "[0.35em]",
              borderRadius: "full",
              backgroundColor: "transparent",
            },

            _checked: {
              backgroundColor: "text",
              _before: {
                backgroundColor: "text.inverted",
              },
            },
          }),
          inputProps.className
        )}
      />

      <span>{children}</span>
    </label>
  );
}
