import {
  Activity,
  Check,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCcw,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsMenu } from "./SettingsMenu";

export type FavoritePreset = {
  label: string;
  query: string;
};

export type SidebarMode = "favorites" | "stats";

type SidebarProps = {
  collapsed: boolean;
  favorites: FavoritePreset[];
  onSelectQuery: (query: string) => void;
  onRefresh: () => void;
  searchTerm: string;
  onAddFavorite?: (preset: FavoritePreset) => void;
  onUpdateFavorite?: (index: number, preset: FavoritePreset) => void;
  onDeleteFavorite?: (index: number) => void;
  mode: SidebarMode;
};

type SidebarRailProps = {
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
  statusBarVisible: boolean;
  onToggleStatusBar: (next: boolean) => void;
};

// Thanh activity bar cố định, luôn hiển thị
export function SidebarRail({
  mode,
  onModeChange,
  statusBarVisible,
  onToggleStatusBar,
}: SidebarRailProps) {
  return (
    <div className="flex h-full w-11 min-w-11 flex-col items-center justify-between border-r bg-background/90 px-1 py-2">
      <div className="flex flex-col gap-1">
        <Button
          variant={mode === "favorites" ? "default" : "ghost"}
          size="icon"
          className={cn(
            "size-8",
            mode === "favorites" && "bg-primary text-primary-foreground"
          )}
          onClick={() => onModeChange("favorites")}
        >
          <Star className="size-4" />
        </Button>
        <Button
          variant={mode === "stats" ? "default" : "ghost"}
          size="icon"
          className={cn(
            "size-8",
            mode === "stats" && "bg-primary text-primary-foreground"
          )}
          onClick={() => onModeChange("stats")}
        >
          <Activity className="size-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <SettingsMenu
          statusBarVisible={statusBarVisible}
          onToggleStatusBar={onToggleStatusBar}
        />
      </div>
    </div>
  );
}

