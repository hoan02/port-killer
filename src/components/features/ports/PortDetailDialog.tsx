import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PortInfo } from "@/types/ports";
import { useTranslation } from "react-i18next";
import { Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  port: PortInfo | null;
  onKillClick?: (pid: number, processName: string) => void;
}

export function PortDetailDialog({
  open,
  onOpenChange,
  port,
  onKillClick,
}: PortDetailDialogProps) {
  const { t } = useTranslation();

  if (!port) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            {t("ports.detail.title")}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t("ports.detail.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("ports.table.port")}
              </label>
              <div>
                <Badge variant="outline" className="font-mono">
                  {port.port}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("ports.table.pid")}
              </label>
              <div>
                <code className="text-sm">{port.pid}</code>
              </div>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t("ports.table.processName")}
              </label>
              <div className="text-sm break-all">{port.process_name}</div>
              {port.process_path && port.process_path !== port.process_name && (
                <div className="text-xs text-muted-foreground break-all mt-1">
                  {port.process_path}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("ports.detail.protocol")}
              </label>
              <div>
                <Badge variant="secondary" className="text-xs">
                  TCP
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("ports.detail.state")}
              </label>
              <div>
                <Badge variant="outline" className="text-xs">
                  LISTENING
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("ports.detail.localAddress")}
              </label>
              <div className="text-xs font-mono text-muted-foreground">
                0.0.0.0:{port.port}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          {onKillClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => {
                onKillClick(port.pid, port.process_name);
                onOpenChange(false);
              }}
              title={t("ports.kill")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {t("ports.detail.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
