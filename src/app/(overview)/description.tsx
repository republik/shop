import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DescriptionItem } from "@/app/(overview)/description-item";

export async function OfferDescription() {
  const tDescription = await getTranslations("overview.description");
  const tDescriptionItems = await getTranslations("overview.description.items");

  const getText = (
    tKey:
      | "dialog"
      | "general"
      | "briefings"
      | "podcasts"
      | "adFree"
      | "projectR"
      | "projectRDescription"
  ) =>
    tDescriptionItems.rich(tKey, {
      b: (chunks) => <b>{chunks}</b>,
      p: (chunks) => <p className={css({ mt: "2" })}>{chunks}</p>,
    });

  return (
    <div
      className={css({
        width: "full",
        maxWidth: "content.narrow",
        mx: "auto",
        px: "4",
        fontSize: "lg",
      })}
    >
      <h2 className={css({ textStyle: "h3Sans", mb: "6" })}>
        {tDescription("title")}
      </h2>
      <ul
        className={css({ display: "flex", flexDirection: "column", gap: "2" })}
      >
        <DescriptionItem>{getText("general")}</DescriptionItem>
        <DescriptionItem>{getText("briefings")}</DescriptionItem>
        <DescriptionItem>{getText("dialog")}</DescriptionItem>
        <DescriptionItem>{getText("podcasts")}</DescriptionItem>
        <DescriptionItem>{getText("adFree")}</DescriptionItem>
        <DescriptionItem info={getText("projectRDescription")}>
          {getText("projectR")}
        </DescriptionItem>
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
