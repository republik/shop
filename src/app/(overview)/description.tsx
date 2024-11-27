import { css } from "@/theme/css";
import {getTranslations} from "next-intl/server";
import Link from "next/link";
import {DescriptionItem} from "@/app/(overview)/descriptionItem";


export async function OfferDescription() {
  const tDescription = await getTranslations("overview.description");
  const tDescriptionItems = await getTranslations("overview.description.items");

  const getText = tKey => tDescriptionItems.rich(tKey, {
    b: (chunks) => <b>{chunks}</b>
  })

  return (
    <div
      className={css({
        width: "full",
        maxWidth: "breakpoint-sm",
        mx: "auto",
        px: "6",
        fontSize: "lg"
      })}
    >
      <h2 className={css({ textStyle: "h3Sans" })}>{tDescription("title")}</h2>
      <ul>
        <DescriptionItem text={getText("general")} />
        <DescriptionItem text={getText("briefings")} />
        <DescriptionItem text={getText("dialog")} />
        <DescriptionItem text={getText("podcasts")} />
        <DescriptionItem text={getText("adFree")} />
        <DescriptionItem text={getText("projectR")}>
          <p className={css({ fontSize: "md" })}>{tDescriptionItems("projectRDescription")}</p>
        </DescriptionItem>
      </ul>
      <p className={css({ mt: "12", fontSize: "md" })}>{tDescription.rich("reducedPrice", {
        reducedLink: (chunks) => <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO&userPrice=1`}>{chunks}</Link>
      })}</p>
    </div>
  );
}
