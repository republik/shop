import { css } from "@/theme/css";
import { getTranslations } from "next-intl/server";
import {OfferCard, OfferLink} from "@/app/(overview)/offer";

export async function GiftCard() {
  const tGift = await getTranslations("overview.gift.buy");

  return (
    <OfferCard background="#EFEFEF">
        <h3>{tGift("title")}</h3>

        <p>
          {tGift("info")}
        </p>

      <OfferLink href={`/angebot`}>
        {tGift("cta")}
      </OfferLink>
    </OfferCard>
  );
}

export async function RedeemCard() {
  const tGift = await getTranslations("overview.gift.redeem");

  return (
    <OfferCard background="#EFEFEF">
        <h3>{tGift("title")}</h3>

        <p>
          {tGift("info")}
        </p>

      <OfferLink href={`/angebot`}>
        {tGift("cta")}
      </OfferLink>
    </OfferCard>
  );
}
