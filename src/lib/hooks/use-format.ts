export function useFormatCurrency(currency: string) {
  return (amountInRappen: number) => {
    const inFrancs = amountInRappen / 100;

    return `${currency.toUpperCase()} ${inFrancs.toFixed(2)}`;
  };
}
