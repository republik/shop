import test, { expect } from "@playwright/test";

test("Yearly subscription page works", async ({ page }) => {
  await page.goto("/angebot/YEARLY");

  await expect(page).toHaveTitle(/Jahresmitgliedschaft/);
});

test("Monthly subscription page works", async ({ page }) => {
  await page.goto("/angebot/MONTHLY");

  await expect(page).toHaveTitle(/Monats-Abo/);
});
