import { withSentryConfig } from "@sentry/nextjs";
import { withPlausibleProxy } from "next-plausible";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // testProxy: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      // Migrated from custom express server
      {
        source: "/:path*",
        headers: [
          // Security headers, peviously handled by helmet
          ...Object.entries({
            // 'Content-Security-Policy': `default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests`,
            // 'Cross-Origin-Opener-Policy': 'same-origin',
            // 'Cross-Origin-Resource-Policy': 'same-origin',
            // 'Origin-Agent-Cluster': '?1',
            // Preload approval for 1 year
            "Referrer-Policy": "no-referrer",
            "Strict-Transport-Security": `max-age=${
              60 * 60 * 24 * 365
            }; includeSubDomains; preload`,
            "X-Content-Type-Options": "nosniff",
            "X-Download-Options": "noopen",
            "X-Frame-Options": "SAMEORIGIN",
            // removed by helmet by default, but we keep it for now
            "X-Powered-By": "Republik",
            "X-XSS-Protection": "1; mode=block",
          }).map(([key, value]) => ({
            key,
            value,
          })),
        ],
      },
    ];
  },
  redirects() {
    return [
      {
        source: "/angebot",
        has: [
          {
            type: "query",
            key: "product",
            value: "(?<slug>.*)",
          },
        ],
        destination: "/angebot/:slug",
        permanent: false,
      },
    ];
  },
};

const withConfiguredPlausibleProxy = withPlausibleProxy({
  subdirectory: "__plsb",
});

export default withSentryConfig(
  withNextIntl(withConfiguredPlausibleProxy(nextConfig)),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },
  }
);
