export function isKeyOfValue<T extends string>(
  key: string,
  possibleKeys: T[]
): key is T {
  for (const p of possibleKeys) {
    if (key === p) {
      return true;
    }
  }
  return false;
}
