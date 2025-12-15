import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PortMetrics } from "@/components/features/ports/PortList";
import type { SidebarMode } from "@/components/layout/Sidebar";
import { RefreshCcw, Copy } from "lucide-react";

type StatusBarProps = {
  metrics: PortMetrics | null;
  killingPid: number | null;
  refreshIntervalMs?: number;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  onChangeAutoRefreshInterval: (ms: number) => void;
  onRefresh: () => void | Promise<void>;
  sidebarMode: SidebarMode;
  onClearFilter: () => void;
};

export function StatusBar({
  metrics,
  killingPid,
  refreshIntervalMs,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  onChangeAutoRefreshInterval,
  onRefresh,
  sidebarMode,
  onClearFilter,
}: StatusBarProps) {
  const total = metrics?.total ?? 0;
  const filtered = metrics?.filtered ?? 0;
  const activeFilter = metrics?.activeFilter ?? null;
  const refreshLabel = refreshIntervalMs
    ? `${Math.max(1, Math.round(refreshIntervalMs / 1000))}s`
    : null;

  type NetworkState =
    | { loading: true }
    | { loading: false; adapter: string; ip: string; error?: string };

  const [network, setNetwork] = useState<NetworkState>({ loading: true });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchNetwork = async () => {
      const adapterHint =
        (navigator as any)?.connection?.type ||
        (navigator as any)?.connection?.effectiveType ||
        "adapter";
      let ip = window.location.hostname || "localhost";

      try {
        const resp = await fetch("https://api.ipify.org?format=json");
        if (resp.ok) {
          const data = (await resp.json()) as { ip?: string };
          ip = data?.ip || ip;
        }
      } catch {
        // ignore fetch failure, use fallback hostname
      }

      if (cancelled) return;
      setNetwork({ loading: false, adapter: adapterHint, ip });
    };

    fetchNetwork().catch(() => {
      if (!cancelled) {
        setNetwork({
          loading: false,
          adapter: "n/a",
          ip: "n/a",
          error: "unavailable",
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyNetwork = async () => {
    if (network.loading || network.error) return;
    const value = `${network.adapter} ${network.ip}`;
    try {
      await navigator.clipboard?.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore copy failure
    }
  };

  const handleCustomInterval = () => {
    const next = window.prompt(
      "Set auto-refresh interval (ms)",
      String(refreshIntervalMs ?? 2000)
    );
    if (!next) return;
    const parsed = Number(next);
    if (Number.isFinite(parsed) && parsed > 0) {
      onChangeAutoRefreshInterval(parsed);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-7 items-center gap-3 border-t border-border bg-background/90 px-2 text-[11px] text-muted-foreground backdrop-blur">
      {/* Left group: Mode + Ports & Filter */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="h-5 px-2 text-[11px] uppercase">
          {sidebarMode}
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px] flex items-center gap-2"
          onClick={onRefresh}
          title="Reload ports"
        >
          <span className="text-foreground/80">Ports</span>
          <Badge variant="outline" className="h-5 px-2 text-[11px]">
            {filtered}/{total}
          </Badge>
        </Button>

        {activeFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] flex items-center gap-2"
            onClick={onClearFilter}
            title="Clear filter"
          >
            <span className="text-foreground/80">Filter</span>
            <Badge variant="outline" className="h-5 px-2 text-[11px]">
              {activeFilter}
            </Badge>
          </Button>
        )}
      </div>

      {/* Middle group: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px] flex items-center gap-2"
          onClick={onRefresh}
          title="Reload ports"
        >
          <RefreshCcw className="h-3 w-3" />
          <span>Reload</span>
        </Button>

        {refreshLabel && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] flex items-center gap-2"
                title="Auto-refresh settings"
              >
                <span className="text-foreground/80">Auto</span>
                <Badge variant="outline" className="h-5 px-2 text-[11px]">
                  {autoRefreshEnabled ? refreshLabel : "Off"}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={6}>
              <DropdownMenuLabel className="text-[11px]">
                Auto-refresh interval
              </DropdownMenuLabel>
              {[2000, 5000, 10000].map((ms) => (
                <DropdownMenuItem
                  key={ms}
                  className="text-[12px]"
                  onSelect={() => onChangeAutoRefreshInterval(ms)}
                >
                  {Math.round(ms / 100) / 10}s
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[12px]"
                onSelect={handleCustomInterval}
              >
                Custom…
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[12px]"
                onSelect={() => onToggleAutoRefresh()}
              >
                {autoRefreshEnabled ? "Turn off" : "Turn on"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Right group: System states */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px] flex items-center gap-1.5"
          onClick={handleCopyNetwork}
          disabled={network.loading}
          title="Copy network info"
        >
          <span className="text-foreground/80">Net</span>
          {network.loading ? (
            <span className="text-muted-foreground">Loading…</span>
          ) : (
            <Badge variant="outline" className="h-5 px-2 text-[11px]">
              {copied ? "Copied" : `${network.adapter} ${network.ip}`}
            </Badge>
          )}
          <Copy className="h-3 w-3" />
        </Button>

        {killingPid && (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="h-5 px-2 text-[11px]">
              PID {killingPid}
            </Badge>
          </div>
        )}
      </div>

      {killingPid && (
        <>
          <div className="h-4 w-px bg-border/70" />
          <div className="flex items-center gap-2">
            <span className="text-foreground/80">Killing PID</span>
            <Badge variant="destructive" className="h-6 px-2 text-xs">
              {killingPid}
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}
