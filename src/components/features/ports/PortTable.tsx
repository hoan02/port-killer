import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortInfo } from "@/types/ports";
import { AlertCircle } from "lucide-react";

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
  if (loading && ports.length === 0) {
    return (
      <div className="space-y-3 p-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (ports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No listening ports found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Port</TableHead>
          <TableHead>Process Name</TableHead>
          <TableHead className="w-[100px]">PID</TableHead>
          <TableHead className="text-right w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ports.map((port) => (
          <TableRow key={`${port.pid}-${port.port}`}>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                {port.port}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {port.process_name}
            </TableCell>
            <TableCell>
              <code className="text-sm text-muted-foreground">{port.pid}</code>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onKillClick(port.pid, port.process_name)}
                disabled={killingPid === port.pid}
              >
                {killingPid === port.pid ? "Killing..." : "Kill"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

