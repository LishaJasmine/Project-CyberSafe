import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import incidentRoutes from "./routes/incidentRoutes.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "CyberSafe API" }));
app.use("/api/incidents", incidentRoutes);
app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cybersafe");
  console.log("MongoDB connected successfully");
  app.listen(port, () => console.log(`CyberSafe backend running at http://localhost:${port}`));
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
