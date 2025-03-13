import { OfferCard } from "@/components/overview/offer-cards";
import { css, cx } from "@/theme/css";
import { linkOverlay } from "@/theme/patterns";
import { getTranslations } from "next-intl/server";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import couponSrc from "@/assets/coupon.svg";
import giftSrc from "@/assets/gift.svg";
import { cardButton } from "@/components/ui/card-button";

const titleStyle = css({
  fontSize: "3xl",
  lineHeight: "tight",
  textStyle: "sansSerifBold",
});
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
      <Illu src={giftSrc} />

      <h2 className={titleStyle}>{tGift("title")}</h2>

      <p className={css({ flexGrow: 1 })}>{tGift("info")}</p>

      <div className={css({ mt: "auto" })}>
        <Link
          href={`/geschenke`}
          className={cx(cardButton({ visual: "outline" }), linkOverlay())}
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
      <Illu src={couponSrc} hide />

      <h2 className={titleStyle}>{tGift("title")}</h2>

      <p>{tGift("info")}</p>

      <div className={css({ mt: "auto" })}>
        <Link
          href={`/geschenk-einloesen`}
          className={cx(cardButton({ visual: "outline" }), linkOverlay())}
        >
          {tGift("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}
