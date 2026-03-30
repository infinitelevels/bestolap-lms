import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import enrollmentRoutes from "./routes/enrollment.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import logger from "./config/logger.js";

const app = express();

/* ===============================
   CONNECT DATABASE
================================= */
connectDB();

/* ===============================
   SECURITY MIDDLEWARE
================================= */

app.use(helmet());
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again later."
});

app.use("/api", limiter);

/* ===============================
   PAYSTACK WEBHOOK
================================= */
app.use(
  "/api/webhook",
  express.raw({ type: "application/json" })
);

/* ===============================
   GLOBAL MIDDLEWARE
================================= */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* ===============================
   ROUTES
================================= */
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/location", locationRoutes);

/* ===============================
   ERROR HANDLER
================================= */
app.use(errorMiddleware);

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Secure server running on port ${PORT}`);
});

/* ===============================
   GRACEFUL SHUTDOWN
================================= */

const shutdown = async (error, type) => {
  logger.error(`❌ ${type}: ${error.message}`);

  server.close(async () => {
    await mongoose.connection.close();
    process.exit(1);
  });
};

process.on("uncaughtException", (err) => shutdown(err, "Uncaught Exception"));
process.on("unhandledRejection", (err) => shutdown(err, "Unhandled Rejection"));