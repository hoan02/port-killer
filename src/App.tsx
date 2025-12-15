import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TitleBar } from "@/components/layout/TitleBar";
import {
  PortList,
  type PortMetrics,
} from "@/components/features/ports/PortList";
import { KillDialog } from "@/components/features/ports/KillDialog";
import { usePorts } from "@/hooks/usePorts";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sidebar,
  SidebarRail,
  type FavoritePreset,
  type SidebarMode,
} from "@/components/layout/Sidebar";
import { StatusBar } from "@/components/layout/StatusBar";
import { cn } from "@/lib/utils";

function App() {
  const { ports, loading, error, killingPid, loadPorts, killProcess } =
    usePorts();

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmKill, setConfirmKill] = useState<{
    pid: number;
    name: string;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("favorites");
  const [lastExpandedLayout, setLastExpandedLayout] = useState<number[]>([
    24, 76,
  ]);
  const [statusBarVisible, setStatusBarVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem("status-bar-visible");
    if (saved === null) return true;
    return saved === "true";
  });
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("auto-refresh-enabled");
    if (saved === null) return true;
    return saved === "true";
  });
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(() => {
    const saved = localStorage.getItem("auto-refresh-interval");
    const parsed = saved ? Number(saved) : NaN;
    return Number.isFinite(parsed) && parsed > 500 ? parsed : 2000;
  });
  const [metrics, setMetrics] = useState<PortMetrics | null>(null);
  const panelGroupRef = useRef<ImperativePanelGroupHandle | null>(null);

  const SIDEBAR_LAYOUT_KEY = "sidebar-layout-v1";
  const defaultLayout = [24, 76];
  // Khi "collapsed" phần nội dung sidebar ẩn hoàn toàn (activity bar nằm ngoài panel)
  const collapsedLayout = useMemo(() => [0, 100], []);
  const minSidebarSize = 18;
  const FAVORITES_KEY = "favorite-presets-v1";

  const normalizeLayout = useMemo(
    () => (layout: number[]) => {
      // Keep the sidebar above its minimum so reopening never restores a zero-width panel
      const sidebar = Math.max(layout[0], minSidebarSize);
      const content = 100 - sidebar;
      return [sidebar, content];
    },
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_LAYOUT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        layout?: number[];
        collapsed?: boolean;
      };
      const savedLayout =
        parsed.layout && Array.isArray(parsed.layout)
          ? parsed.layout
          : defaultLayout;
      const savedCollapsed =
        typeof parsed.collapsed === "boolean" ? parsed.collapsed : false;

      if (!savedCollapsed) {
        setLastExpandedLayout(normalizeLayout(savedLayout));
      }

      panelGroupRef.current?.setLayout(
        savedCollapsed ? collapsedLayout : normalizeLayout(savedLayout)
      );
      setSidebarCollapsed(savedCollapsed);
    } catch {
      // ignore corrupted layout
    }
  }, [collapsedLayout, normalizeLayout]);

  const persistLayout = (nextLayout: number[], nextCollapsed: boolean) => {
    localStorage.setItem(
      SIDEBAR_LAYOUT_KEY,
      JSON.stringify({ layout: nextLayout, collapsed: nextCollapsed })
    );
  };

  const persistStatusBar = (next: boolean) => {
    localStorage.setItem("status-bar-visible", String(next));
    setStatusBarVisible(next);
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("auto-refresh-enabled", String(next));
      return next;
    });
  };

  const updateAutoRefreshInterval = (nextMs: number) => {
    const safe = Math.max(500, Math.min(nextMs, 30000));
    localStorage.setItem("auto-refresh-interval", String(safe));
    setAutoRefreshInterval(safe);
  };

  const handleLayout = (nextLayout: number[]) => {
    const sidebarSize = nextLayout[0];

    // Treat near-zero sizes as collapsed to avoid persisting unusable layouts
    if (sidebarSize <= collapsedLayout[0] + 0.1) {
      setSidebarCollapsed(true);
      persistLayout(collapsedLayout, true);
      return;
    }

    const normalized = normalizeLayout(nextLayout);
    setLastExpandedLayout(normalized);
    setSidebarCollapsed(false);
    persistLayout(normalized, false);
  };

  const toggleCollapse = () => {
    if (sidebarCollapsed) {
      const expandLayout = lastExpandedLayout || defaultLayout;
      setSidebarCollapsed(false);
      // Đợi 1 tick để minSize/maxSize cập nhật theo trạng thái mới rồi mới set layout
      setTimeout(() => {
        panelGroupRef.current?.setLayout(expandLayout);
      }, 0);
      persistLayout(expandLayout, false);
      return;
    }

    panelGroupRef.current?.setLayout(collapsedLayout);
    setSidebarCollapsed(true);
    persistLayout(collapsedLayout, true);
  };

  const defaultFavorites: FavoritePreset[] = [
    { label: "Frontend (3000)", query: "3000" },
    { label: "API (8080)", query: "8080" },
    { label: "Database (5432)", query: "5432" },
  ];

  const [favoritePresets, setFavoritePresets] = useState<FavoritePreset[]>(
    () => {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (!saved) return defaultFavorites;
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is FavoritePreset =>
              typeof item?.label === "string" && typeof item?.query === "string"
          );
        }
        return defaultFavorites;
      } catch {
        return defaultFavorites;
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritePresets));
    } catch {
      // ignore persistence errors
    }
  }, [favoritePresets]);

  const handleAddFavorite = (preset: FavoritePreset) => {
    setFavoritePresets((prev) => {
      const exists = prev.some(
        (p) => p.label === preset.label && p.query === preset.query
      );
      if (exists) return prev;
      return [...prev, preset];
    });
  };

  const handleUpdateFavorite = (index: number, preset: FavoritePreset) => {
    setFavoritePresets((prev) =>
      prev.map((item, i) => (i === index ? preset : item))
    );
  };

  const handleDeleteFavorite = (index: number) => {
    setFavoritePresets((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-refresh (respect toggle)
  useAutoRefresh(loadPorts, autoRefreshInterval, autoRefreshEnabled);

  const handleKillClick = (pid: number, processName: string) => {
    setConfirmKill({ pid, name: processName });
  };

  const handleClearFilter = () => setSearchTerm("");

  const handleKillConfirm = async () => {
    if (!confirmKill) return;

    try {
      await killProcess(confirmKill.pid);
      setConfirmKill(null);
    } catch (err) {
      // Error is already handled in usePorts hook
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <TitleBar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleCollapse}
      />
      <div className={cn("flex h-full pt-9", statusBarVisible ? "pb-7" : "")}>
        <SidebarRail
          mode={sidebarMode}
          onModeChange={setSidebarMode}
          statusBarVisible={statusBarVisible}
          onToggleStatusBar={persistStatusBar}
        />
        <div className="flex h-full flex-1 flex-col">
          <ResizablePanelGroup
            ref={panelGroupRef}
            direction="horizontal"
            className="flex-1"
            onLayout={handleLayout}
          >
            <ResizablePanel
              defaultSize={24}
              minSize={sidebarCollapsed ? 0 : 18}
              maxSize={sidebarCollapsed ? 0 : 40}
              collapsedSize={0}
              collapsible
            >
              <Sidebar
                collapsed={sidebarCollapsed}
                favorites={favoritePresets}
                onSelectQuery={setSearchTerm}
                onRefresh={loadPorts}
                searchTerm={searchTerm}
                mode={sidebarMode}
                onAddFavorite={handleAddFavorite}
                onUpdateFavorite={handleUpdateFavorite}
                onDeleteFavorite={handleDeleteFavorite}
              />
            </ResizablePanel>
            {!sidebarCollapsed && <ResizableHandle withHandle />}
            <ResizablePanel minSize={45}>
              <div className="h-full overflow-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <PortList
                    ports={ports}
                    loading={loading}
                    killingPid={killingPid}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onRefresh={loadPorts}
                    onKillClick={handleKillClick}
                    onMetricsChange={setMetrics}
                  />

                  {confirmKill && (
                    <KillDialog
                      open={!!confirmKill}
                      onOpenChange={(open) => !open && setConfirmKill(null)}
                      processName={confirmKill.name}
                      pid={confirmKill.pid}
                      onConfirm={handleKillConfirm}
                      killing={killingPid === confirmKill.pid}
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      {statusBarVisible && (
        <StatusBar
          metrics={metrics}
          killingPid={killingPid}
          refreshIntervalMs={autoRefreshInterval}
          autoRefreshEnabled={autoRefreshEnabled}
          onToggleAutoRefresh={toggleAutoRefresh}
          onChangeAutoRefreshInterval={updateAutoRefreshInterval}
          onRefresh={loadPorts}
          sidebarMode={sidebarMode}
          onClearFilter={handleClearFilter}
        />
      )}
    </div>
  );
}

export default App;
