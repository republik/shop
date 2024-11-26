import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import {OfferCard, OfferLink} from "@/app/(overview)/offer";

const titleStyle = css({ fontSize: "3xl", textStyle: "sansSerifBold" })

export async function GiftCard() {
  const tGift = await getTranslations("overview.gift.buy");

  return (
    <OfferCard background="#EFEFEF">
        <h3 className={titleStyle}>{tGift("title")}</h3>

        <p>
          {tGift("info")}
        </p>

      <OfferLink href={'/'}>
        {tGift("cta")}
      </OfferLink>
    </OfferCard>
  );
}

export async function RedeemCard() {
  const tGift = await getTranslations("overview.gift.redeem");

  return (
    <OfferCard background="#EFEFEF">
        <h3 className={titleStyle}>{tGift("title")}</h3>

        <p>
          {tGift("info")}
        </p>

      <OfferLink href={'/'}>
        {tGift("cta")}
      </OfferLink>
    </OfferCard>
  );
}
