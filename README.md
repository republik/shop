# Republik Shop

## Setup

### Prerequisites

- [Node.js v20](https://nodejs.org/en/)
- [PNPM v9](https://pnpm.io/)

### Environment variables

The following environment variables are required to run the application in development mode or to build it for production.

#### General

The following environment variables are required for the application to correctly link to it's self, the API and the magazine:

- NEXT_PUBLIC_URL: The URL of the website.
- NEXT_PUBLIC_API_URL: The URL of the API.
- NEXT_PUBLIC_MAGAZIN_URL: Used for linking to the magazine front, account page and the imprint.

#### Stripe

The following environment variables are required to connect to the Stripe API for both organizations:

- STRIPE_ACCOUNT_PROJECT_R
- STRIPE_PAYMENT_CONFIGURATION_PROJECT_R
- STRIPE_SECRET_KEY_PROJECT_R
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R
- STRIPE_ACCOUNT_REPUBLIK
- STRIPE_PAYMENT_CONFIGURATION_REPUBLIK
- STRIPE_SECRET_KEY_REPUBLIK
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK

## Shop configuration

The shop configuration is located in the [config.ts](./src/app/angebot/[slug]/lib/config.ts) file.
More documentation on the configuration options can be found directly in the code.
