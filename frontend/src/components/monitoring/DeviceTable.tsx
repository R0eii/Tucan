import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronRight,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import React, { useMemo } from "react";
import type { Device, DeviceStatus } from "../../types";

interface DeviceTableProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  changedDeviceIds: Set<string>;
}

const StatusBadge = ({ status }: { status: DeviceStatus }) => {
  const config = {
    ok: {
      label: "Online",
      icon: Wifi,
      color: "success" as const,
      bgcolor: "#ecfdf5",
      iconColor: "#10b981",
    },
    error: {
      label: "Offline",
      icon: WifiOff,
      color: "error" as const,
      bgcolor: "#fef2f2",
      iconColor: "#ef4444",
    },
    warning: {
      label: "Warning",
      icon: AlertTriangle,
      color: "warning" as const,
      bgcolor: "#fffbeb",
      iconColor: "#f59e0b",
    },
  };

  const current = config[status] || config.error;
  const Icon = current.icon;

  return (
    <Chip
      icon={<Icon size={12} />}
      label={current.label}
      size="small"
      variant="outlined"
      sx={{
        bgcolor: current.bgcolor,
        borderColor: `${current.iconColor}40`,
        color: `${current.iconColor}`, // Darker shade for text
        fontWeight: 600,
        "& .MuiChip-icon": { color: "inherit" },
      }}
    />
  );
};

const TimeAgo = ({ date }: { date: Date }) => {
  const isRecent = new Date().getTime() - new Date(date).getTime() < 60000;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Clock size={14} color={isRecent ? "#10b981" : "#94a3b8"} />
      <Typography
        variant="body2"
        sx={{
          color: isRecent ? "#059669" : "#64748b",
          fontWeight: isRecent ? 500 : 400,
        }}
      >
        {formatDistanceToNow(new Date(date), { addSuffix: true })}
      </Typography>
    </Box>
  );
};

export default function DeviceTable({
  devices,
  onDeviceClick,
  changedDeviceIds,
}: DeviceTableProps) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Device;
    direction: "asc" | "desc";
  }>({ key: "status", direction: "desc" });

  const sortedDevices = useMemo(() => {
    const sorted = [...devices];
    sorted.sort((a, b) => {
      if (sortConfig.key === "status") {
        const statusOrder = { error: 0, warning: 1, ok: 2 };
        const orderA = statusOrder[a.status as DeviceStatus] || 0;
        const orderB = statusOrder[b.status as DeviceStatus] || 0;
        return sortConfig.direction === "asc"
          ? orderA - orderB
          : orderB - orderA;
      }
      // Simple generic sort
      if (a[sortConfig.key]! < b[sortConfig.key]!) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key]! > b[sortConfig.key]!) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [devices, sortConfig]);

  const handleSort = (key: keyof Device) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const SortHeader = ({
    column,
    label,
  }: {
    column: keyof Device;
    label: string;
  }) => (
    <Button
      variant="text"
      onClick={() => handleSort(column)}
      endIcon={<ArrowUpDown size={14} style={{ opacity: 0.5 }} />}
      sx={{
        color: "#475569",
        fontWeight: 600,
        textTransform: "none",
        p: 0,
        minWidth: 0,
        "&:hover": { bgcolor: "transparent", color: "#0f172a" },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "white",
      }}
    >
      <TableContainer sx={{ height: "calc(100vh - 380px)", minHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <SortHeader column="name" label="Device Name" />
              </TableCell>
              <TableCell>
                <SortHeader column="ip" label="IP Address" />
              </TableCell>
              <TableCell>
                <SortHeader column="department" label="Department" />
              </TableCell>
              <TableCell>
                <SortHeader column="status" label="Status" />
              </TableCell>
              <TableCell>
                <SortHeader column="lastUpdate" label="Last Update" />
              </TableCell>
              <TableCell>Error Message</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody component={AnimatePresence}>
            {sortedDevices.map((device) => {
              const isChanged = changedDeviceIds.has(device.id);
              const isError = device.status === "error";
              const isWarn = device.status === "warning";

              return (
                <Box
                  component={motion.tr}
                  key={device.id}
                  layout
                  initial={
                    isChanged
                      ? {
                          backgroundColor:
                            device.status === "ok" ? "#ecfdf5" : "#fef2f2",
                        }
                      : undefined
                  }
                  animate={{
                    backgroundColor: isChanged
                      ? [
                          device.status === "ok" ? "#ecfdf5" : "#fef2f2",
                          "#ffffff",
                        ]
                      : isError
                      ? "rgba(254, 242, 242, 0.4)"
                      : isWarn
                      ? "rgba(255, 251, 235, 0.4)"
                      : "#ffffff",
                  }}
                  transition={{ duration: 2 }}
                  onClick={() => onDeviceClick(device)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f8fafc !important" },
                    "& td": { borderColor: "#f1f5f9" },
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="#0f172a"
                      >
                        {device.name}
                      </Typography>
                      <Typography variant="caption" color="#94a3b8">
                        {device.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="code"
                      sx={{
                        fontSize: "0.75rem",
                        bgcolor: "#f1f5f9",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        color: "#475569",
                        fontFamily: "monospace",
                      }}
                    >
                      {device.ip}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#475569">
                      {device.department}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={device.status} />
                  </TableCell>
                  <TableCell>
                    <TimeAgo date={device.lastUpdate} />
                  </TableCell>
                  <TableCell>
                    {device.errorMessage ? (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {device.errorMessage}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <ChevronRight size={16} color="#cbd5e1" />
                  </TableCell>
                </Box>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="#64748b">
          Showing{" "}
          <Box component="span" fontWeight={600} color="#334155">
            {sortedDevices.length}
          </Box>{" "}
          devices
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#10b981",
              animation: "pulse 2s infinite",
            }}
          />
          <Typography variant="caption" color="#94a3b8">
            Auto-refresh active
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
