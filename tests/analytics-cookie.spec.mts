import test, { expect } from "@playwright/test";

test(`UTM and Republik query params are stored in analytics cookie`, async ({
  page,
}) => {
  await page.goto(`/angebot/YEARLY?utm_campaign=hey&rep_1=1`);

  const cookies = await page.context().cookies();

  const analyticsCookie = cookies.find(
    (c) => (c.name = "republik-analytics-params")
  );

  expect(JSON.parse(decodeURIComponent(analyticsCookie?.value ?? ""))).toEqual({
    utm_campaign: "hey",
    rep_something: "1",
  });
});

test(`Subsequent analytics params overwrite the complete cookie`, async ({
  page,
}) => {
  await page.goto(`/angebot/YEARLY?utm_campaign=hey&rep_1=1`);
  await page.goto(`/angebot/YEARLY?utm_source=hey&rep_2=2&rep_1=3`);

  const cookies = await page.context().cookies();

  const analyticsCookie = cookies.find(
    (c) => (c.name = "republik-analytics-params")
  );

  expect(JSON.parse(decodeURIComponent(analyticsCookie?.value ?? ""))).toEqual({
    utm_source: "hey",
    rep_1: "3",
    rep_2: "2",
  });
});
