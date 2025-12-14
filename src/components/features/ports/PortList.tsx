import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PortTable } from "./PortTable";
import { SearchBar } from "./SearchBar";
import { PortStats } from "./PortStats";
import type { PortInfo } from "@/types/ports";

interface PortListProps {
  ports: PortInfo[];
  loading: boolean;
  killingPid: number | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onKillClick: (pid: number, processName: string) => void;
}

export function PortList({
  ports,
  loading,
  killingPid,
  searchTerm,
  onSearchChange,
  onRefresh,
  onKillClick,
}: PortListProps) {
  const filteredPorts = useMemo(() => {
    if (!searchTerm.trim()) {
      return ports;
    }

    const search = searchTerm.toLowerCase();
    return ports.filter(
      (port) =>
        port.port.toString().includes(search) ||
        port.process_name.toLowerCase().includes(search) ||
        port.pid.toString().includes(search)
    );
  }, [searchTerm, ports]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onRefresh={onRefresh}
            loading={loading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <PortTable
            ports={filteredPorts}
            loading={loading}
            killingPid={killingPid}
            onKillClick={onKillClick}
          />
        </CardContent>
      </Card>

      {ports.length > 0 && (
        <PortStats
          total={ports.length}
          filtered={filteredPorts.length}
          hasFilter={!!searchTerm.trim()}
        />
      )}
    </div>
  );
}

