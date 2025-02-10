import { useFormatter } from "next-intl";

export function useFormatCurrency(currency: string) {
  const f = useFormatter();

  return (price: number) =>
    `${currency.toUpperCase()} ${f.number(price, {
      // We'd prefer to use style: "currency" here but oddly, negative numbers will display as CHF-18.00 which looks a bit weird (no space between currency and minus sign)
      // See https://www.intl-explorer.com/NumberFormat/Currency
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
}
