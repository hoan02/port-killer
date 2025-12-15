import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface KillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processName: string;
  pid: number;
  onConfirm: () => void;
  killing: boolean;
}

export function KillDialog({
  open,
  onOpenChange,
  processName,
  pid,
  onConfirm,
  killing,
}: KillDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("dialog.kill.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dialog.kill.description")} <strong>{processName}</strong> (PID:{" "}
            <strong>{pid}</strong>)?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-destructive">{t("dialog.kill.warning")}</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={killing}
          >
            {t("dialog.kill.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={killing}>
            {killing ? t("dialog.kill.killing") : t("dialog.kill.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

