import { GetOfferDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { Button } from "@/components/ui/button";
import { getClient } from "@/lib/graphql/client";
import { css } from "@/theme/css";
import { grid, linkOverlay } from "@/theme/patterns";
import { token } from "@/theme/tokens";
import Link from "next/link";
import { ReactNode } from "react";

export async function OfferCardPrimary({
  offerId,
  colorText,
  colorBackground,
}: {
  offerId: string;
  colorText?: string;
  colorBackground?: string;
}) {
  const gql = getClient();

  const { data } = await gql.query(GetOfferDocument, { offerId });

  const offer = data?.offer;

  if (!offer) {
    return null;
  }

  return (
    <div
      style={{
        // @ts-expect-error css vars
        "--text": colorText ?? token("colors.text"),
        "--bg": colorBackground ?? token("colors.amber.100"),
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
      })}
    >
      <div className={css({ textStyle: "sansSerifBold", fontSize: "4xl" })}>
        <h2
          className={css({
            fontSize: "4xl",
          })}
        >
          {offer.name}
        </h2>

        {offer.discount ? (
          <div>
            <div>
              <del>CHF {offer.price.amount / 100}</del>
            </div>
            <div>
              CHF {(offer.price.amount - offer.discount.amountOff) / 100}
            </div>
            <div className={css({ fontWeight: "medium", fontSize: "md" })}>
              im ersten JAHR/MONAT
            </div>
          </div>
        ) : (
          <div>CHF {offer.price.amount / 100}</div>
        )}
      </div>

      <Link
        href={`/angebot/${offerId}`}
        className={linkOverlay({
          borderRadius: "md",
          fontSize: "md",
          whiteSpace: "nowrap",
          px: "6",
          py: "3",
          background: "var(--text)",
          color: "var(--bg)",
          display: "block",
          textAlign: "center",
        })}
      >
        Abo/Mitglied werden
      </Link>

      <div className={css({ textAlign: "center" })}>Jederzeit kündbar</div>
    </div>
  );
}

export function OfferGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={grid({
        width: "full",
        gap: "4",
        minChildWidth: "300px",
        justifyItems: "stretch",
      })}
    >
      {children}
    </div>
  );
}
