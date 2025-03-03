"use client";
import { useFormatCurrency } from "@/lib/hooks/use-format";
import { css, cx } from "@/theme/css";
import { useTranslations } from "next-intl";
import { ReactNode, useMemo } from "react";
export interface LineItem {
  label: string;
  amount: number;
  hidden?: boolean;
}
interface PricingTableProps {
  currency: string;
  lineItems: LineItem[];
  extraItem?: ReactNode;
}

export function PricingTable({
  currency,
  lineItems,
  extraItem,
}: PricingTableProps) {
  const t = useTranslations();
  const formatPrice = useFormatCurrency(currency);

  const total = useMemo(
    () =>
      lineItems.reduce((acc, item) => {
        return acc + item.amount;
      }, 0),
    [lineItems]
  );

  return (
    <table
      className={css({
        borderCollapse: "collapse",
        "& th, td": {
          pb: "4",
          fontSize: "md",
          fontWeight: "normal",
          whiteSpace: "nowrap",
        },
        "& tr > th:first-child": {
          width: "full",
          textAlign: "left",
          fontWeight: "medium",
        },
        "& tr > th + td:last-child": {
          textAlign: "right",
          pl: "[1ch]",
          // fontVariantNumeric: "tabular-nums",
        },
        "& tfoot > tr > td:last-child": {
          fontWeight: "medium",
        },
        "& tfoot > tr > td,& tfoot > tr > th": {
          borderTopStyle: "solid",
          borderTopWidth: "1px",
          borderColor: "current",
          // fontSize: "lg",
          pt: "4",
        },
      })}
    >
      <thead>
        <tr className="sr-only">
          <th scope="col">
            {t("checkout.preCheckout.summary.table.heading.item")}
          </th>

          <th scope="col">
            {t("checkout.preCheckout.summary.table.heading.price")}
          </th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((item) => (
          <tr
            key={item.label}
            className={cx(item.hidden && "sr-only")}
            data-f={JSON.stringify(item)}
          >
            <th scope="row">{item.label}</th>
            <td>{formatPrice(item.amount)}</td>
          </tr>
        ))}

        {extraItem && (
          <tr>
            <td
              colSpan={2}
              className={css({
                pl: "0",
              })}
            >
              {extraItem}
            </td>
          </tr>
        )}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{t("checkout.preCheckout.summary.table.summary")}</th>
          <td data-testid="price-overview-total">{formatPrice(total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
