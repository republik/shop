"use client";
import { css, cx } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { useTranslations } from "next-intl";
import {
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useId,
} from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  name: string;
  description?: ReactNode;
  hideLabel?: boolean;
};

export function FormField({
  label,
  error,
  name,
  type = "text",
  description,
  hideLabel,
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
        gap: "1.5",
      })}
      data-invalid={error ? "true" : undefined}
    >
      <label
        htmlFor={id}
        className={cx(
          css({
            fontSize: "sm",
            display: "block",
            color: "text.secondary",
            textAlign: "left",
          }),
          hideLabel && visuallyHidden()
        )}
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
            background: "white",
            borderWidth: "1px",
            borderColor: "divider",
            borderRadius: "sm",
            p: "2",
            _disabled: {
              color: "text.secondary",
              background: "disabled",
            },
            _placeholder: {
              color: "text.tertiary",
              fontWeight: "normal",
            },
          }),
          error && css({ borderColor: "error" }),
          inputProps?.className
        )}
      />
      {error && (
        <div
          aria-live="polite"
          className={css({
            color: "error",
            fontSize: "sm",
          })}
        >
          {errorMessage}
        </div>
      )}
      {description && (
        <div
          className={css({
            color: "text.tertiary",
            fontSize: "xs",
          })}
        >
          {description}
        </div>
      )}
    </div>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  name: string;
  description?: ReactNode;
  hideLabel?: boolean;
};

export function TextArea({
  label,
  error,
  name,
  description,
  hideLabel,
  ...inputProps
}: TextAreaProps) {
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
        gap: "1.5",
      })}
      data-invalid={error ? "true" : undefined}
    >
      <label
        htmlFor={id}
        className={cx(
          css({
            fontSize: "sm",
            display: "block",
            color: "text.secondary",
            textAlign: "left",
          }),
          hideLabel && visuallyHidden()
        )}
      >
        {label}
      </label>
      <textarea
        {...inputProps}
        id={id}
        name={name}
        className={cx(
          css({
            background: "white",
            borderWidth: "1px",
            borderColor: "divider",
            borderRadius: "sm",
            p: "2",
            _disabled: {
              color: "text.secondary",
              background: "disabled",
            },
            _placeholder: {
              color: "text.tertiary",
              fontWeight: "normal",
            },
          }),
          error && css({ borderColor: "error" }),
          inputProps?.className
        )}
      />
      {error && (
        <div
          aria-live="polite"
          className={css({
            color: "error",
            fontSize: "sm",
          })}
        >
          {errorMessage}
        </div>
      )}
      {description && (
        <div
          className={css({
            color: "text.tertiary",
            fontSize: "xs",
          })}
        >
          {description}
        </div>
      )}
    </div>
  );
}

export function RadioOption({
  children,
  ...inputProps
}: {
  value: string;
  name: string;
  children: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
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
        "&:has(:checked, [data-checked])": {
          borderColor: "text",
        },
        // fontSize: "xl",
      })}
    >
      <input
        {...inputProps}
        id={id}
        type="radio"
        // Also set data-checked because the checked attribute doesn't update reliably on re-renders
        data-checked={inputProps.checked ? true : undefined}
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
