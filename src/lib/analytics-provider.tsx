import PlausibleProvider from "next-plausible";

type AnalyticsProviderProps = Omit<
  Parameters<typeof PlausibleProvider>[0],
  "domain"
>;

export const AnalyticsProvider = (props: AnalyticsProviderProps) => {
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return <>{props.children}</>;
  }

  return (
    <PlausibleProvider
      domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      revenue
      pageviewProps={{
        type: "shop", // so we can filter out shop pageviews on the dashboard
      }}
      trackLocalhost
      enabled
      {...props}
    />
  );
};
