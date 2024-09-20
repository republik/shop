"use client";
import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export interface Step {
  name: string;
  detail?: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export function Stepper(props: StepperProps) {
  const { steps, currentStep } = props;

  return (
    <ol>
      {steps.map((step, idx) => (
        <li
          key={step.name}
          className={css({
            listStyle: "none",
            borderStyle: "solid",
            borderBottomWidth: "thin",
            borderBottomStyle: "solid",
            borderBottomColor: "divider",
            py: "4",
          })}
        >
          <div
            className={cx(
              css({
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "4",
                fontSize: "sm",
              }),
              currentStep !== idx &&
                css({
                  color: "textSoft",
                })
            )}
          >
            <h2
              className={cx(
                currentStep === idx &&
                  css({
                    fontWeight: "bold",
                  })
              )}
            >
              {idx + 1}. {step.name}
            </h2>
            <div
              className={css({
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "2",
              })}
            >
              {step.detail}
            </div>
          </div>
          {currentStep === idx && (
            <div className={css({ mt: "4" })}>{step.content}</div>
          )}
        </li>
      ))}
    </ol>
  );
}

export function StepperChangeStepButton({
  onChange,
}: {
  onChange: () => void;
}) {
  const t = useTranslations("checkout");

  return (
    <button
      className={css({
        textDecoration: "underline",
        cursor: "pointer",
      })}
      onClick={() => onChange()}
    >
      {t("actions.change")}
    </button>
  );
}
