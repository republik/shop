import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = "de-CH";

  return {
    locale,
    messages: (await import(`../../locales/de.json`)).default,
  };
});
