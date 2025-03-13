import de from "./locales/de.json";

import { formats } from "@/i18n/request";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof de;
    Formats: typeof formats;
  }
}
