import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DescriptionItem } from "@/app/(overview)/description-item";

export async function GiftDescription() {
  const tDescription = await getTranslations("giftOverview.description");
  const tDescriptionItems = await getTranslations(
    "giftOverview.description.items"
  );

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
            interval: "yearly",
            b: (chunks) => <b>{chunks}</b>,
          })}
        </DescriptionItem>
        <DescriptionItem>{getText("briefings")}</DescriptionItem>
        <DescriptionItem>{getText("dialog")}</DescriptionItem>
        <DescriptionItem>{getText("goodie")}</DescriptionItem>
      </ul>
      <p className={css({ mt: "8", fontSize: "md" })}>
        {tDescription.rich("reducedPrice", {
          reducedLink: (chunks) => (
            <Link
              href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO&userPrice=1`}
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
