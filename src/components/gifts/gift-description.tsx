"use client";
import { DescriptionItem } from "@/components/overview/description-item";
import { css } from "@/theme/css";
import { SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function GiftDescription({
  interval,
}: {
  interval: "yearly" | "monthly";
}) {
  const tDescription = useTranslations("landing.gifts.description");
  const tDescriptionItems = useTranslations("landing.gifts.description.items");

  const getText = (
    tKey: "dialog" | "general" | "briefings" | "goodie"

    // | "podcasts"
    // | "adFree"
    // | "projectR"
    // | "projectRDescription"
  ) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

  return (
    <div
      className={css({
        width: "full",
      })}
    >
      {/* <h2 className={css({ textStyle: "h3Sans", mb: "6" })}>
        {tDescription("title")}
      </h2> */}
      <ul
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "2",
          fontSize: "lg",
        })}
      >
        <DescriptionItem>{getText("general")}</DescriptionItem>
        <DescriptionItem>
          {tDescriptionItems.rich("allTheContent", {
            interval,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </DescriptionItem>
        <DescriptionItem>{getText("briefings")}</DescriptionItem>
        <DescriptionItem>{getText("dialog")}</DescriptionItem>
      </ul>
    </div>
  );
}
