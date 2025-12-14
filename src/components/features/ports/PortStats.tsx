import { Badge } from "@/components/ui/badge";

interface PortStatsProps {
  total: number;
  filtered: number;
  hasFilter: boolean;
}

export function PortStats({ total, filtered, hasFilter }: PortStatsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>
        Showing <strong>{filtered}</strong> of <strong>{total}</strong>{" "}
        listening port{total !== 1 ? "s" : ""}
      </span>
      {hasFilter && <Badge variant="secondary">Filtered</Badge>}
    </div>
  );
}
