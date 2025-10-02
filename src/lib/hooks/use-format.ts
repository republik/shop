export function useFormatCurrency(currency: string) {
  return (
    amountInRappen: number,
    options: { displayZeroAmount?: boolean; displayRappen?: boolean } = {
      displayZeroAmount: true,
    }
  ) => {
    const inFrancs = amountInRappen / 100;

    return options.displayZeroAmount || amountInRappen !== 0
      ? `${currency.toUpperCase()} ${inFrancs.toFixed(options.displayRappen ? 2 : 0)}`
      : "";
  };
}
