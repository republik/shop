export function getTestEmailAddress(testId: string): string {
  const testEmail = process.env.TEST_EMAIL_PATTERN?.replace(
    /\{suffix\}/,
    testId
  );

  if (!testEmail) {
    throw new Error("Forget to set TEST_EMAIL_PATTERN");
  }

  return testEmail;
}
