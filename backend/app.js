import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./src/db/index.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import alertRoutes from "./src/modules/price_alerts/price_alerts.routes.js"
import productRoutes from "./src/modules/product/product.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint (Express + PostgreSQL + pgvector)
app.get("/api/health", async (req, res) => {
  try {
    const dbResult = await pool.query("SELECT NOW(), extname FROM pg_extension WHERE extname = 'vector'");
    const hasPgVector = dbResult.rows.some((row) => row.extname === "vector");

    res.json({status: "ok", service: "price-tracker-api", database: "connected", 
              db_timestamp: dbResult.rows[0]?.now, pgvector: hasPgVector ? "installed" : "not_installed",});

  } catch (error) {
    res.status(500).json({ status: "error", service: "price-tracker-api", database: "error", message: error.message });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/product", productRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Price Tracker API running on port ${PORT}`);
});