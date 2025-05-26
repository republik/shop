import { expect, type Page } from "@playwright/test";
import { getEmailCode } from "./get-email-code.mjs";

export async function login(page: Page, testEmail: string) {
  await page.getByLabel("E-Mail").fill(testEmail);
  await page.getByRole("button", { name: "Weiter" }).click();

  let code: string | undefined;

  await expect
    .poll(
      async () => {
        code = await getEmailCode(testEmail);
        return code;
      },

      { timeout: 10_000 }
    )
    .toBeDefined();

  // Pause for user to enter OTP from email
  await page.getByLabel("Code").fill(code!);
}
