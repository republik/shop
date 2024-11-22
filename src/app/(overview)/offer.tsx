import { GetOfferDocument } from "#graphql/republik-api/__generated__/gql/graphql";
import { Button } from "@/components/ui/button";
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
  const t = await getTranslations("overview");
  const tOffer = await getTranslations(`overview.offer.${offerId}`);

  const { data } = await gql.query(GetOfferDocument, { offerId });

  const offer = data?.offer;

  if (!offer) {
    return null;
  }

  return (
    <div
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
      })}
    >
      <div
        className={css({
          textStyle: "sansSerifBold",
          fontSize: "5xl",
          lineHeight: 1.4,
          flexGrow: 1,
        })}
      >
        <h2>{tOffer("title")}</h2>

        {offer.discount ? (
          <>
            <div>
              <del>CHF {offer.price.amount / 100}</del>
            </div>
            <div>
              CHF {(offer.price.amount - offer.discount.amountOff) / 100}
            </div>
            <div
              className={css({ fontWeight: "medium", fontSize: "md", mt: "2" })}
            >
              {tOffer("intervalDiscount")}
            </div>
          </>
        ) : offer.customPrice ? (
          <>
            <div>ab CHF {offer.customPrice.min / 100}</div>

            <div
              className={css({ fontWeight: "medium", fontSize: "md", mt: "2" })}
            >
              {tOffer("interval")}
            </div>
          </>
        ) : (
          <>
            <div>CHF {offer.price.amount / 100}</div>

            <div
              className={css({ fontWeight: "medium", fontSize: "md", mt: "2" })}
            >
              {tOffer("interval")}
            </div>
          </>
        )}

        {tOffer.has("info") && (
          <div
            className={css({ fontSize: "md", fontWeight: "normal", mt: "2" })}
          >
            {tOffer("info")}
          </div>
        )}
      </div>

      <Link
        href={`/angebot/${offerId}`}
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
        {tOffer("cta")}
      </Link>

      {tOffer.has("cancelable") && (
        <div className={css({ textAlign: "center", fontWeight: "normal" })}>
          {tOffer("cancelable")}
        </div>
      )}
    </div>
  );
}

export function OfferGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={grid({
        width: "full",
        gap: "4",
        minChildWidth: "320px",
        placeItems: "stretch",
      })}
    >
      {children}
    </div>
  );
}
