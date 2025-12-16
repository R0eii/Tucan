import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
  RefreshCw,
  User as UserIcon,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Device } from "../../types";
import ProfileDialog from "../common/ProfileDialog";
import CompanyManagerDialog from "./CompanyManagerDialog";

interface CompanyStats {
  id: number;
  name: string;
  deviceCount: number;
}

interface TopNavbarProps {
  selectedCompany: string;
  setSelectedCompany: (name: string) => void;
  lastUpdate: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  alerts: Device[];
  onNotificationClick: (device: Device) => void; // New Prop
}

export default function TopNavbar({
  selectedCompany,
  setSelectedCompany,
  lastUpdate,
  isRefreshing,
  onRefresh,
  alerts,
  onNotificationClick,
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [companyAnchor, setCompanyAnchor] = useState<null | HTMLElement>(null);
  const [isCompanyManagerOpen, setIsCompanyManagerOpen] = useState(false);

  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/devices/stats/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Failed to load companies", err));
  }, []);

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid #e2e8f0", bgcolor: "white" }}
      >
        <Container maxWidth={false} sx={{ maxWidth: "1600px" }}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", height: 64 }}
          >
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="Tucan"
                  sx={{ width: 40, height: 40 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0f172a" }}
                >
                  Tucan
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  onClick={(e) => setCompanyAnchor(e.currentTarget)}
                  sx={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                    textTransform: "none",
                  }}
                  startIcon={<Building2 size={16} />}
                  endIcon={<ChevronDown size={16} />}
                >
                  {selectedCompany}
                </Button>
                <Menu
                  anchorEl={companyAnchor}
                  open={Boolean(companyAnchor)}
                  onClose={() => setCompanyAnchor(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setSelectedCompany("All Companies");
                      setCompanyAnchor(null);
                    }}
                  >
                    All Companies
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsCompanyManagerOpen(true);
                      setCompanyAnchor(null);
                    }}
                    sx={{ color: "primary.main", fontWeight: 600 }}
                  >
                    Manage Companies...
                  </MenuItem>
                  <Divider />
                  {companies.map((comp) => (
                    <MenuItem
                      key={comp.name}
                      onClick={() => {
                        setSelectedCompany(comp.name);
                        setCompanyAnchor(null);
                      }}
                      sx={{
                        gap: 2,
                        justifyContent: "space-between",
                        minWidth: 200,
                      }}
                    >
                      {comp.name}
                      <Box
                        component="span"
                        sx={{
                          bgcolor: "#f1f5f9",
                          px: 1,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        {comp.deviceCount}
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>

                <CompanyManagerDialog
                  open={isCompanyManagerOpen}
                  onClose={() => setIsCompanyManagerOpen(false)}
                  onChange={onRefresh} // Refresh navbar data when companies change
                />
              </Box>
            </Box>

            {/* Right Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                  py: 0.5,
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", color: "#64748b" }}
                >
                  {lastUpdate.toLocaleTimeString()}
                </Typography>
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw size={16} className={isRefreshing ? "spin" : ""} />
                </IconButton>
              </Box>

              {/* Notifications */}
              <IconButton
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
              >
                <Badge badgeContent={alerts.length} color="error">
                  <Bell size={20} color="#64748b" />
                </Badge>
              </IconButton>

              <Popover
                open={Boolean(notificationAnchor)}
                anchorEl={notificationAnchor}
                onClose={() => setNotificationAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                // ✅ FIX: Use 'elevation={0}' to remove default MUI shadow which might look like a double border
                // ✅ FIX: Custom styled Paper with clean border color
                elevation={0}
                PaperProps={{
                  sx: {
                    width: 360,
                    maxHeight: 480,
                    mt: 1.5,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)", // Smooth shadow
                    border: "1px solid #f1f5f9", // Very subtle border
                    overflow: "hidden",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#334155"
                  >
                    Notifications
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      bgcolor: "#fee2e2",
                      color: "#ef4444",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: "0.7rem",
                      fontWeight: 800,
                    }}
                  >
                    {alerts.length} ACTIVE
                  </Box>
                </Box>
                {alerts.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center", color: "#94a3b8" }}>
                    <CheckCircle
                      size={32}
                      style={{ marginBottom: 8, opacity: 0.5 }}
                    />
                    <Typography variant="body2">
                      All systems operational
                    </Typography>
                  </Box>
                ) : (
                  <List
                    disablePadding
                    sx={{ overflowY: "auto", maxHeight: 400 }}
                  >
                    {alerts.map((device) => (
                      <ListItem
                        key={device.id}
                        component="button"
                        onClick={() => {
                          onNotificationClick(device);
                          setNotificationAnchor(null);
                        }}
                        sx={{
                          borderBottom: "1px solid #f8fafc", // Ultra subtle separator
                          py: 2,
                          transition: "all 0.2s",
                          "&:hover": { bgcolor: "#f8fafc" },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              bgcolor:
                                device.status === "error"
                                  ? "#fef2f2"
                                  : "#fffbeb",
                              color:
                                device.status === "error"
                                  ? "#ef4444"
                                  : "#f59e0b",
                            }}
                          >
                            {device.status === "error" ? (
                              <WifiOff size={16} />
                            ) : (
                              <AlertTriangle size={16} />
                            )}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="#334155"
                            >
                              {device.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="#64748b"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {device.errorMessage || "Unknown Warning"}
                            </Typography>
                          }
                        />
                        <ChevronRight size={14} color="#cbd5e1" />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Popover>

              {/* User Menu */}
              <Button
                onClick={(e) => setUserAnchor(e.currentTarget)}
                sx={{ textTransform: "none", color: "#334155" }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#7c3aed",
                    mr: 1,
                    fontSize: 14,
                  }}
                >
                  {user?.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    textAlign: "left",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#94a3b8", display: "block" }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
                <ChevronDown
                  size={16}
                  style={{ marginLeft: 8, opacity: 0.5 }}
                />
              </Button>

              <Menu
                anchorEl={userAnchor}
                open={Boolean(userAnchor)}
                onClose={() => setUserAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    setUserAnchor(null);
                    setIsProfileOpen(true);
                  }}
                >
                  <UserIcon size={16} style={{ marginRight: 8 }} /> My Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout} sx={{ color: "#dc2626" }}>
                  <LogOut size={16} style={{ marginRight: 8 }} /> Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <ProfileDialog
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
