"use client";

import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { type ReactNode } from "react";
import { useRouter } from "next/navigation";

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

const DEFAULT_PREVIOUS_URL = "/";

export function Step({
  title,
  currentStep,
  maxStep,
  previousUrl,
  children,
}: {
  title: string;
  currentStep: number;
  maxStep: number;
  previousUrl?: string;
  children: ReactNode;
}) {
  const t = useTranslations("step");
  const router = useRouter();

  function navigateBack(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(DEFAULT_PREVIOUS_URL);
    }
  }
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        flexGrow: 1,
        width: "full",
        maxWidth: "[512px]",
        mx: "auto",
        pb: "8",
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
        {previousUrl ? (
          <Link
            href={previousUrl}
            className={css({
              cursor: "pointer",
              borderRadius: "sm",
              _hover: {
                background: "overlay",
              },
            })}
          >
            <ChevronLeftIcon />
            <span className={visuallyHidden()}>{t("back")}</span>
          </Link>
        ) : (
          <button onClick={navigateBack} className={css({
            cursor: "pointer",
            borderRadius: "sm",
            _hover: {
              background: "overlay",
            },
          })}>
            <ChevronLeftIcon />
            <span className={visuallyHidden()}>{t("back")}</span>
          </button>
        )}

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

      <div
        className={css({
          px: "6",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        })}
      >
        {children}
      </div>
    </div>
  );
}
