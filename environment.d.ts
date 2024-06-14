declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      NEXT_PUBLIC_DOMAIN: string;
      STRIPE_ACCOUNT_PROJECT_R: string;
      STRIPE_SECRET_KEY_PROJECT_R: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R: string;
      STRIPE_ACCOUNT_REPUBLIK: string;
      STRIPE_SECRET_KEY_REPUBLIK: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
