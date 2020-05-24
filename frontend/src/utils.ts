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

  const isClient = typeof window === "object";

  useEffect(() => {
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

export { useInterval, useWindowSize };
