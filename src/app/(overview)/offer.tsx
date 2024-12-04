import { GetOfferDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import { css, cva, cx } from "@/theme/css";
import { grid, linkOverlay } from "@/theme/patterns";
import { token } from "@/theme/tokens";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ReactNode } from "react";

export async function OfferCardPrimary({
  offerId,
  color,
  background,
  ctaColor,
  redirect,
}: {
  offerId: "YEARLY" | "MONTHLY" | "BENEFACTOR" | "STUDENT";
  color?: string;
  background?: string;
  ctaColor?: string;
  redirect?: string;
}) {
  const gql = getClient();
  const tOffer = await getTranslations(`overview.offer.${offerId}`);

  const { data } = await gql.query(GetOfferDocument, { offerId });

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
      {tOffer.has("recommended") && (
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
          {tOffer("recommended")}
        </div>
      )}

      <div>
        <h2 className={titleStyle}>{tOffer("title")}</h2>

        {offer.discount ? (
          <>
            <p className={titleStyle}>
              CHF <del>{offer.price.amount / 100}</del>
            </p>
            <p className={titleStyle}>
              CHF {(offer.price.amount - offer.discount.amountOff) / 100}
            </p>
            <p className={intervalStyle}>{tOffer("intervalDiscount")}</p>
          </>
        ) : offer.customPrice ? (
          <>
            <p className={titleStyle}>ab CHF {offer.customPrice.min / 100}</p>
            <p className={intervalStyle}>{tOffer("interval")}</p>
          </>
        ) : (
          <>
            <p className={titleStyle}>CHF {offer.price.amount / 100}</p>
            <p className={intervalStyle}>{tOffer("interval")}</p>
          </>
        )}
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
      className={cx(
        grid({
          width: "full",
          gap: "4-8",
          minChildWidth: "350px",
          placeItems: "stretch",
        }),
        css({
          px: "4-8",
          mb: "4-8",
        })
      )}
    >
      {children}
    </div>
  );
}

export function OfferGridCompact({ children }: { children: ReactNode }) {
  return (
    <div
      className={cx(
        grid({
          width: "full",
          columnGap: "4",
          md: {
            columnGap: "8",
          },
          minChildWidth: "350px",
          placeItems: "stretch",
        }),
        css({
          md: {
            px: "8",
          },
        })
      )}
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

export const cardButton = cva({
  base: {
    borderRadius: "sm",
    fontSize: "lg",
    whiteSpace: "nowrap",
    px: "6",
    py: "3",
    display: "block",
    fontWeight: "medium",
    textAlign: "center",
  },
  variants: {
    visual: {
      solid: { background: "var(--text)", color: "var(--cta)" },
      outline: { borderWidth: "1px", borderColor: "black", color: "black" },
    },
  },
  defaultVariants: {
    visual: "solid",
  },
});
