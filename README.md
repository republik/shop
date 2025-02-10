# Republik Shop

## Setup

### Prerequisites

- [Node.js v22](https://nodejs.org/en/)
- [PNPM v10](https://pnpm.io/)

### Environment variables

The following environment variables are required to run the application in development mode or to build it for production.

#### General

The following environment variables are required for the application to correctly link to it's self, the API and the magazine:

- `NEXT_PUBLIC_URL`: The URL of the website.
- `NEXT_PUBLIC_API_URL`: The URL of the API.
- `NEXT_PUBLIC_MAGAZIN_URL`: Used for linking to the magazine front, account page and the imprint.
- `NEXT_PUBLIC_SUBSCRIPTION_CONFIGURATION`: which configuration is used (`test` or `production`)
- `FEATURE_FLAGS`: which features are enabled, in a comma-separated list

#### Stripe

The following environment variables are required to connect to the Stripe API for both organizations:

- `STRIPE_SECRET_KEY_PROJECT_R`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROJECT_R`
- `STRIPE_SECRET_KEY_REPUBLIK`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_REPUBLIK`

#### Testing

The test suite uses [Playwright Test](https://playwright.dev).

Make sure that `NODE_ENV` is set to `test` for the Playwright script to load the correct environment variables from `.env.test` and `.env.test.local`.

- `TEST_BASE_URL`: The URL that is used for testing. By default the local dev server is used but you can run the tests locally against a remote URL like a preview deployment. Note that payments use the Stripe test credit card, so this won't work on a production deployment.

Since creating accounts or logging in a user requires an email code, you need to configure an email account to make the tests work.

- `TEST_EMAIL_PATTERN`: Generate unique email addresses for each test run. Use `{suffix}` as a placeholder, e.g. `blah+{suffix}@example.com`
- `TEST_EMAIL_USERNAME`: Username to authenticate on the IMAP server
- `TEST_EMAIL_PASSWORD`: Password to authenticate on the IMAP server
