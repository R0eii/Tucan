import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { Filter, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import React from "react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  totalFiltered: number;
  totalDevices: number;
  onAddDevice: () => void;
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  totalFiltered,
  totalDevices,
  onAddDevice,
}: FilterBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const statusOptions = [
    { value: "all", label: "All Status", color: "#64748b" },
    { value: "online", label: "Online", color: "#10b981" },
    { value: "offline", label: "Offline", color: "#ef4444" },
    { value: "warning", label: "Warning", color: "#f59e0b" },
  ];

  const currentStatus = statusOptions.find((s) => s.value === statusFilter);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Search Input */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 450,
            display: "flex",
            alignItems: "center",
            bgcolor: "#f8fafc",
            borderRadius: 2,
            px: 2,
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease-in-out",
            "&:focus-within": {
              bgcolor: "white",
              borderColor: "#6366f1",
              boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
            },
          }}
        >
          <Search size={18} color="#94a3b8" />
          <InputBase
            placeholder="Search name, ID or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ ml: 1.5, flex: 1, py: 1, fontSize: "0.9rem" }}
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery("")}>
              <X size={14} color="#94a3b8" />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{ display: "flex", gap: 1.5, width: { xs: "100%", md: "auto" } }}
        >
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={onAddDevice}
            sx={{
              fontWeight: 600,
              px: 2,
              bgcolor: "#0f172a", // or use 'primary.main'
              whiteSpace: "nowrap",
            }}
          >
            Add Device
          </Button>
          {/* Status Dropdown */}
          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            startIcon={<Filter size={16} />}
            sx={{
              borderColor: "#e2e8f0",
              color: "#475569",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              "&:hover": { bgcolor: "#f1f5f9", borderColor: "#cbd5e1" },
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: currentStatus?.color,
                mr: 1.5,
              }}
            />
            {currentStatus?.label}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
              },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => {
                  setStatusFilter(option.value);
                  setAnchorEl(null);
                }}
                sx={{ gap: 1.5, minWidth: 160, py: 1.2 }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: option.color,
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={option.value === statusFilter ? 700 : 400}
                >
                  {option.label}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          <Button
            variant="outlined"
            startIcon={<SlidersHorizontal size={16} />}
            sx={{
              borderColor: "#e2e8f0",
              color: "#475569",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            Filters
          </Button>

          {/* Result Counter Badge */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              px: 2,
              bgcolor: "#f1f5f9",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: "#475569" }}
            >
              {totalFiltered.toLocaleString()}{" "}
              <Box component="span" sx={{ color: "#94a3b8", fontWeight: 400 }}>
                /
              </Box>{" "}
              {totalDevices.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Active Filter Chips */}
      {(searchQuery || statusFilter !== "all") && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              fontWeight: 700,
              textTransform: "uppercase",
              mr: 1,
            }}
          >
            Active:
          </Typography>
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              onDelete={() => setSearchQuery("")}
              size="small"
              sx={{ bgcolor: "#f1f5f9", fontWeight: 600, borderRadius: 1.5 }}
            />
          )}
          {statusFilter !== "all" && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => setStatusFilter("all")}
              size="small"
              sx={{ bgcolor: "#f1f5f9", fontWeight: 600, borderRadius: 1.5 }}
            />
          )}
        </Box>
      )}
    </Paper>
  );
}
