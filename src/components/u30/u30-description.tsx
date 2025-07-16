"use client";
import { DescriptionItem } from "@/components/overview/description-item";
import { css } from "@/theme/css";
import { BadgePercentIcon, PercentIcon, PiggyBankIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function U30Description({
  interval,
}: {
  interval: "yearly" | "monthly";
}) {
  const tDescription = useTranslations("landing.u30.description");
  const tDescriptionItems = useTranslations("landing.u30.description.items");

  const getText = (
    tKey: "dialog" | "general" | "briefings" | "disclaimer"

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
        <DescriptionItem icon={<PiggyBankIcon />}>
          {getText("disclaimer")}
        </DescriptionItem>
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
