"use client";
import { css, cx } from "@/theme/css";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useFormatCurrency } from "@/lib/hooks/use-format";
export interface CheckoutItem {
  label: string;
  amount: number;
  hidden?: boolean;
}
interface CheckoutTableProps {
  currency: string;
  items: CheckoutItem[];
}

function CheckoutTable(props: CheckoutTableProps) {
  const { currency, items } = props;
  const t = useTranslations();
  const formatPrice = useFormatCurrency(currency);

  const total = useMemo(
    () =>
      items.reduce((acc, item) => {
        return acc + item.amount;
      }, 0),
    [items]
  );

  return (
    <table
      className={css({
        "& th, td": {
          py: "3",
          fontSize: "md",
          fontWeight: "normal",
          whiteSpace: "nowrap",
        },
        "& tr > th:first-child": {
          width: "full",
        },
        "& tr > td:last-child": {
          textAlign: "right",
          pl: "[1ch]",
          // fontVariantNumeric: "tabular-nums",
        },
        "& tfoot > tr > td:last-child": {
          fontWeight: "medium",
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
        {items.map((item) => (
          <tr
            key={item.label}
            className={cx(item.hidden && "sr-only")}
            data-f={JSON.stringify(item)}
          >
            <th scope="row">{item.label}</th>
            <td>{formatPrice(item.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{t("checkout.preCheckout.summary.table.summary")}</th>
          <td>{formatPrice(total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default CheckoutTable;
