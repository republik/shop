import test, { expect } from "@playwright/test";

test("yearly page", async ({ page }) => {
  await page.goto("/angebot/YEARLY");

  expect(page).toHaveTitle(/Jahresmitgliedschaft/);
});

test("monthly page", async ({ page }) => {
  await page.goto("/angebot/MONTHLY");

  expect(page).toHaveTitle(/Monats-Abo/);
});
