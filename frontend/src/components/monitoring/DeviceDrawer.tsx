import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Clock,
  Cpu,
  Edit2,
  Globe,
  HardDrive,
  History,
  MapPin,
  Power,
  RefreshCw,
  Save,
  Shield,
  Smartphone,
  Trash2,
  Wifi,
  WifiOff,
  Briefcase,
  Monitor,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Device, DeviceStatus } from "../../types";

// ✅ Updated Interface: Added onNeedRefresh to trigger parent refetch
interface DeviceDrawerProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onDeviceUpdate: (updatedDevice: Device) => void; // Updates local state immediately
  onNeedRefresh: () => void; // NEW: Triggers a full list refresh from the server
}

interface EditFormState {
  name?: string;
  ip?: string;
  mac?: string;
  location?: string;
  deviceModel?: string;
  os?: string;
  department?: string;
}

const StatusIcon = ({ status }: { status: DeviceStatus }) => {
  const config = {
    ok: { icon: Wifi, color: "#10b981", bg: "#ecfdf5" },
    error: { icon: WifiOff, color: "#ef4444", bg: "#fef2f2" },
    warning: { icon: AlertTriangle, color: "#f59e0b", bg: "#fffbeb" },
  };
  const current = config[status] || config.error;
  const Icon = current.icon;

  return (
    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: current.bg }}>
      <Icon size={24} color={current.color} />
    </Box>
  );
};

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
  subValue?: string;
}

