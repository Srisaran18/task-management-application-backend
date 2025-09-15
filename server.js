import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000", "task-management-application-fronten.vercel.app"], credentials: false }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));

app.get("/", (_req, res) => res.send("Backend is running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Basic error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));