import { css } from "@/theme/css";
import {getTranslations} from "next-intl/server";
import Link from "next/link";

export async function OfferDescription() {
  const tDescription = await getTranslations("overview.description");

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
        <DescriptionItem tKey="general" />
        <DescriptionItem tKey="briefings" />
        <DescriptionItem tKey="dialog" />
        <DescriptionItem tKey="podcasts" />
        <DescriptionItem tKey="adFree" />
        <DescriptionItem tKey="projectR" />
      </ul>
      <p className={css({ mt: "2rem", fontSize: "md" })}>{tDescription.rich("reducedPrice", {
        reducedLink: (chunks) => <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO&userPrice=1`}>{chunks}</Link>
      })}</p>
    </div>
  );
}

async function DescriptionItem({ tKey }: { tKey: string }) {
  const tDescriptionItems = await getTranslations("overview.description.items");
  return (<li className={css({
    mt: "1rem",
    display: "flex",
    flexDirection: "row"
  })}>
    <div className={css({
      flexGrow: "0",
      flexShrink: "0",
      mt: "0.6rem",
      mr: "4-8"
    })}><CheckMark /></div>
    <p>{tDescriptionItems.rich(tKey, {
    b: (chunks) => <b>{chunks}</b>
  })}</p>
  </li>)
}

function CheckMark() {
  return <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.12 0.106689L7.33329 8.89336L2.54663 4.12002L0.666626 6.00002L7.33329 12.6667L18 2.00002L16.12 0.106689Z" fill="black"/>
  </svg>

}