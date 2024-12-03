import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import {cta, OfferCard} from "@/app/(overview)/offer";
import Image, { StaticImageData } from "next/image";
import GiftSVG from "../../../public/static/gift.svg";
import CouponSVG from "../../../public/static/coupon.svg";
import Link from "next/link";

const titleStyle = css({ fontSize: "3xl", textStyle: "sansSerifBold" });
const giftBg = "#EFEFEF";

function Illu({ src, hide }: { src: StaticImageData; hide?: boolean }) {
  return (
    <div
      className={css({
        height: "[80px]",
        py: "4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(hide ? { hideBelow: "md" } : {}),
      })}
    >
      <Image src={src} alt="gift image" />
    </div>
  );
}

export async function GiftCard() {
  const tGift = await getTranslations("overview.gift.buy");

  return (
    <OfferCard id="gift-buy" background={giftBg}>
      <Illu src={GiftSVG} />

      <h3 className={titleStyle}>{tGift("title")}</h3>

      <p className={css({ flexGrow: 1 })}>{tGift("info")}</p>

      <div className={css({mt: "auto"})}>
        <Link
          href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/angebote?package=ABO_GIVE`}
          className={cta({visual: "outline"})}
        >
          {tGift("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}

export async function RedeemCard() {
  const tGift = await getTranslations("overview.gift.redeem");

  return (
    <OfferCard id="gift-redeem" background={giftBg} small>
      <Illu src={CouponSVG} hide />

      <h3 className={titleStyle}>{tGift("title")}</h3>

      <p>{tGift("info")}</p>

      <div className={css({mt: "auto"})}>
        <Link
          href={`${process.env.NEXT_PUBLIC_MAGAZIN_URL}/abholen`}
          className={cta({visual: "outline"})}
        >
          {tGift("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}
