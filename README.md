# Republik Shop

## Setup

### Prerequisites

- [Node.js v22](https://nodejs.org/en/)
- [PNPM v9](https://pnpm.io/)

### Environment variables

The following environment variables are required to run the application in development mode or to build it for production.

#### General

The following environment variables are required for the application to correctly link to it's self, the API and the magazine:

- NEXT_PUBLIC_URL: The URL of the website.
- NEXT_PUBLIC_API_URL: The URL of the API.
- NEXT_PUBLIC_MAGAZIN_URL: Used for linking to the magazine front, account page and the imprint.
- NEXT_PUBLIC_SUBSCRIPTION_CONFIGURATION: which configuration is used (`test` or `production`)

#### Stripe

The following environment variables are required to connect to the Stripe API for both organizations:

- STRIPE_SECRET_KEY_PROJECT_R
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R
- STRIPE_SECRET_KEY_REPUBLIK
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK
