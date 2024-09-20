import de from "./locales/de/common.json";

type Messages = typeof de;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
