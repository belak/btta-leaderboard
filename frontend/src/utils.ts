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

function isHiDpi(): boolean {
  return !!(
    (window.matchMedia &&
      (window.matchMedia(
        "only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)"
      ).matches ||
        window.matchMedia(
          "only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)"
        ).matches)) ||
    (window.devicePixelRatio && window.devicePixelRatio > 1.3)
  );
}

function isRetina(): boolean {
  return (
    !!(
      (window.matchMedia &&
        (window.matchMedia(
          "only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)"
        ).matches ||
          window.matchMedia(
            "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)"
          ).matches)) ||
      (window.devicePixelRatio && window.devicePixelRatio >= 2)
    ) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  );
}

export { useInterval, useWindowSize, useLocalStorage, isRetina, isHiDpi };
