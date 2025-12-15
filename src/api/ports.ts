import { invoke } from "@tauri-apps/api/core";
import type { PortInfo } from "../types/ports";

/**
 * List all TCP ports in LISTENING state
 * @returns Promise resolving to an array of port information
 */
export async function listPorts(): Promise<PortInfo[]> {
  try {
    const ports = await invoke<PortInfo[]>("list_listening_ports");
    return ports;
  } catch (error) {
    throw new Error(
      `Failed to list ports: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Kill a process by its PID
 * @param pid Process ID to terminate
 * @throws Error if the process cannot be killed
 */
export async function killProcess(pid: number): Promise<void> {
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error(`Invalid PID: ${pid}. PID must be a positive integer.`);
  }

  try {
    await invoke("kill_process", { pid });
  } catch (error) {
    throw new Error(
      `Failed to kill process ${pid}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

