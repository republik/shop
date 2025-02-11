"use client";
import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import { InputHTMLAttributes, useId } from "react";

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
