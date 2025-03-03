import test, { expect } from "@playwright/test";

import { PRODUCTS } from "./lib/products.mts";

PRODUCTS.forEach(({ id, offerId }) => {
  test(`${id} ${offerId} is on overview`, async ({ page }) => {
    await page.goto(`/`);

    await expect(page.getByTestId(`offer-card-${offerId}`)).toBeVisible();
  });

  test(`${id} ${offerId} card on overview links to checkout`, async ({
    page,
  }) => {
    await page.goto(`/`);

    await page.getByTestId(`offer-card-${offerId}`).click();

    await expect(page).toHaveURL(new RegExp(`/angebot/${offerId}`));
  });
});
