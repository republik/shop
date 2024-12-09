import { Logo } from "@/components/logo";
import { css } from "@/theme/css";
import { visuallyHidden } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { GiftDescription } from "@/app/(overview)/gift-description";
import Image from "next/image";
import GiftSVG from "../../../public/static/gift.svg";
import { cardButton } from "@/app/(overview)/offer";
import { token } from "@/theme/tokens";

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

      <Image src={GiftSVG} alt="gift image" width={80} height={80} />

      <form
        action={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote`}
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "4",
          width: "full",
        })}
      >
        <label className={css({ display: "block" })}>
          <input type="radio" name="package" value="ABO_GIVE" defaultChecked />{" "}
          {t("options.yearly")}
        </label>
        <label className={css({ display: "block" })}>
          <input type="radio" name="package" value="ABO_GIVE_MONTHS" />{" "}
          {t("options.monthly")}
        </label>

        <button
          type="submit"
          className={cardButton({ visual: "solid" })}
          style={{
            // @ts-expect-error custom css vars
            "--text": token("colors.text"),
            "--cta": token("colors.white"),
          }}
        >
          {t("cta")}
        </button>
      </form>

      <GiftDescription />
    </div>
  );
}
