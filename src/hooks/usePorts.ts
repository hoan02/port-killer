import { useState, useCallback } from "react";
import { listPorts, killProcess } from "@/api/ports";
import type { PortInfo } from "@/types/ports";

export function usePorts() {
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [killingPid, setKillingPid] = useState<number | null>(null);

  const loadPorts = useCallback(async () => {
    try {
      setError(null);
      const data = await listPorts();
      setPorts(data);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load ports";
      setError(errorMessage);
      setLoading(false);
      console.error("Error loading ports:", err);
    }
  }, []);

  const handleKillProcess = useCallback(
    async (pid: number) => {
      setKillingPid(pid);
      setError(null);

      try {
        await killProcess(pid);
        await loadPorts();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to kill process";
        setError(errorMessage);
        console.error("Error killing process:", err);
        throw err;
      } finally {
        setKillingPid(null);
      }
    },
    [loadPorts]
  );

  return {
    ports,
    loading,
    error,
    killingPid,
    loadPorts,
    killProcess: handleKillProcess,
    setError,
  };
}

