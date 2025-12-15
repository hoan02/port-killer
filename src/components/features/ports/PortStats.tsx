import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface PortStatsProps {
  total: number;
  filtered: number;
  hasFilter: boolean;
}

export function PortStats({ total, filtered, hasFilter }: PortStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>
        {filtered} {t("ports.stats.of")} {total}{" "}
        {total !== 1
          ? t("ports.stats.listeningPorts")
          : t("ports.stats.listeningPort")}
      </span>
      {hasFilter && (
        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
          Filtered
        </Badge>
      )}
    </div>
  );
}

