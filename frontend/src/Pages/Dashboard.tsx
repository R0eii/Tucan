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

import type { DashboardStats, Device } from "../types";
import AddDeviceDialog from "../components/monitoring/AddDeviceDialog";

const API_URL = "http://localhost:5000/api/devices";

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("Acme Corporation");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [changedDeviceIds, setChangedDeviceIds] = useState(new Set<string>());

  const alerts = devices.filter((d) => d.status !== "ok");

  // 1. Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch Data from Real Backend
  const fetchDevices = useCallback(async () => {
    try {
      // אם בחרנו "All Companies" נשלח all, אחרת נשלח את שם החברה
      // הערה: יש לוודא ששמות החברות ב-Frontend תואמים למה שהכנסנו ב-Seed ב-Backend
      const url = new URL(API_URL);
      if (selectedCompany !== "All Companies") {
        url.searchParams.append("company", selectedCompany);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch");

      const data: Device[] = await res.json();

      // המרת מחרוזות תאריך לאובייקטי Date אמיתיים (כי JSON מחזיר Strings)
      const parsedData = data.map((d) => ({
        ...d,
        lastUpdate: new Date(d.lastUpdate),
        lastIncident: d.lastIncident ? new Date(d.lastIncident) : null,
      }));

      setDevices(parsedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany]);

  // טעינה ראשונית ובעת החלפת חברה
  useEffect(() => {
    setIsLoading(true);
    fetchDevices();
  }, [fetchDevices]);

  // 3. Real Backend Refresh Logic
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // קריאה לשרת כדי שיבצע סימולציה של שינויים במסד הנתונים
      await fetch(`${API_URL}/refresh-simulation`, { method: "POST" });

      // לאחר שהשרת עדכן את ה-DB, נשלוף את הנתונים החדשים
      await fetchDevices();

      // סימון ויזואלי של שינויים (אופציונלי - דורש לוגיקה מורכבת יותר להשוואה, כרגע נשאיר פשוט)
      setChangedDeviceIds(new Set());
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchDevices]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsDrawerOpen(true);
  };

  // Callback when a device is updated inside the Drawer (Restart/Retry)
  const handleDeviceUpdate = (updatedDevice: Device) => {
    // Update local list
    setDevices((prev) =>
      prev.map((d) =>
        d.id === updatedDevice.id
          ? {
              ...updatedDevice,
              lastUpdate: new Date(updatedDevice.lastUpdate), // Fix date string
              lastIncident: updatedDevice.lastIncident
                ? new Date(updatedDevice.lastIncident)
                : null,
            }
          : d
      )
    );
    // Update selected device view
    setSelectedDevice((prev) =>
      prev && prev.id === updatedDevice.id
        ? {
            ...updatedDevice,
            lastUpdate: new Date(updatedDevice.lastUpdate),
            lastIncident: updatedDevice.lastIncident
              ? new Date(updatedDevice.lastIncident)
              : null,
          }
        : prev
    );
  };

  // Client-side filtering (Search & Status)
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
        alerts={alerts}
        onNotificationClick={handleDeviceClick}
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
          onAddDevice={() => setIsAddDeviceOpen(true)}
        />

        <Box sx={{ position: "relative" }}>
          {isLoading ? (
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
                  Try adjusting your filters or search terms.
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
        onDeviceUpdate={handleDeviceUpdate} // העברת הפונקציה החדשה
        onNeedRefresh={fetchDevices}
      />

      <AddDeviceDialog
        open={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onSuccess={refreshData}
      />
    </Box>
  );
}
