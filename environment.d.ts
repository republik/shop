declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      // GENERAL
      NEXT_PUBLIC_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_MAGAZIN_URL: string;
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;

      // STRIPE
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK: string;

      // SENTRY
      SENTRY_ORG?: string;
      SENTRY_PROJECT?: string;
      NEXT_PUBLIC_SENTRY_DSN?: string;

      FEATURE_FLAGS?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
