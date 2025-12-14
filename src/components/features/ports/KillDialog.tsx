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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Kill Process
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to kill process{" "}
            <strong>{processName}</strong> (PID: <strong>{pid}</strong>)?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-destructive">
            This action cannot be undone. The process will be terminated
            immediately.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={killing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={killing}
          >
            {killing ? "Killing..." : "Kill Process"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

