import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Activity, Minus, Square, X, Fullscreen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "./SettingsMenu";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { isTauri } from "@/utils/tauri";

export function TitleBar() {
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
      className="fixed top-0 left-0 right-0 z-50 flex h-9 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      data-tauri-drag-region
    >
      {/* Left section: App icon + name */}
      <div className="flex items-center gap-2 px-3" data-tauri-drag-region>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t("app.title")}</span>
        </div>
      </div>

      {/* Center section: Drag region */}
      <div className="flex-1" data-tauri-drag-region />

      {/* Right section: Settings + Window controls */}
      <div className="flex items-center no-drag">
        <SettingsMenu />

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-[46px] rounded-none hover:bg-accent"
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
            title={t("titleBar.minimize")}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-[46px] rounded-none hover:bg-accent"
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
              "h-9 w-[46px] rounded-none hover:bg-red-500 hover:text-white",
              "transition-colors"
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
