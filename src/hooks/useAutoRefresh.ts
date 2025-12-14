import { useEffect } from "react";

export function useAutoRefresh(
  callback: () => void,
  interval: number = 2000
) {
  useEffect(() => {
    // Initial call
    callback();

    // Set up interval
    const id = setInterval(callback, interval);

    // Cleanup
    return () => clearInterval(id);
  }, [callback, interval]);
}

