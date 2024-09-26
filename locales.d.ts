import de from "./locales/de.json";

type Messages = typeof de;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
