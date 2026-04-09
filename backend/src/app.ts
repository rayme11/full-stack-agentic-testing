/**
 * Step 1 – Minimal Express Server
 * ================================
 * This is your starting point. One file, one endpoint.
 *
 * WHY: Every backend starts here — a server that can receive HTTP requests.
 * We add the database and routes in Step 2 (docs/STEP_02_BACKEND_API.md).
 *
 * CONCEPTS TO UNDERSTAND BEFORE MOVING ON:
 *  - What is Express?  → A minimal web framework for Node.js
 *  - What is middleware?  → Functions that run on every request (cors, json parsing)
 *  - What is a health check?  → An endpoint that confirms the server is alive
 *
 * TODO (Step 2): After reading docs/STEP_02_BACKEND_API.md, you will:
 *   1. Create src/types.ts        — define the Idea TypeScript interface
 *   2. Create src/db/database.ts  — open SQLite and create the ideas table
 *   3. Create src/routes/ideas.ts — implement the 5 REST endpoints
 *   4. Add: import ideasRouter from "./routes/ideas";
 *   5. Add: app.use("/api/ideas", ideasRouter);
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ideasRouter from "./routes/ideas";

// Load environment variables from the .env file
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

// ── Middleware ────────────────────────────────────────────────────────────────
// WHY CORS: Browsers block requests from a different "origin" (port) by default.
// This lets our frontend on port 5173 talk to this API on port 3001.
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));

// WHY JSON: Without this, req.body would be undefined for POST/PUT requests.
app.use(express.json());

// ── Health Check ─────────────────────────────────────────────────────────────
// The FIRST endpoint in any API. Used by CI/CD and monitoring tools.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Ideas Router ──────────────────────────────────────────────────────────────
// All requests to /api/ideas (and /api/ideas/:id) are handled by ideasRouter.
// app.use() "mounts" a router at a prefix — the router itself then only sees
// the path AFTER the prefix (so "/" inside the router = "/api/ideas" here).
app.use("/api/ideas", ideasRouter);

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Try: curl http://localhost:${PORT}/health`);
});

export default app;
