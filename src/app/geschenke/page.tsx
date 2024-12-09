import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { GiftDescription } from "@/app/(overview)/gift-description";
import { GiftChooser } from "@/app/geschenke/gift-chooser";

export async function generateMetadata() {
  const t = await getTranslations("giftOverview");

  return {
    title: t("title"),
  };
}

export default async function GiftOverview() {
  const t = await getTranslations("giftOverview");

  return (
    <div
      className={css({
        width: "full",
        maxWidth: "breakpoint-sm",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8",
        fontSize: "xl",
      })}
    >
      <Link href={process.env.NEXT_PUBLIC_MAGAZIN_URL} title="Republik">
        <Logo />
      </Link>
      <div className={css({ textAlign: "center" })}>
        <h1 className={visuallyHidden()}>{t("title")}</h1>
        <p className={css({ textStyle: "lead" })}>
          {t.rich("lead", {
            br: () => <br />,
          })}
        </p>
        {/* <p className={css({ textStyle: "lead" })}>{t("cta")}</p> */}
      </div>

      <GiftChooser />

      <GiftDescription />

      <Link href={"/"}>{t("goBack")}</Link>
    </div>
  );
}