export function Sidebar({
  collapsed,
  favorites,
  onSelectQuery,
  onRefresh,
  searchTerm,
  onAddFavorite,
  onUpdateFavorite,
  onDeleteFavorite,
  mode,
}: SidebarProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const labelClass = collapsed ? "sr-only" : undefined;
  const sectionClass = cn(
    "rounded-md border bg-background/70 p-3 space-y-3 w-full",
    collapsed && "px-2 py-2"
  );

  const presets: FavoritePreset[] = [
    { label: "All ports", query: "" },
    { label: "Frontend 3000", query: "3000" },
    { label: "API 8080", query: "8080" },
    { label: "DB 5432", query: "5432" },
  ];

  const renderPreset = (preset: FavoritePreset) => {
    const isActive = searchTerm === preset.query;
    return (
      <Button
        key={preset.label}
        variant={isActive ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "justify-start w-full",
          collapsed && "justify-center px-2 [&_span]:sr-only"
        )}
        onClick={() => onSelectQuery(preset.query)}
      >
        <Filter className="size-4" />
        <span>{preset.label}</span>
      </Button>
    );
  };

  const beginEdit = (index: number, fav: FavoritePreset) => {
    setEditingIndex(index);
    setDraftLabel(fav.label);
    setDraftQuery(fav.query);
    setCreating(false);
  };

  const beginCreate = () => {
    setCreating(true);
    setEditingIndex(null);
    setDraftLabel(searchTerm || "");
    setDraftQuery(searchTerm || "");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setCreating(false);
    setDraftLabel("");
    setDraftQuery("");
  };

  const commitEdit = (index: number | null) => {
    if (!draftLabel.trim() || !draftQuery.trim()) {
      return;
    }

    const next: FavoritePreset = {
      label: draftLabel.trim(),
      query: draftQuery.trim(),
    };

    if (creating) {
      onAddFavorite?.(next);
    } else if (index !== null) {
      onUpdateFavorite?.(index, next);
    }

    cancelEdit();
  };

  return (
    <aside className="flex h-full bg-muted/30 backdrop-blur-sm">
      {/* Phần nội dung chính của sidebar */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-3 border-r",
          collapsed && "hidden"
        )}
      >
        <div className="flex items-center justify-between border-b px-3 py-2 w-full">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background/70">
              <Star className="size-3.5" />
              <span className={labelClass}>
                {mode === "favorites" ? "Port Explorer" : "Port Stats"}
              </span>
            </Badge>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-4 w-full">
          {mode === "favorites" && (
            <section className={sectionClass} aria-label="Quick filters">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                      labelClass
                    )}
                  >
                    Filters
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "grid gap-2",
                  collapsed ? "grid-cols-1" : "grid-cols-1"
                )}
              >
                {presets.map(renderPreset)}
              </div>
            </section>
          )}

          {mode === "favorites" && (
            <section className={sectionClass} aria-label="Favorites">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                      labelClass
                    )}
                  >
                    Favorites
                  </span>
                  {!collapsed && favorites.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-2">
                      {favorites.length} saved
                    </Badge>
                  )}
                </div>

                {!collapsed && onAddFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 hover:bg-border/40"
                    onClick={beginCreate}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                )}
              </div>

              {favorites.length === 0 && !creating ? (
                <p className={cn("text-xs text-muted-foreground", labelClass)}>
                  No favorites yet. Use the{" "}
                  <span className="font-medium">+</span> button to save filters.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {creating && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
                      >
                        <Star className="size-4" />
                      </Button>
                      {!collapsed && (
                        <div className="flex flex-1 flex-col gap-1">
                          <Input
                            autoFocus
                            placeholder="Label"
                            value={draftLabel}
                            onChange={(e) => setDraftLabel(e.target.value)}
                            className="h-7 text-xs"
                          />
                          <Input
                            placeholder="Query (e.g. 3000)"
                            value={draftQuery}
                            onChange={(e) => setDraftQuery(e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                      )}
                      {!collapsed && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => commitEdit(null)}
                          >
                            <Check className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={cancelEdit}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {favorites.map((fav, index) => {
                    const isEditing = editingIndex === index;
                    if (isEditing) {
                      return (
                        <div
                          key={`${fav.label}-${index}`}
                          className="flex items-center gap-1.5"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0"
                          >
                            <Star className="size-4" />
                          </Button>
                          {!collapsed && (
                            <div className="flex flex-1 flex-col gap-1">
                              <Input
                                autoFocus
                                placeholder="Label"
                                value={draftLabel}
                                onChange={(e) => setDraftLabel(e.target.value)}
                                className="h-7 text-xs"
                              />
                              <Input
                                placeholder="Query (e.g. 3000)"
                                value={draftQuery}
                                onChange={(e) => setDraftQuery(e.target.value)}
                                className="h-7 text-xs"
                              />
                            </div>
                          )}
                          {!collapsed && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => commitEdit(index)}
                              >
                                <Check className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={cancelEdit}
                              >
                                <X className="size-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    const isActive = searchTerm === fav.query;

                    return (
                      <div
                        key={`${fav.label}-${index}`}
                        className={cn(
                          "group flex items-center gap-1.5 rounded-md",
                          !collapsed && "px-1 py-0.5",
                          isActive && "bg-accent/70"
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "size-7 shrink-0",
                            isActive && "text-primary"
                          )}
                          onClick={() => onSelectQuery(fav.query)}
                        >
                          <Star className="size-4" />
                        </Button>
                        {!collapsed && (
                          <button
                            type="button"
                            className={cn(
                              "flex-1 truncate text-left text-xs hover:underline",
                              isActive && "font-medium"
                            )}
                            onClick={() => onSelectQuery(fav.query)}
                          >
                            {fav.label}
                          </button>
                        )}
                        {!collapsed &&
                          (onUpdateFavorite || onDeleteFavorite) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="size-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={() => beginEdit(index, fav)}
                                >
                                  <Pencil className="size-3.5" />
                                  Rename / Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => onDeleteFavorite?.(index)}
                                >
                                  <Trash2 className="size-3.5" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {mode === "stats" && (
            <section className={sectionClass} aria-label="Stats">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    labelClass
                  )}
                >
                  Quick overview
                </span>
              </div>
              <div className={cn("space-y-2", collapsed && "sr-only")}>
                <p className="text-xs text-muted-foreground">
                  Coming soon: top ports, most active PIDs, and history graphs.
                </p>
                <p className="text-xs text-muted-foreground">
                  For now you can still use filters & favorites in the default
                  mode.
                </p>
              </div>
            </section>
          )}
        </div>

        <div className="w-full border-t px-3 py-3">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full",
              collapsed && "justify-center px-2 [&_span]:sr-only"
            )}
            onClick={onRefresh}
          >
            <RefreshCcw className="size-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
