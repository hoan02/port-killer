import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

const DEV_TOOLS_FILTERS = [
  { label: "Node.js", value: "node.exe" },
  { label: "Java", value: "java.exe" },
  { label: "Angular", value: "ng.exe" },
  { label: "Python", value: "python.exe" },
  { label: "Dotnet", value: "dotnet.exe" },
  { label: "Chrome", value: "chrome.exe" },
  { label: "VS Code", value: "code.exe" },
];

export function SearchBar({
  searchTerm,
  onSearchChange,
  onRefresh,
  loading,
  activeFilter,
  onFilterChange,
}: SearchBarProps) {
  const { t } = useTranslation();

  const handleFilterClick = (filterValue: string) => {
    if (activeFilter === filterValue) {
      onFilterChange?.(null);
      onSearchChange("");
    } else {
      onFilterChange?.(filterValue);
      onSearchChange(filterValue);
    }
  };

  const clearFilters = () => {
    onFilterChange?.(null);
    onSearchChange("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onRefresh} disabled={loading} variant="outline">
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          {t("search.refresh")}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("search.quickFilters")}
        </span>
        {DEV_TOOLS_FILTERS.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => handleFilterClick(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
        {(activeFilter || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            {t("search.clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
