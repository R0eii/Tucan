import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import deviceRoutes from "./routes/deviceRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/devices", deviceRoutes);

app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Tucan API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
