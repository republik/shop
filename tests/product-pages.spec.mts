import test, { expect } from "@playwright/test";

import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(({ id, offerId, name }) => {
  test(`${id} ${offerId} subscription page`, async ({ page }) => {
    await page.goto(`/angebot/${offerId}`);

    await expect(page).toHaveTitle(new RegExp(name));
    await expect(
      page.getByRole("heading", { level: 1, name: new RegExp(name) })
    ).toBeVisible();
  });

  test(`${id} ${offerId} product query redirect`, async ({ page }) => {
    await page.goto(`/angebot?product=${offerId}`);

    await expect(page).toHaveURL(new RegExp(`/angebot/${offerId}`));
  });
});
