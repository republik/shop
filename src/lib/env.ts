"use server";

export async function featureFlagEnabled(flag: string): Promise<boolean> {
  const flags = process.env.FEATURE_FLAGS?.split(",") ?? [];

  return flags.includes(flag);
}
