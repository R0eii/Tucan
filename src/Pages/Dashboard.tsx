import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { SearchX, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import DeviceDrawer from "../components/monitoring/DeviceDrawer";
import DeviceTable from "../components/monitoring/DeviceTable";
import FilterBar from "../components/monitoring/FilterBar";
import KPICards from "../components/monitoring/KPICards";
import TopNavbar from "../components/monitoring/TopNavbar";

import {
  generateMockDevices,
  simulateStatusChange,
} from "../components/monitoring/mockData";
import type { DashboardStats, Device } from "../types";

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("Acme Corporation");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [changedDeviceIds, setChangedDeviceIds] = useState(new Set<string>());

  // 1. Debounce Logic: Updates 'debouncedSearch' 300ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Initialize/Switch Company Logic
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay
    const timer = setTimeout(() => {
      setDevices(generateMockDevices(300));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedCompany]);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, [devices]);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices((prev) => {
        const { updatedDevices, changedIds } = simulateStatusChange(prev);
        setChangedDeviceIds(changedIds);
        setTimeout(() => setChangedDeviceIds(new Set()), 2000);
        return updatedDevices;
      });
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 300);
  }, []);

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsDrawerOpen(true);
  };

  // 3. Filtering Logic (Uses the debounced value)
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      device.ip.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "online" && device.status === "ok") ||
      (statusFilter === "offline" && device.status === "error") ||
      (statusFilter === "warning" && device.status === "warning");

    return matchesSearch && matchesStatus;
  });

  const stats: DashboardStats = {
    total: devices.length,
    online: devices.filter((d) => d.status === "ok").length,
    offline: devices.filter((d) => d.status === "error").length,
    warning: devices.filter((d) => d.status === "warning").length,
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 4 }}>
      <TopNavbar
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        lastUpdate={lastUpdate}
        isRefreshing={isRefreshing}
        onRefresh={refreshData}
      />

      <Container maxWidth={false} sx={{ maxWidth: "1600px", pt: 4 }}>
        {/* Live indicator */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#10b981",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Live Monitoring
          </Typography>
        </Box>

        <KPICards stats={stats} />

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          totalFiltered={filteredDevices.length}
          totalDevices={devices.length}
        />

        {/* 4. Table vs Loading vs Empty State Logic */}
        <Box sx={{ position: "relative" }}>
          {isLoading ? (
            // Skeleton Loader
            <Stack spacing={1}>
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={60}
                  sx={{ borderRadius: 2, bgcolor: "white" }}
                />
              ))}
            </Stack>
          ) : filteredDevices.length > 0 ? (
            <DeviceTable
              devices={filteredDevices}
              onDeviceClick={handleDeviceClick}
              changedDeviceIds={changedDeviceIds}
            />
          ) : (
            // 5. Empty State UI
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed #cbd5e1",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f1f5f9",
                  borderRadius: "50%",
                  color: "#94a3b8",
                }}
              >
                <SearchX size={48} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="#334155">
                  No devices found
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<X size={16} />}
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#0f172a",
                }}
              >
                Clear all filters
              </Button>
            </Paper>
          )}
        </Box>
      </Container>

      <DeviceDrawer
        device={selectedDevice}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </Box>
  );
}
