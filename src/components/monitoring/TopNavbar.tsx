import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  RefreshCw,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { companies } from "./mockData";

interface TopNavbarProps {
  selectedCompany: string;
  setSelectedCompany: (name: string) => void;
  lastUpdate: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function TopNavbar({
  selectedCompany,
  setSelectedCompany,
  lastUpdate,
  isRefreshing,
  onRefresh,
}: TopNavbarProps) {
  const [notifications] = useState(3);

  // Menu States
  const [companyAnchor, setCompanyAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
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
          {/* Logo & Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Logo Container */}
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="Tucan Logo"
                  sx={{
                    width: 44,
                    height: 44,
                    // Added a slight transition for a premium feel
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.08) rotate(-2deg)",
                    },
                  }}
                />

                {/* Live Status Indicator (The green dot) */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 12,
                    height: 12,
                    bgcolor: "#10b981", // Emerald 500
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                    // Simple pulse animation to show it's "Live"
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)" },
                      "70%": { boxShadow: "0 0 0 6px rgba(16, 185, 129, 0)" },
                      "100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
                    },
                  }}
                />
              </Box>

              {/* Brand Text */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#0f172a", // Slate 900
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Tucan
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b", // Slate 500
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: "0.65rem",
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  Monitoring Suite
                </Typography>
              </Box>
            </Box>

            {/* Company Selector */}
            <Box>
              <Button
                variant="outlined"
                onClick={(e) => setCompanyAnchor(e.currentTarget)}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#334155",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
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
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    color: "#94a3b8",
                    fontWeight: 600,
                    display: "block",
                  }}
                >
                  SELECT COMPANY
                </Typography>
                <Divider />
                {companies.map((company) => (
                  <MenuItem
                    key={company.id}
                    onClick={() => {
                      setSelectedCompany(company.name);
                      setCompanyAnchor(null);
                    }}
                    sx={{
                      gap: 2,
                      minWidth: 200,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      fontWeight={company.name === selectedCompany ? 600 : 400}
                    >
                      {company.name}
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "#f1f5f9",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {company.deviceCount} devices
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
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
                border: "1px solid #f1f5f9",
              }}
            >
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", display: "block", lineHeight: 1 }}
                >
                  LAST UPDATE
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 500,
                    color: "#334155",
                  }}
                >
                  {formatTime(lastUpdate)}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{
                    duration: 1,
                    repeat: isRefreshing ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <RefreshCw
                    size={16}
                    color={isRefreshing ? "#f59e0b" : "#64748b"}
                  />
                </motion.div>
              </IconButton>
            </Box>

            <IconButton>
              <Badge
                badgeContent={notifications}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 10,
                    height: 16,
                    minWidth: 16,
                  },
                }}
              >
                <Bell size={20} color="#64748b" />
              </Badge>
            </IconButton>

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
                IR
              </Avatar>
              <Box
                sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Itamar Raveh
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", display: "block", lineHeight: 1 }}
                >
                  Administrator
                </Typography>
              </Box>
              <ChevronDown size={16} style={{ marginLeft: 8, opacity: 0.5 }} />
            </Button>

            <Menu
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={() => setUserAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => setUserAnchor(null)}>
                <User size={16} style={{ marginRight: 8 }} /> Profile
              </MenuItem>
              <MenuItem onClick={() => setUserAnchor(null)}>
                <Settings size={16} style={{ marginRight: 8 }} /> Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => setUserAnchor(null)}
                sx={{ color: "#dc2626" }}
              >
                <LogOut size={16} style={{ marginRight: 8 }} /> Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
