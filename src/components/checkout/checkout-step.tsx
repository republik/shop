"use client";

import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const progress = value / max;
  return (
    <div
      className={css({
        width: "full",
        backgroundColor: "divider",
        height: "0.5",
      })}
    >
      <div
        className={css({
          backgroundColor: "current",
          height: "full",
        })}
        style={{ width: `${progress * 100}%` }}
      ></div>
    </div>
  );
}

export function Step({
  title,
  currentStep,
  maxStep,
  goBack,
  children,
}: {
  title: string;
  currentStep: number;
  maxStep: number;
  goBack?: () => void;
  children: ReactNode;
}) {
  const t = useTranslations("step");
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <ProgressBar value={currentStep} max={maxStep} />

      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "2",
          alignItems: "center",
          pl: "4",
          pr: "6",
        })}
      >
        <button
          onClick={goBack}
          className={css({
            cursor: "pointer",
          })}
        >
          <ChevronLeftIcon onClick={goBack} />
          <span className={visuallyHidden()}>{t("back")}</span>
        </button>

        <div
          className={css({
            // display: "flex",
            // flexDirection: "column",
            // gap: "2",
            flexGrow: 1,
          })}
        >
          <div>{t("progressTitle", { value: currentStep, max: maxStep })}</div>

          <h1
            className={css({
              textStyle: "h3Sans",
            })}
          >
            {title}
          </h1>
        </div>
      </div>

      <div className={css({ px: "6" })}>{children}</div>
    </div>
  );
}
