import { Settings, Moon, Sun, Monitor, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type SettingsMenuProps = {
  statusBarVisible: boolean;
  onToggleStatusBar: (next: boolean) => void;
};

export function SettingsMenu({
  statusBarVisible,
  onToggleStatusBar,
}: SettingsMenuProps) {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-foreground/80 dark:text-foreground/90 hover:text-foreground hover:bg-border/60 dark:hover:bg-border/40 focus-visible:ring-1 focus-visible:ring-border"
          title={t("settings.title")}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={6}
        className="w-56 -ml-1"
      >
        <DropdownMenuLabel>{t("settings.language")}</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => changeLanguage("en")}
          className={cn(
            "flex h-7 items-center justify-between py-1 text-xs",
            currentLanguage === "en" && "bg-border/60 dark:bg-border/40"
          )}
        >
          <span>English</span>
          {currentLanguage === "en" && (
            <span className="text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => changeLanguage("vi")}
          className={cn(
            "flex h-7 items-center justify-between py-1 text-xs",
            currentLanguage === "vi" && "bg-border/60 dark:bg-border/40"
          )}
        >
          <span>Tiếng Việt</span>
          {currentLanguage === "vi" && (
            <span className="text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>{t("settings.theme")}</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => setTheme("light")}
          className={cn(
            "flex h-7 items-center gap-2 py-1 text-xs",
            theme === "light" && "bg-border/60 dark:bg-border/40"
          )}
        >
          <Sun className="h-4 w-4" />
          <span>{t("settings.themeLight")}</span>
          {theme === "light" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme("dark")}
          className={cn(
            "flex h-7 items-center gap-2 py-1 text-xs",
            theme === "dark" && "bg-border/60 dark:bg-border/40"
          )}
        >
          <Moon className="h-4 w-4" />
          <span>{t("settings.themeDark")}</span>
          {theme === "dark" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme("system")}
          className={cn(
            "flex h-7 items-center gap-2 py-1 text-xs",
            theme === "system" && "bg-border/60 dark:bg-border/40"
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>{t("settings.themeSystem")}</span>
          {theme === "system" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="h-7 py-1 text-xs">
            <span>{t("settings.advanced") ?? "Advanced"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-60 ml-1">
            <DropdownMenuLabel className="text-xs">
              {t("settings.behavior") ?? "Behavior"}
            </DropdownMenuLabel>
            <DropdownMenuItem className="h-7 py-1 text-xs">
              {t("settings.autoRefresh") ?? "Auto refresh interval"}
            </DropdownMenuItem>
            <DropdownMenuItem className="h-7 py-1 text-xs">
              {t("settings.sidebarMode") ?? "Default sidebar mode"}
            </DropdownMenuItem>
            <DropdownMenuItem className="h-7 py-1 text-xs">
              {t("settings.confirmKill") ?? "Ask before killing process"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="h-7 py-1 text-xs"
              onSelect={() => onToggleStatusBar(!statusBarVisible)}
            >
              <div className="flex items-center gap-2">
                {statusBarVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span>Status bar</span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">
                {statusBarVisible ? "On" : "Off"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
