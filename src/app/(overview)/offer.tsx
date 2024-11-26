import { GetOfferDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import {css, cx} from "@/theme/css";
import { grid, linkOverlay } from "@/theme/patterns";
import { token } from "@/theme/tokens";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ReactNode } from "react";

export async function OfferCardPrimary({
  offerId,
  color,
  background,
}: {
  offerId: "YEARLY" | "MONTHLY" | "BENEFACTOR" | "STUDENT";
  color?: string;
  background?: string;
}) {
  const gql = getClient();
  const tOffer = await getTranslations(`overview.offer.${offerId}`);

  const { data } = await gql.query(GetOfferDocument, { offerId });

  const offer = data?.offer;

  if (!offer) {
    return null;
  }

  const titleStyle = css({
    textStyle: "sansSerifBold",
    fontSize: "5xl",
    lineHeight: "[1.1]"
  })

  return (
    <OfferCard color={color} background={background}>
      <h2 className={titleStyle}>{tOffer("title")}</h2>

      {offer.discount ? (
        <>
          <h3 className={titleStyle}>
            <del>CHF {offer.price.amount / 100}</del>
          </h3>
          <h3 className={titleStyle}>
            CHF {(offer.price.amount - offer.discount.amountOff) / 100}
          </h3>
          <p><b>
            {tOffer("intervalDiscount")}
          </b></p>
        </>
      ) : offer.customPrice ? (
        <>
          <h3 className={titleStyle}>ab CHF {offer.customPrice.min / 100}</h3>

          <p><b>
            {tOffer("interval")}
          </b></p>
        </>
      ) : (
        <>
          <h3 className={titleStyle}>CHF {offer.price.amount / 100}</h3>
          <p><b>
            {tOffer("interval")}
          </b></p>
        </>
      )}

      {tOffer.has("info") && (
        <p>
          {tOffer("info")}
        </p>
      )}

      <OfferLink href={`/angebot/${offerId}`}>
        {tOffer("cta")}
      </OfferLink>

      {tOffer.has("cancelable") && (
        <div className={css({ textAlign: "center", fontWeight: "normal" })}>
          {tOffer("cancelable")}
        </div>
      )}
    </OfferCard>
  );
}

export function OfferGrid({ children, noGap }: { children: ReactNode; rowGap: boolean }) {
  return (
    <div
      className={cx(
        grid({
          width: "full",
          rowGap: noGap ? "0" : "4",
          columnGap: "4",
          md: {
            rowGap: noGap ? "0" : "8",
            columnGap: "8",
          },
          minChildWidth: "350px",
          placeItems: "stretch"
        }),
        css({
          pl: noGap ? "0" : "4",
          pr: noGap ? "0" : "4",
          md: {
            pl: "8",
            pr: "8"
          }
        })
      )}
    >
      {children}
    </div>
  );
}


export function OfferCard({ children, color, background, }: { children: ReactNode; color?: string; background?: string; }) {
  return <div
    style={{
      // @ts-expect-error css vars
      "--text": color ?? token("colors.text"),
      "--bg": background ?? token("colors.amber.100"),
    }}
    className={css({
      textStyle: "sansSerifMedium",
      position: "relative",
      background: "var(--bg)",
      padding: "6",
      pt: "9",
      color: "var(--text)",
      display: "flex",
      flexDirection: "column",
      gap: "4",
      aspectRatio: "square",
      '& p': {
        mt: "2",
        fontWeight: "normal",
        fontSize: "md",
        flexGrow: 1,
        '& b': {
          fontWeight: "medium",
        }
      }
    })}
  >{children}</div>
}

export function OfferLink({ children, href }: { children: ReactNode, href: string }) {
  return <Link
    href={href}
    className={linkOverlay({
      borderRadius: "md",
      fontSize: "lg",
      whiteSpace: "nowrap",
      px: "6",
      py: "3",
      background: "var(--text)",
      color: "var(--bg)",
      display: "block",
      textAlign: "center",
    })}
  >
    {children}
  </Link>
}
