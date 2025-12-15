import { useEffect } from "react";

export function useAutoRefresh(
  callback: () => void,
  interval: number = 2000,
  enabled: boolean = true
) {
  useEffect(() => {
    // Always run once on mount to populate data
    callback();

    if (!enabled) return;

    // Set up interval
    const id = setInterval(callback, interval);

    // Cleanup
    return () => clearInterval(id);
  }, [callback, interval, enabled]);
}
