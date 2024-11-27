import { css } from "@/theme/css";
import {getTranslations} from "next-intl/server";
import Link from "next/link";
import {ReactNode} from "react";

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
        <DescriptionItem tKey="projectR">
          <InfoIcon />
        </DescriptionItem>
      </ul>
      <p className={css({ mt: "12", fontSize: "md" })}>{tDescription.rich("reducedPrice", {
        reducedLink: (chunks) => <Link href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO&userPrice=1`}>{chunks}</Link>
      })}</p>
    </div>
  );
}

async function DescriptionItem({ tKey, children }: { tKey: "dialog" | "general" | "briefings" | "podcasts" | "adFree" | "projectR"; children?: ReactNode }) {
  const tDescriptionItems = await getTranslations("overview.description.items");
  return (<li className={css({
    mt: "3",
    display: "flex",
    flexDirection: "row"
  })}>
    <div className={css({
      flexGrow: "0",
      flexShrink: "0",
      marginTop: "2",
      mr: "4-8"
    })}><CheckMark /></div>
    <p>{tDescriptionItems.rich(tKey, {
    b: (chunks) => <b>{chunks}</b>
  })}</p>
    { children && <div className={css({
      flexGrow: "0",
      flexShrink: "0",
      marginTop: "2",
      ml: "4-8"
    })}>{children}</div>}
  </li>)
}

function CheckMark() {
  return <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.12 0.106689L7.33329 8.89336L2.54663 4.12002L0.666626 6.00002L7.33329 12.6667L18 2.00002L16.12 0.106689Z" fill="black"/>
  </svg>
}

function InfoIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.709 21.9102C10.3353 21.9102 9.04622 21.6497 7.8418 21.1289C6.63737 20.6146 5.57943 19.9017 4.66797 18.9902C3.75651 18.0723 3.04036 17.0143 2.51953 15.8164C2.00521 14.612 1.74805 13.3229 1.74805 11.9492C1.74805 10.5755 2.00521 9.28646 2.51953 8.08203C3.04036 6.8776 3.75651 5.81966 4.66797 4.9082C5.57943 3.99674 6.63737 3.28385 7.8418 2.76953C9.04622 2.2487 10.3353 1.98828 11.709 1.98828C13.0827 1.98828 14.3717 2.2487 15.5762 2.76953C16.7806 3.28385 17.8385 3.99674 18.75 4.9082C19.6615 5.81966 20.3743 6.8776 20.8887 8.08203C21.4095 9.28646 21.6699 10.5755 21.6699 11.9492C21.6699 13.3229 21.4095 14.612 20.8887 15.8164C20.3743 17.0143 19.6615 18.0723 18.75 18.9902C17.8385 19.9017 16.7806 20.6146 15.5762 21.1289C14.3717 21.6497 13.0827 21.9102 11.709 21.9102ZM9.95117 17.5938H14.043C14.2513 17.5938 14.4271 17.5286 14.5703 17.3984C14.7135 17.2617 14.7852 17.0892 14.7852 16.8809C14.7852 16.6855 14.7135 16.5195 14.5703 16.3828C14.4271 16.2396 14.2513 16.168 14.043 16.168H12.8027V11.0605C12.8027 10.7871 12.7344 10.5658 12.5977 10.3965C12.4674 10.2272 12.2721 10.1426 12.0117 10.1426H10.1172C9.91536 10.1426 9.74284 10.2142 9.59961 10.3574C9.45638 10.4941 9.38477 10.6602 9.38477 10.8555C9.38477 11.0638 9.45638 11.2363 9.59961 11.373C9.74284 11.5033 9.91536 11.5684 10.1172 11.5684H11.1914V16.168H9.95117C9.74284 16.168 9.56706 16.2396 9.42383 16.3828C9.2806 16.5195 9.20898 16.6855 9.20898 16.8809C9.20898 17.0892 9.2806 17.2617 9.42383 17.3984C9.56706 17.5286 9.74284 17.5938 9.95117 17.5938ZM11.6211 8.47266C11.9922 8.47266 12.3014 8.3457 12.5488 8.0918C12.8027 7.83138 12.9297 7.51888 12.9297 7.1543C12.9297 6.7832 12.8027 6.4707 12.5488 6.2168C12.3014 5.95638 11.9922 5.82617 11.6211 5.82617C11.2565 5.82617 10.944 5.95638 10.6836 6.2168C10.4297 6.4707 10.3027 6.7832 10.3027 7.1543C10.3027 7.51888 10.4297 7.83138 10.6836 8.0918C10.944 8.3457 11.2565 8.47266 11.6211 8.47266Z" fill="#909090"/>
  </svg>
}