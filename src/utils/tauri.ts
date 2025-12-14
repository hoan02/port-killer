/**
 * Check if the app is running in Tauri context
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  
  // Check for Tauri v2 - multiple ways to detect
  return (
    "__TAURI_INTERNALS__" in window ||
    "__TAURI_METADATA__" in window ||
    "__TAURI__" in window ||
    (window as any).__TAURI__ !== undefined
  );
}

