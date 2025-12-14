import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PortList } from "@/components/features/ports/PortList";
import { KillDialog } from "@/components/features/ports/KillDialog";
import { usePorts } from "@/hooks/usePorts";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

function App() {
  const { ports, loading, error, killingPid, loadPorts, killProcess } =
    usePorts();

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmKill, setConfirmKill] = useState<{
    pid: number;
    name: string;
  } | null>(null);

  // Auto-refresh every 2 seconds
  useAutoRefresh(loadPorts, 2000);

  const handleKillClick = (pid: number, processName: string) => {
    setConfirmKill({ pid, name: processName });
  };

  const handleKillConfirm = async () => {
    if (!confirmKill) return;

    try {
      await killProcess(confirmKill.pid);
      setConfirmKill(null);
    } catch (err) {
      // Error is already handled in usePorts hook
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <Header />
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <PortList
          ports={ports}
          loading={loading}
          killingPid={killingPid}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={loadPorts}
          onKillClick={handleKillClick}
        />

        {confirmKill && (
          <KillDialog
            open={!!confirmKill}
            onOpenChange={(open) => !open && setConfirmKill(null)}
            processName={confirmKill.name}
            pid={confirmKill.pid}
            onConfirm={handleKillConfirm}
            killing={killingPid === confirmKill.pid}
          />
        )}
      </div>
    </div>
  );
}

export default App;
