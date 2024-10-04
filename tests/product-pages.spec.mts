import test, { expect } from "@playwright/test";

import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(({ key, name }) => {
  test(`${key} subscription page`, async ({ page }) => {
    await page.goto(`/angebot/${key}`);

    await expect(page).toHaveTitle(new RegExp(name));
    await expect(
      page.getByRole("heading", { level: 1, name: new RegExp(name) })
    ).toBeVisible();
  });

  test(`${key} product query redirect`, async ({ page }) => {
    await page.goto(`/angebot?product=${key}`);

    await expect(page).toHaveURL(new RegExp(`/angebot/${key}`));
  });
});
