import { GetOfferDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import { css } from "@/theme/css";
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

  return (
    <OfferCard color={color} background={background}>
      <h3>{tOffer("title")}</h3>

      {offer.discount ? (
        <>
          <h2>
            <del>CHF {offer.price.amount / 100}</del>
          </h2>
          <h3>
            CHF {(offer.price.amount - offer.discount.amountOff) / 100}
          </h3>
          <p><b>
            {tOffer("intervalDiscount")}
          </b></p>
        </>
      ) : offer.customPrice ? (
        <>
          <h3>ab CHF {offer.customPrice.min / 100}</h3>

          <p><b>
            {tOffer("interval")}
          </b></p>
        </>
      ) : (
        <>
          <h3>CHF {offer.price.amount / 100}</h3>
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

export function OfferGrid({ children, noGap = false }: { children: ReactNode; rowGap: boolean }) {
  return (
    <div
      className={grid({
        width: "full",
        rowGap: noGap ? "0" : "8",
        columnGap: "8",
        minChildWidth: "320px",
        placeItems: "stretch",
      })}
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
      color: "var(--text)",
      display: "flex",
      flexDirection: "column",
      gap: "4",
      aspectRatio: "square",
      '& h2': {
        textStyle: "sansSerifBold",
        fontSize: "5xl",
      },
      '& h3': {
        textStyle: "sansSerifBold",
        fontSize: "5xl",
        lineHeight: "[1.4]",
      },
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
