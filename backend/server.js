require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const responseRoutes = require("./src/routes/responseRoutes");
const voterRoutes = require("./src/routes/voterRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(
  morgan("dev", {
    skip: (req, res) => req.method === "GET" && req.originalUrl === "/api/responses",
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/responses", responseRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/admin", adminRoutes);

// Fallback Route
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
