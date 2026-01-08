import { OfferCardDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { cardButton } from "@/components/ui/card-button";
import { getClient } from "@/lib/graphql/client";
import { css, cx } from "@/theme/css";
import { grid, linkOverlay } from "@/theme/patterns";
import { token } from "@/theme/tokens";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { type ReactNode } from "react";

const currencyPrefix = "CHF ";

const formatCurrencyShort = (amountInRappen: number) => {
  const inFrancs = amountInRappen / 100;
  return inFrancs.toFixed(0);
};

export async function OfferCardPrimary({
  offerId,
  promoCode,
  color,
  background,
  ctaColor,
  redirect,
  recommended,
}: {
  offerId: "YEARLY" | "MONTHLY" | "BENEFACTOR" | "STUDENT" | "DONATION";
  promoCode?: string;
  color?: string;
  background?: string;
  ctaColor?: string;
  redirect?: string;
  recommended?: boolean;
}) {
  const gql = await getClient();
  const t = await getTranslations(`overview`);
  const tOffer = await getTranslations(`overview.offer.${offerId}`);

  const { data } = await gql.query(OfferCardDocument, {
    offerId,
    promoCode: promoCode ?? null,
  });

  const offer = data?.offer;

  if (!offer) {
    return null;
  }

  const titleStyle = css({
    textStyle: "serifBold",
    fontSize: "5xl",
    lineHeight: "tight",
  });

  const intervalStyle = css({
    fontWeight: "medium",
    lineHeight: "normal",
  });

  return (
    <OfferCard
      id={offerId}
      color={color}
      background={background}
      ctaColor={ctaColor}
    >
      {recommended && (
        <div
          className={css({
            position: "absolute",
            top: "-5",
            width: "auto",
            alignSelf: "center",
            fontWeight: "medium",
            background: "background",
            px: "4",
            py: "2",
          })}
        >
          {t("recommended")}
        </div>
      )}

      <div>
        <h2 className={titleStyle}>{tOffer("title")}</h2>

        {offer.price.amount > 0 &&
          (offer.discount ? (
            <>
              <p className={titleStyle}>
                {currencyPrefix}
                <del>{offer.price.amount / 100}</del>
              </p>
              <p className={titleStyle}>
                {currencyPrefix}
                {formatCurrencyShort(
                  offer.price.amount - offer.discount.amountOff,
                )}
              </p>
              <p className={intervalStyle}>
                {offer.discount.duration === "once"
                  ? tOffer("intervalDiscount")
                  : tOffer("interval")}
              </p>
            </>
          ) : (
            <>
              <p className={titleStyle}>
                {currencyPrefix}
                {formatCurrencyShort(offer.price.amount)}
              </p>
              <p className={intervalStyle}>{tOffer("interval")}</p>
            </>
          ))}
      </div>

      <div className={css({ flexGrow: 1 })}>
        {tOffer.has("info") && <p>{tOffer("info")}</p>}
      </div>

      <div className={css({})}>
        <Link
          href={redirect || `/angebot/${offerId}`}
          className={cx(cardButton(), linkOverlay())}
        >
          {tOffer("cta")}
        </Link>

        {tOffer.has("cancelable") && (
          <div
            className={css({
              textAlign: "center",
              fontWeight: "normal",
              mt: "4",
            })}
          >
            {tOffer("cancelable")}
          </div>
        )}
      </div>
    </OfferCard>
  );
}

export function OfferGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={grid({
        width: "full",
        gap: "4-8",
        minChildWidth: "350px",
        placeItems: "stretch",
        px: "4-8",
      })}
    >
      {children}
    </div>
  );
}

export function OfferGridCompact({ children }: { children: ReactNode }) {
  return (
    <div
      className={grid({
        width: "full",
        columnGap: "4-8",
        minChildWidth: "350px",
        placeItems: "stretch",
      })}
    >
      {children}
    </div>
  );
}

export function OfferCard({
  id,
  children,
  color,
  background,
  ctaColor,
  small,
}: {
  id: string;
  children: ReactNode;
  color?: string;
  background?: string;
  ctaColor?: string;
  small?: boolean;
}) {
  return (
    <div
      data-testid={`offer-card-${id}`}
      style={{
        // @ts-expect-error css vars
        "--text": color ?? token("colors.text"),
        "--bg": background ?? token("colors.amber.100"),
        "--aspect-ratio": small ? "auto" : token("aspectRatios.square"),
        "--cta": ctaColor || "white",
      }}
      className={css({
        textStyle: "sansSerifMedium",
        position: "relative",
        background: "var(--bg)",
        p: "6",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
        gap: "4",
        aspectRatio: "var(--aspect-ratio)",
        fontWeight: "normal",
        fontSize: "md",
        md: {
          aspectRatio: "square",
        },
      })}
    >
      {children}
    </div>
  );
}

export async function DonationCard() {
  const t = await getTranslations("overview.offer.DONATION");

  return (
    <div
      className={css({
        textStyle: "sansSerifMedium",

        position: "relative",
        background: "white",
        borderColor: `[#EFEFEF]`,
        borderWidth: 1,
        borderStyle: "solid",
        p: "6",
        color: "text",
        display: "flex",
        flexDirection: "column",
        gap: "4",
        fontWeight: "normal",
        fontSize: "lg",
        textAlign: "center",
        md: {
          gridColumnEnd: "span 2",
          alignItems: "center",
        },
      })}
    >
      <p>{t("info")}</p>
      <h2
        className={css({
          textStyle: "serifBold",
          fontSize: "5xl",
          lineHeight: "tight",
        })}
      >
        {t("title")}
      </h2>

      <div className={css({ mt: "auto" })}>
        <Link
          href={`/angebot/DONATION`}
          className={cx(cardButton({ visual: "outline" }), linkOverlay())}
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}

export async function U30Card() {
  const t = await getTranslations("overview.u30");

  const titleStyle = css({
    textStyle: "serifBold",
    fontSize: "5xl",
    lineHeight: "tight",
  });

  const intervalStyle = css({
    fontWeight: "medium",
    lineHeight: "normal",
  });

  return (
    <OfferCard id="u30-buy" background={"#BCC9E9"}>
      <div>
        <h2 className={titleStyle}>{t("title")}</h2>
        <p className={titleStyle}>ab CHF 9</p>
        <p className={intervalStyle}>{t("interval")}</p>
      </div>

      <p className={css({ flexGrow: 1 })}>{t("info")}</p>

      <div className={css({ mt: "auto" })}>
        <Link href={`/u30`} className={cx(cardButton({}), linkOverlay())}>
          {t("cta")}
        </Link>
      </div>
    </OfferCard>
  );
}
