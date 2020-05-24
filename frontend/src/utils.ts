import { useEffect, useRef } from "react";

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

    return () => clearTimeout(interval)
  }, [callback, milliseconds]);
};

export { useInterval };
