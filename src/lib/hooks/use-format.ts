export function useFormatCurrency(currency: string) {
  return (
    amountInRappen: number,
    options: { displayZeroAmount?: boolean } = { displayZeroAmount: true }
  ) => {
    const inFrancs = amountInRappen / 100;

    return options.displayZeroAmount || amountInRappen !== 0
      ? `${currency.toUpperCase()} ${inFrancs.toFixed(2)}`
      : "";
  };
}
