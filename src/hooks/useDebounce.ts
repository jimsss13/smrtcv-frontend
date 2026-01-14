import { useState, useEffect } from "react";

/**
 * Hook to debounce a value, delaying its update until a specified time has passed.
 * Useful for preventing excessive re-renders or API calls during rapid input.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
