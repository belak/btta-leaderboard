import { useEffect, useState, useRef } from "react";

const useInterval = (fn: () => void, milliseconds: number) => {
  const callback = useRef(fn);

  // if the provided function changes, call it once and change its reference.
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // when the milliseconds change, reset the timeout
  useEffect(() => {
    const interval = setInterval(() => {
      callback.current();
    }, milliseconds);

    return () => clearTimeout(interval);
  }, [callback, milliseconds]);
};

function getSize() {
  const isClient = typeof window === "object";

  return {
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  };
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    const isClient = typeof window === "object";

    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);

      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the
  // new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export { useInterval, useWindowSize, useLocalStorage };
