import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    // Don't set debouncing state if value hasn't changed
    if (value === debouncedValue) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setIsDebouncing(false);
    };
  }, [value, delay, debouncedValue]);

  return {
    debouncedValue,
    isDebouncing,
    isPending: isDebouncing && value !== debouncedValue
  };
}