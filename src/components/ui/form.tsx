"use client";
import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import {
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  name: string;
};

export function FormField({
  label,
  error,
  name,
  type = "text",
  ...inputProps
}: FormFieldProps) {
  const id = useId();
  const t = useTranslations("formValidation");

  // TODO: handle other validity states than valueMissing
  // https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
  const errorMessage = error ? t("valueMissing", { label }) : null;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "2",
      })}
      data-invalid={error ? "true" : undefined}
    >
      <label
        htmlFor={id}
        className={css({
          fontSize: "sm",
          display: "block",
          color: "text.secondary",
        })}
      >
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        name={name}
        type={type}
        className={cx(
          css({
            borderWidth: "1px",
            borderColor: "divider",
            borderRadius: "sm",
            p: "2",
          }),
          error && css({ borderColor: "error" }),
          inputProps?.className
        )}
      />
      {error && (
        <span
          aria-live="polite"
          className={css({
            color: "error",
            fontSize: "sm",
          })}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export function RadioOption({
  value,
  name,
  selected,
  children,
  onChange,
}: {
  value: string;
  name: string;
  selected: boolean;
  children: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={css({
        // borderWidth: 2,
        // borderStyle: "solid",
        // borderRadius: "5px",
        // borderColor: "disabled",
        w: "full",
        display: "flex",
        gap: "4",
        alignItems: "center",
        "&:has(:checked)": {
          borderColor: "text",
        },
        // fontSize: "xl",
      })}
    >
      <input
        id={id}
        value={value}
        name={name}
        type="radio"
        checked={selected}
        onChange={onChange}
        className={css({
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
        })}
      />

      <span>{children}</span>
    </label>
  );
}
