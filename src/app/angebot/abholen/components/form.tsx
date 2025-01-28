"use client";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { InputHTMLAttributes, useId } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, ...props }: FormFieldProps) {
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
          fontWeight: "medium",
          fontSize: "sm",
          display: "block",
        })}
      >
        {label}
      </label>
      <input
        {...props}
        id={id}
        className={css({
          borderWidth: "1px",
          borderColor: "text",
          borderRadius: "sm",
          p: "2",
        })}
      />
      <span
        aria-live="polite"
        className={css({
          color: "error",
          fontSize: "sm",
        })}
      >
        {error && errorMessage}
      </span>
    </div>
  );
}
