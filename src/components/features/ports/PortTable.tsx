import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortInfo } from "@/types/ports";
import { AlertCircle, Eye, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PortDetailDialog } from "./PortDetailDialog";

interface PortTableProps {
  ports: PortInfo[];
  loading: boolean;
  killingPid: number | null;
  onKillClick: (pid: number, processName: string) => void;
}

export function PortTable({
  ports,
  loading,
  killingPid,
  onKillClick,
}: PortTableProps) {
  const { t } = useTranslation();
  const [selectedPort, setSelectedPort] = useState<PortInfo | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  if (loading && ports.length === 0) {
    return (
      <div className="space-y-1 p-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (ports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">{t("ports.noPorts")}</p>
      </div>
    );
  }

  const handleViewDetail = (port: PortInfo) => {
    setSelectedPort(port);
    setDetailOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="h-9 px-3 text-center text-xs font-medium text-muted-foreground bg-muted/30 w-[80px]">
              {t("ports.table.port")}
            </TableHead>
            <TableHead className="h-9 px-3 text-left text-xs font-medium text-muted-foreground bg-muted/30">
              {t("ports.table.processName")}
            </TableHead>
            <TableHead className="h-9 px-3 text-left text-xs font-medium text-muted-foreground bg-muted/30 w-[80px]">
              {t("ports.table.pid")}
            </TableHead>
            <TableHead className="h-9 px-3 text-center text-xs font-medium text-muted-foreground bg-muted/30 w-[70px]">
              {t("ports.table.protocol")}
            </TableHead>
            <TableHead className="h-9 px-3 text-center text-xs font-medium text-muted-foreground bg-muted/30 w-[100px]">
              {t("ports.table.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ports.map((port) => (
            <TableRow
              key={`${port.pid}-${port.port}`}
              className="border-b border-border/50 hover:bg-muted/30 cursor-default"
            >
              <TableCell className="px-3 py-2 text-center">
                <div className="flex justify-center">
                  <Badge variant="outline" className="font-mono text-xs">
                    {port.port}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <span className="font-normal text-sm">
                    {port.process_name}
                  </span>
                  {port.process_path &&
                    port.process_path !== port.process_name && (
                      <span
                        className="text-xs text-muted-foreground truncate max-w-md"
                        title={port.process_path}
                      >
                        {port.process_path}
                      </span>
                    )}
                </div>
              </TableCell>
              <TableCell className="px-3 py-2">
                <code className="text-xs text-muted-foreground">
                  {port.pid}
                </code>
              </TableCell>
              <TableCell className="px-3 py-2 text-center">
                <div className="flex justify-center">
                  <Badge variant="secondary" className="text-xs">
                    TCP
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-sm hover:bg-border/60 dark:hover:bg-border/40"
                    onClick={() => handleViewDetail(port)}
                    title={t("ports.detail.view")}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-sm hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onKillClick(port.pid, port.process_name)}
                    disabled={killingPid === port.pid}
                    title={
                      killingPid === port.pid
                        ? t("ports.killing")
                        : t("ports.kill")
                    }
                  >
                    {killingPid === port.pid ? (
                      <X className="h-3.5 w-3.5 animate-pulse" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PortDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        port={selectedPort}
        onKillClick={onKillClick}
      />
    </>
  );
}

