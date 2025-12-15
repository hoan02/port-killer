import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  Minus,
  Square,
  X,
  Fullscreen,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { isTauri } from "@/utils/tauri";

type TitleBarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export function TitleBar({ sidebarCollapsed, onToggleSidebar }: TitleBarProps) {
  const { t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupWindow = async () => {
      try {
        const appWindow = getCurrentWindow();

        const checkMaximized = async () => {
          try {
            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);
          } catch (error) {
            // Silently fail if not in Tauri
            if (isTauri()) {
              console.error("Error checking maximized state:", error);
            }
          }
        };

        await checkMaximized();

        try {
          unlisten = await appWindow.onResized(() => {
            checkMaximized();
          });
        } catch (error) {
          if (isTauri()) {
            console.error("Error setting up resize listener:", error);
          }
        }
      } catch (error) {
        // Silently fail if not in Tauri
        if (isTauri()) {
          console.error("Error getting window:", error);
        }
      }
    };

    setupWindow();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  const handleMinimize = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isTauri()) {
      console.warn("Not running in Tauri - window controls disabled");
      return;
    }

    try {
      const appWindow = getCurrentWindow();
      await appWindow.minimize();
    } catch (error) {
      console.error("Error minimizing window:", error);
    }
  };

  const handleMaximize = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isTauri()) {
      console.warn("Not running in Tauri - window controls disabled");
      return;
    }

    try {
      const appWindow = getCurrentWindow();
      await appWindow.toggleMaximize();
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    } catch (error) {
      console.error("Error toggling maximize:", error);
    }
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isTauri()) {
      console.warn("Not running in Tauri - window controls disabled");
      return;
    }

    try {
      const appWindow = getCurrentWindow();
      await appWindow.close();
    } catch (error) {
      console.error("Error closing window:", error);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex h-9 items-center justify-between border-b border-border backdrop-blur"
      style={{ backgroundColor: "var(--titlebar)" }}
      data-tauri-drag-region
    >
      {/* Left section: App icon + name */}
      <div className="flex items-center gap-2 px-1.5" data-tauri-drag-region>
        <div className="flex items-center gap-2">
          <img
            src="/app-icon.png"
            alt="App Icon"
            className="h-8 w-8 object-contain pointer-events-none select-none shrink-0"
            style={{
              imageRendering: "crisp-edges",
              backgroundColor: "transparent",
            }}
          />
          <span className="text-sm font-semibold">{t("app.title")}</span>
        </div>
      </div>

      {/* Center section: Drag region */}
      <div className="flex-1" data-tauri-drag-region />

      {/* Right section: Sidebar toggle + Window controls */}
      <div className="flex items-center no-drag">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md text-foreground/80 dark:text-foreground/90 hover:text-foreground hover:bg-border/60 dark:hover:bg-border/40 focus-visible:ring-1 focus-visible:ring-border"
          title={t("titleBar.toggleSidebar")}
          aria-label={t("titleBar.toggleSidebar")}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSidebar();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-[46px] cursor-default rounded-none text-foreground/80 dark:text-foreground/90 hover:text-foreground hover:bg-border/70 dark:hover:bg-border/40 focus-visible:ring-1 focus-visible:ring-border"
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
            title={t("titleBar.minimize")}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-[46px] cursor-default rounded-none text-foreground/80 dark:text-foreground/90 hover:text-foreground hover:bg-border/70 dark:hover:bg-border/40 focus-visible:ring-1 focus-visible:ring-border"
            onClick={handleMaximize}
            onMouseDown={(e) => e.stopPropagation()}
            title={isMaximized ? t("titleBar.restore") : t("titleBar.maximize")}
          >
            {isMaximized ? (
              <Fullscreen className="h-3.5 w-3.5" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-[46px] cursor-default rounded-none transition-colors text-foreground/80 dark:text-foreground/90",
              "hover:bg-red-500 hover:text-white dark:hover:bg-red-600 focus-visible:ring-1 focus-visible:ring-red-500"
            )}
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            title={t("titleBar.close")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
