import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const gradient =
    localStorage.getItem("auth-gradient") ||
    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Left Side - Hero Section */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            bgcolor: "#0f172a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 8,
            color: "white",
          }}
        >
          {/* Abstract Background Shapes */}
          <Box
            component={motion.div}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              top: "-20%",
              left: "-20%",
              width: "80%",
              height: "80%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                gradient.includes("indigo")
                  ? "rgba(99,102,241,0.4)"
                  : "rgba(255,255,255,0.1)"
              } 0%, rgba(15,23,42,0) 70%)`,
              filter: "blur(60px)",
            }}
          />
          <Box
            component={motion.div}
            animate={{
              scale: [1, 1.5, 1],
              x: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            sx={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(15,23,42,0) 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Content */}
          <Box sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="Logo"
              sx={{ width: 80, height: 80, mb: 4 }}
            />
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Welcome to Tucan
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#94a3b8", maxWidth: 400, mx: "auto" }}
            >
              The complete monitoring solution for your enterprise devices.
              Real-time insights, zero latency.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Right Side - Form Section */}
      <Box
        sx={{
          flex: isMobile ? 1 : "0 0 550px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 3, sm: 6, md: 8 },
          bgcolor: "white",
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              color="#0f172a"
              gutterBottom
            >
              {title}
            </Typography>
            <Typography variant="body1" color="#64748b">
              {subtitle}
            </Typography>
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
