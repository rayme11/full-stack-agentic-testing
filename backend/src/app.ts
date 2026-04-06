/**
 * Express application entry point
 * ================================
 * WHY: This file is the "entry point" – it wires everything together.
 * Express is a minimal Node.js web framework. We use it to handle HTTP
 * requests, parse JSON bodies, enable CORS, and mount our routes.
 *
 * CONCEPT: When you type a URL in a browser or call fetch(), the HTTP
 * request travels across the network and arrives here. Express matches
 * the URL path to the right route handler and sends back a response.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ideasRouter from "./routes/ideas";

// Load environment variables from .env file (if it exists)
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

// ── Middleware ────────────────────────────────────────────────────────────────
// WHY: Middleware functions run for every request before your route handlers.
// They are a great place to parse request bodies, add security headers, etc.

// Enable CORS so the frontend (on a different port) can talk to this API.
// WHY CORS: Browsers block cross-origin requests by default (security feature).
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Parse incoming JSON request bodies.
// Without this, req.body would be undefined.
app.use(express.json());

// ── Health check route ────────────────────────────────────────────────────────
// WHY: A health check endpoint lets load balancers, CI pipelines, and
// monitoring tools verify that the server is alive and responding.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Mount routes ──────────────────────────────────────────────────────────────
// All routes defined in ideasRouter are prefixed with /api/ideas
app.use("/api/ideas", ideasRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Start listening ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`   Health:  GET http://localhost:${PORT}/health`);
  console.log(`   Ideas:   GET http://localhost:${PORT}/api/ideas`);
});

export default app;
