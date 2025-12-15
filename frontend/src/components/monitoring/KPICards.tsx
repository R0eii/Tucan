import { Box, Card, Grid, LinearProgress, Typography } from "@mui/material";
import { motion, type Variants } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { DashboardStats } from "../../types";

interface KPICardsProps {
  stats: DashboardStats;
}

const cardVariants: Variants | undefined = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function KPICards({ stats }: KPICardsProps) {
  const onlinePercentage = Math.round((stats.online / stats.total) * 100);
  const offlinePercentage = Math.round((stats.offline / stats.total) * 100);

  const cards = [
    {
      title: "Total Devices",
      value: stats.total,
      icon: Smartphone,
      iconBg: "#f8fafc",
      iconColor: "#475569",
      trend: null,
    },
    {
      title: "Online",
      value: stats.online,
      icon: CheckCircle2,
      iconBg: "#ecfdf5",
      iconColor: "#059669",
      trend: { value: onlinePercentage, isUp: true },
      percentage: `${onlinePercentage}%`,
    },
    {
      title: "Offline",
      value: stats.offline,
      icon: XCircle,
      iconBg: "#fef2f2",
      iconColor: "#dc2626",
      trend: { value: offlinePercentage, isUp: false },
      percentage: `${offlinePercentage}%`,
    },
    {
      title: "Warnings",
      value: stats.warning,
      icon: AlertTriangle,
      iconBg: "#fffbeb",
      iconColor: "#d97706",
      trend: null,
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 3,
                      bgcolor: card.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <card.icon size={20} color={card.iconColor} />
                  </Box>
                  {card.percentage && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: card.iconColor }}
                    >
                      {card.percentage}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                    <motion.div
                      key={card.value}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: "#0f172a" }}
                      >
                        {card.value.toLocaleString()}
                      </Typography>
                    </motion.div>

                    {card.trend && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: card.trend.isUp ? "#059669" : "#dc2626",
                        }}
                      >
                        {card.trend.isUp ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>

                {card.title === "Online" && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={onlinePercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": { bgcolor: "#10b981" },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "#94a3b8", mt: 1, display: "block" }}
                    >
                      {onlinePercentage}% of devices operational
                    </Typography>
                  </Box>
                )}
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
