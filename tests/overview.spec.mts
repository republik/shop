import test, { expect } from "@playwright/test";

import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(({ key, name }) => {
  test(`${key} is on overview`, async ({ page }) => {
    await page.goto(`/`);

    await expect(page.getByTestId(`offer-card-${key}`)).toBeVisible();
  });

  test(`${key} card on overview links to checkout`, async ({ page }) => {
    await page.goto(`/`);

    await page.getByTestId(`offer-card-${key}`).click();

    await expect(page).toHaveURL(new RegExp(`/angebot/${key}`));
  });
});
