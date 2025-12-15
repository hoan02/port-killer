import { useMemo, useState, useEffect } from "react";
import { PortTable } from "./PortTable";
import { SearchBar } from "./SearchBar";
import { PortStats } from "./PortStats";
import { Pagination } from "@/components/ui/pagination";
import type { PortInfo } from "@/types/ports";

interface PortListProps {
  ports: PortInfo[];
  loading: boolean;
  killingPid: number | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onKillClick: (pid: number, processName: string) => void;
  onMetricsChange?: (metrics: PortMetrics) => void;
}

export type PortMetrics = {
  total: number;
  filtered: number;
  currentPage: number;
  itemsPerPage: number;
  activeFilter: string | null;
};

const DEFAULT_ITEMS_PER_PAGE = 25;

export function PortList({
  ports,
  loading,
  killingPid,
  searchTerm,
  onSearchChange,
  onRefresh,
  onKillClick,
  onMetricsChange,
}: PortListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredPorts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPorts = filteredPorts.slice(startIndex, endIndex);

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  // Report metrics to parent for status bar
  useEffect(() => {
    onMetricsChange?.({
      total: ports.length,
      filtered: filteredPorts.length,
      currentPage,
      itemsPerPage,
      activeFilter,
    });
  }, [
    ports.length,
    filteredPorts.length,
    currentPage,
    itemsPerPage,
    activeFilter,
    onMetricsChange,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
    if (filter) {
      onSearchChange(filter);
    } else {
      onSearchChange("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
          loading={loading}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="border border-border rounded-sm overflow-hidden bg-background">
        <PortTable
          ports={paginatedPorts}
          loading={loading}
          killingPid={killingPid}
          onKillClick={onKillClick}
        />
        {filteredPorts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPorts.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {ports.length > 0 && (
        <div className="px-1">
          <PortStats
            total={ports.length}
            filtered={filteredPorts.length}
            hasFilter={!!searchTerm.trim() || !!activeFilter}
          />
        </div>
      )}
    </div>
  );
}
