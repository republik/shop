import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DescriptionItem } from "@/components/landing-page/description-item";

export async function OfferDescription() {
  const tDescription = await getTranslations("overview.description");
  const tDescriptionItems = await getTranslations("overview.description.items");

  const getText = (tKey: Parameters<typeof tDescriptionItems>[0]) =>
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
          {getText("projectRCondition")} {getText("projectR")}
        </DescriptionItem>
      </ul>
      <p className={css({ mt: "8", fontSize: "md" })}>
        {tDescription.rich("reducedPrice", {
          reducedLink: (chunks) => (
            <Link href={`/angebot/YEARLY_REDUCED`}>{chunks}</Link>
          ),
        })}
      </p>
    </div>
  );
}
