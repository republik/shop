import { useEffect, useState } from "react";

export function useSessionStorage(
  key: string
): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>("");

  useEffect(() => {
    try {
      const newValue = sessionStorage.getItem(key);
      if (newValue) {
        setStoredValue(newValue);
      }
    } catch {}
  }, [key]);

  const setValue = (value: string) => {
    setStoredValue(value);
    try {
      sessionStorage.setItem(key, value);
    } catch {}
  };

  return [storedValue, setValue];
}