const InfoCard = ({ icon: Icon, label, value, subValue }: InfoCardProps) => (
  <Box
    sx={{
      bgcolor: "#f8fafc",
      borderRadius: 3,
      p: 2,
      display: "flex",
      gap: 2,
      alignItems: "flex-start",
      height: "100%",
    }}
  >
    <Box
      sx={{
        p: 1,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <Icon size={16} color="#64748b" />
    </Box>
    <Box sx={{ overflow: "hidden" }}>
      <Typography
        variant="caption"
        display="block"
        sx={{
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="#334155" noWrap>
        {value || "-"}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="#94a3b8">
          {subValue}
        </Typography>
      )}
    </Box>
  </Box>
);

const MetricBar = ({
  label,
  value,
  color = "primary",
}: {
  label: string;
  value: number;
  color?: "primary" | "error" | "warning" | "success";
}) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="caption" color="#64748b">
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={600} color="#334155">
        {value}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      color={color}
      sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9" }}
    />
  </Box>
);

const HealthCenter = ({ device }: { device: any }) => {
  const theme = useTheme();
  const [range, setRange] = useState("24h");
  const [hoveredItem, setHoveredItem] = useState<any>(null);

  const displayData = useMemo(() => {
    if (!device) return [];
    switch (range) {
      case "24h":
        return device.recentHistory || [];
      case "7d":
        return (device.longTermHistory || []).slice(-7);
      case "90d":
        return device.longTermHistory || [];
      default:
        return device.recentHistory || [];
    }
  }, [range, device]);

  const avgUptime = useMemo(() => {
    if (displayData.length === 0) return 0;
    const sum = displayData.reduce(
      (acc: number, curr: any) => acc + curr.uptime,
      0
    );
    return Math.round((sum / displayData.length) * 100);
  }, [displayData]);

  const getStatusColor = (uptime: number) => {
    if (uptime > 0.9) return "success.main";
    if (uptime > 0.5) return "warning.main";
    return "error.main";
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Activity size={18} color={theme.palette.primary.main} />
          <Typography variant="subtitle2" fontWeight={800}>
            HEALTH CENTER
          </Typography>
        </Stack>

        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={(_, v) => v && setRange(v)}
          size="small"
          sx={{
            height: 28,
            "& .MuiToggleButton-root": {
              px: 1.5,
              fontSize: "0.65rem",
              fontWeight: 700,
            },
          }}
        >
          <ToggleButton value="24h">24H</ToggleButton>
          <ToggleButton value="7d">7D</ToggleButton>
          <ToggleButton value="90d">90D</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            display="block"
          >
            PERIOD UPTIME
          </Typography>
          <Typography
            variant="h4"
            fontWeight={900}
            color={avgUptime > 95 ? "success.main" : "warning.main"}
          >
            {avgUptime}%
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            display="block"
          >
            INCIDENTS
          </Typography>
          <Typography variant="h4" fontWeight={900} color="text.primary">
            {displayData.filter((d: any) => d.uptime < 1).length}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          height: 24,
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredItem ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key={hoveredItem.timestamp}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: getStatusColor(hoveredItem.uptime),
                  letterSpacing: 0.5,
                }}
              >
                {hoveredItem.timestamp} • {Math.round(hoveredItem.uptime * 100)}
                % UPTIME
              </Typography>
            </motion.div>
          ) : (
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontWeight: 600 }}
            >
              HOVER OVER BLOCKS FOR DETAILS
            </Typography>
          )}
        </AnimatePresence>
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.disabled" fontWeight={700}>
          {range === "24h" && "24 HOURS AGO"}
          {range === "7d" && "7 DAYS AGO"}
          {range === "90d" && "90 DAYS AGO"}
        </Typography>
        <Box />
      </Stack>

      <Box
        onMouseLeave={() => setHoveredItem(null)}
        sx={{
          display: "flex",
          gap: "3px",
          flexWrap: range === "90d" ? "wrap" : "nowrap",
          height: range === "90d" ? "auto" : 40,
        }}
      >
        {displayData.map((snap: any, i: number) => (
          <Box
            key={i}
            onMouseEnter={() => setHoveredItem(snap)}
            sx={{
              flex: range === "90d" ? "0 0 14px" : 1,
              height: range === "90d" ? "14px" : "100%",
              minWidth: range === "90d" ? "14px" : "4px",
              borderRadius: "2px",
              bgcolor:
                snap.uptime > 0.9
                  ? "success.main"
                  : snap.uptime > 0.5
                  ? "warning.main"
                  : "error.main",
              opacity: hoveredItem === snap ? 1 : 0.7,
              transition: "all 0.1s ease",
              cursor: "pointer",
              transform: hoveredItem === snap ? "scale(1.05)" : "scale(1)",
              zIndex: hoveredItem === snap ? 10 : 1,
              boxShadow:
                hoveredItem === snap
                  ? `0 0 10px ${alpha(theme.palette.text.primary, 0.2)}`
                  : "none",
            }}
          />
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Box />
        <Typography variant="caption" color="text.disabled" fontWeight={700}>
          NOW
        </Typography>
      </Stack>
    </Box>
  );
};

export default function DeviceDrawer({
  device,
  isOpen,
  onClose,
  onDeviceUpdate,
  onNeedRefresh,
}: DeviceDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (device) {
      setIsEditing(false);
      setEditForm({
        name: device.name,
        ip: device.ip,
        mac: device.mac,
        location: device.location,
        deviceModel: device.deviceModel,
        os: device.os,
        department: device.department,
      });
    }
  }, [device]);

  // ✅ DELETE with live update
  const handleDelete = async () => {
    if (!device || !confirm("Delete this device?")) return;
    try {
      await fetch(`http://localhost:5000/api/devices/${device.id}`, {
        method: "DELETE",
      });
      onNeedRefresh(); // Refresh parent list
      onClose(); // Close drawer
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // ✅ SAVE with live update
  const handleSave = async () => {
    if (!device) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/devices/${device.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        onDeviceUpdate(updated); // Update local view immediately
        onNeedRefresh(); // Ensure parent list is synced (e.g. if sorting changed)
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // ✅ ACTIONS (Retry/Restart) with live update
  const performAction = async (action: "retry" | "restart") => {
    if (!device) return;
    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/${device.id}/${action}`,
        { method: "POST" }
      );
      if (response.ok) {
        const updatedDevice = await response.json();
        onDeviceUpdate(updatedDevice);
        onNeedRefresh(); // Refresh parent list status
      } else {
        console.error("Action failed");
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!device) return null;

  const activityLogs = [
    { time: "2 min ago", event: "Status check completed", type: "info" },
    { time: "5 min ago", event: "Network latency: 24ms", type: "info" },
    { time: "12 min ago", event: "Battery level updated", type: "info" },
    {
      time: "1 hour ago",
      event:
        device.status === "error"
          ? device.errorMessage
          : "Device sync completed",
      type: device.status === "error" ? "error" : "success",
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 500 }, p: 0 } }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
          borderBottom: "1px solid #e2e8f0",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <StatusIcon status={device.status} />
          <Box>
            <Typography variant="h6" fontWeight={700} color="#0f172a">
              {device.name}
            </Typography>
            <Typography variant="body2" color="#64748b">
              {device.id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={device.status.toUpperCase()}
            color={
              device.status === "ok"
                ? "success"
                : device.status === "error"
                ? "error"
                : "warning"
            }
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, border: "1px solid" }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 60,
            display: "flex",
            gap: 1,
          }}
        >
          {isEditing ? (
            <IconButton onClick={handleSave} color="success">
              <Save size={20} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit2 size={20} />
            </IconButton>
          )}
          <IconButton onClick={handleDelete} color="error">
            <Trash2 size={20} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 3, overflowY: "auto" }}>
        {device.errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box
              sx={{
                bgcolor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 3,
                p: 2,
                mb: 3,
                display: "flex",
                gap: 2,
              }}
            >
              <AlertTriangle
                size={20}
                color="#ef4444"
                style={{ marginTop: 2 }}
              />
              <Box>
                <Typography variant="subtitle2" color="#991b1b">
                  Error Detected
                </Typography>
                <Typography variant="body2" color="#b91c1c">
                  {device.errorMessage}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => performAction("retry")}
            disabled={isProcessing}
            startIcon={<RefreshCw size={16} />}
            sx={{ py: 1.5, borderColor: "#e2e8f0", color: "#64748b" }}
          >
            {isProcessing ? "Processing..." : "Retry"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => performAction("restart")}
            disabled={isProcessing}
            startIcon={<Power size={16} />}
            sx={{ py: 1.5, borderColor: "#e2e8f0", color: "#64748b" }}
          >
            {isProcessing ? "Processing..." : "Restart"}
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="subtitle2"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Smartphone size={16} /> Device Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            {isEditing ? (
              <TextField
                label="IP"
                fullWidth
                size="small"
                value={editForm.ip || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, ip: e.target.value })
                }
              />
            ) : (
              <InfoCard icon={Globe} label="IP Address" value={device.ip} />
            )}
          </Grid>
          <Grid size={{ xs: 6 }}>
            {isEditing ? (
              <TextField
                label="MAC"
                fullWidth
                size="small"
                value={editForm.mac || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, mac: e.target.value })
                }
              />
            ) : (
              <InfoCard icon={Shield} label="MAC" value={device.mac} />
            )}
          </Grid>
          <Grid size={{ xs: 6 }}>
            {isEditing ? (
              <TextField
                label="Model"
                fullWidth
                size="small"
                value={editForm.deviceModel || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, deviceModel: e.target.value })
                }
              />
            ) : (
              <InfoCard icon={Cpu} label="Model" value={device.deviceModel} />
            )}
          </Grid>
          <Grid size={{ xs: 6 }}>
            {isEditing ? (
              <TextField
                label="OS"
                fullWidth
                size="small"
                value={editForm.os || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, os: e.target.value })
                }
              />
            ) : (
              <InfoCard icon={Monitor} label="OS" value={device.os} />
            )}
          </Grid>
          <Grid size={{ xs: 6 }}>
            {isEditing ? (
              <TextField
                label="Location"
                fullWidth
                size="small"
                value={editForm.location || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            ) : (
              <InfoCard
                icon={MapPin}
                label="Location"
                value={device.location}
              />
            )}
          </Grid>
          <Grid size={{ xs: 6 }}>
            {isEditing ? (
              <TextField
                label="Dept"
                fullWidth
                size="small"
                value={editForm.department || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, department: e.target.value })
                }
              />
            ) : (
              <InfoCard
                icon={Briefcase}
                label="Department"
                value={device.department}
              />
            )}
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <HealthCenter device={device} />

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="subtitle2"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Activity size={16} /> Health Metrics
        </Typography>
        <Box sx={{ bgcolor: "#f8fafc", borderRadius: 3, p: 3, mb: 3 }}>
          <MetricBar
            label="Battery Level"
            value={device.battery}
            color={device.battery < 20 ? "error" : "success"}
          />
          <MetricBar
            label="Signal Strength"
            value={device.signalStrength}
            color={device.signalStrength < 40 ? "warning" : "success"}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              pt: 2,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                color: "#64748b",
              }}
            >
              <Clock size={16} />{" "}
              <Typography variant="caption">Uptime</Typography>
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {device.uptime} hours
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="subtitle2"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <History size={16} /> Recent Activity
        </Typography>
        <List disablePadding>
          {activityLogs.map((log, i) => (
            <ListItem key={i} sx={{ px: 0, py: 1 }}>
              <ListItemAvatar sx={{ minWidth: 24 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      log.type === "error"
                        ? "#ef4444"
                        : log.type === "success"
                        ? "#10b981"
                        : "#94a3b8",
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" color="#334155">
                    {log.event}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="#94a3b8">
                    {log.time}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
