import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://task-management-application-fronten.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI in environment. Exiting.");
  process.exit(1);
}

mongoose.connection.on("connecting", () => console.log("MongoDB: connecting..."));
mongoose.connection.on("connected", () => console.log("MongoDB: connected ✅"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error ❌", err));
mongoose.connection.on("disconnected", () => console.warn("MongoDB: disconnected"));

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000
  })
  .catch((err) => {
    console.error("Initial MongoDB connect failed ❌", err);
  });

app.get("/", (_req, res) => res.send("Backend is running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Basic error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));