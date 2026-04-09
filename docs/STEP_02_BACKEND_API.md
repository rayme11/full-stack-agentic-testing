# Step 02 – Backend API with Express + TypeScript + SQLite

> **⚠️ Stub Status — Read This First**
>
> All four backend files start as **empty stubs with TODO comments**. Nothing works except the `/health` endpoint (which was pre-built in Step 1). If you try to call `/api/ideas` before completing this step, you will get `Cannot POST /api/ideas` — that is expected. Work through the tasks below **in order** and the API will come alive as you go.
>
> **Files you will implement in this step:**
>
> - `backend/src/types.ts` — currently just `// TODO` comments
> - `backend/src/db/database.ts` — database opens, but the table is NOT created yet
> - `backend/src/routes/ideas.ts` — router exists, all 5 endpoints are empty
> - `backend/src/app.ts` — the router is NOT mounted yet (that's the last task)

---

## 🎯 What You Will Learn

- What a **REST API** is and how HTTP verbs map to CRUD operations
- How to build an Express server in TypeScript
- What **SQLite** is and why it's perfect for learning
- How to validate user input with **Zod**
- Why we structure code into layers (routes, db, types)

---

## 📚 Concept: What is a REST API?

REST stands for **RE**presentational **S**tate **T**ransfer. It's a convention for how web apps communicate over HTTP.

```
HTTP Verb + URL Path          → What it does
─────────────────────────────────────────────────
GET    /api/ideas             → Retrieve ALL ideas
GET    /api/ideas/42          → Retrieve idea with ID 42
POST   /api/ideas             → Create a NEW idea
PUT    /api/ideas/42          → Update idea with ID 42
DELETE /api/ideas/42          → Delete idea with ID 42
```

Think of it like a restaurant:

- **GET** = "Show me the menu" / "Bring me dish #42"
- **POST** = "I'd like to order..."
- **PUT** = "Change my order to..."
- **DELETE** = "Cancel my order"

---

## 📚 Concept: Why SQLite?

SQLite is a **file-based database** — the entire database is stored in a single `.db` file. No server to install, no configuration needed.

```
PostgreSQL / MySQL:      SQLite:
─────────────────        ──────────────────────
Needs a server           Just a file: data/ideas.db
Complex configuration    Works immediately
Great for production     Perfect for learning & development
```

For production apps, you'd use PostgreSQL or MySQL. But for learning, SQLite lets you focus on the CODE, not the database configuration.

---

## 📁 Backend File Structure

```
backend/
├── src/
│   ├── app.ts           ← Entry point: wires Express + middleware + routes
│   ├── types.ts         ← TypeScript interfaces (Idea, CreateIdeaInput, etc.)
│   ├── db/
│   │   └── database.ts  ← Opens SQLite, creates tables, exports `db`
│   └── routes/
│       └── ideas.ts     ← All /api/ideas route handlers
├── package.json
├── tsconfig.json
└── data/                ← Created automatically; holds ideas.db (gitignored)
```

**Why these layers?**

| Layer        | File              | Responsibility                                         |
| ------------ | ----------------- | ------------------------------------------------------ |
| **Types**    | `types.ts`        | Defines the shape of data — the single source of truth |
| **Database** | `db/database.ts`  | Opens SQLite and creates tables                        |
| **Routes**   | `routes/ideas.ts` | Handles HTTP requests and calls the database           |
| **App**      | `app.ts`          | Starts Express, registers middleware and routes        |

This pattern is called **Separation of Concerns** — each file has exactly ONE job.

---

## 🚀 Running the Backend

```bash
cd backend
npm run dev
```

You should see:

```
✅ Server running on http://localhost:3001
   Try: curl http://localhost:3001/health
```

> **Note:** Until you complete all 4 tasks below, only `/health` will respond. All `/api/ideas` requests will return `Cannot POST /api/ideas` — that is expected at this stage.

---

## 🛠 Step-by-Step Implementation Tasks

> Work through these **in order**. Each task builds on the previous one.
> After each task, save your file — `ts-node-dev` will restart the server automatically.

---

### ✅ Task 1 — Define TypeScript Types (`backend/src/types.ts`)

**Why first?** Every other file imports from `types.ts`. If types don't exist, TypeScript can't check anything else.

Open `backend/src/types.ts` and replace the TODO comments with these interfaces:

```typescript
// The shape of a row in the ideas database table
export interface Idea {
  readonly id: number; // Set by the database — never by us
  title: string;
  description: string;
  category: string;
  readonly created_at: string; // Set by SQLite DEFAULT — never by us
  updated_at: string;
}

// What the POST /api/ideas endpoint accepts from the client
export interface CreateIdeaInput {
  title: string; // Required
  description?: string; // Optional — defaults to ''
  category?: string; // Optional — defaults to 'general'
}

// What the PUT /api/ideas/:id endpoint accepts — all fields optional
export interface UpdateIdeaInput {
  title?: string;
  description?: string;
  category?: string;
}

// The shape of every successful JSON response: { data: T }
export interface ApiSuccess<T> {
  data: T;
}

// The shape of every error JSON response: { error: "some message" }
export interface ApiError {
  error: string;
}
```

Also **remove** the `export {};` line at the bottom — it was only there to stop TypeScript from complaining about an empty file.

**Verify this task:** Save the file. No red underlines should appear in VS Code.

---

### ✅ Task 2 — Create the Database Table (`backend/src/db/database.ts`)

**Why second?** The routes will `import db` from this file. The table must exist before any route can run a query.

Open `backend/src/db/database.ts`. The file already opens a SQLite connection. You only need to add three `db.exec()` calls where the TODO comments are:

```typescript
// ── 3. Configure pragmas ──────────────────────────────────────────────────────
db.exec("PRAGMA journal_mode = WAL"); // Better write performance
db.exec("PRAGMA foreign_keys = ON"); // Enforce referential integrity

// ── 4. Create the ideas table ─────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    category    TEXT    NOT NULL DEFAULT 'general',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);
```

**Verify this task:** Save the file. The backend should restart cleanly — no errors in the terminal.
A file `backend/data/ideas.db` will be created automatically.

---

### ✅ Task 3 — Implement the 5 API Endpoints (`backend/src/routes/ideas.ts`)

**Why third?** The routes can now import `db` (Task 2) and the `Idea` type (Task 1).

Open `backend/src/routes/ideas.ts` and replace the entire file content with:

```typescript
import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../db/database";
import type { Idea, ApiSuccess, ApiError } from "../types";

const router = Router();

// ── Zod validation schemas ─────────────────────────────────────────────────
// These describe the shape we EXPECT from the client.
// If the client sends something wrong, Zod catches it before the DB is touched.
const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000).optional().default(""),
  category: z.string().max(50).optional().default("general"),
});

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
});

// ── GET /api/ideas ────────────────────────────────────────────────────────────
router.get("/", (_req: Request, res: Response<ApiSuccess<Idea[]>>): void => {
  const ideas = db
    .prepare("SELECT * FROM ideas ORDER BY created_at DESC")
    .all() as unknown as Idea[];
  res.json({ data: ideas });
});

// ── GET /api/ideas/:id ────────────────────────────────────────────────────────
router.get(
  "/:id",
  (req: Request, res: Response<ApiSuccess<Idea> | ApiError>): void => {
    const id = parseInt(req.params.id, 10);
    const idea = db
      .prepare("SELECT * FROM ideas WHERE id = ?")
      .get(id) as unknown as Idea | undefined;

    if (!idea) {
      res.status(404).json({ error: "Idea not found" });
      return;
    }
    res.json({ data: idea });
  },
);

// ── POST /api/ideas ───────────────────────────────────────────────────────────
router.post(
  "/",
  (req: Request, res: Response<ApiSuccess<Idea> | ApiError>): void => {
    const result = createSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }

    const { title, description, category } = result.data;
    const stmt = db.prepare(
      "INSERT INTO ideas (title, description, category) VALUES (?, ?, ?)",
    );
    const info = stmt.run(title, description, category) as unknown as {
      lastInsertRowid: number;
    };

    const created = db
      .prepare("SELECT * FROM ideas WHERE id = ?")
      .get(info.lastInsertRowid) as unknown as Idea;

    res.status(201).json({ data: created });
  },
);

// ── PUT /api/ideas/:id ────────────────────────────────────────────────────────
router.put(
  "/:id",
  (req: Request, res: Response<ApiSuccess<Idea> | ApiError>): void => {
    const id = parseInt(req.params.id, 10);
    const existing = db
      .prepare("SELECT * FROM ideas WHERE id = ?")
      .get(id) as unknown as Idea | undefined;

    if (!existing) {
      res.status(404).json({ error: "Idea not found" });
      return;
    }

    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }

    const updated = { ...existing, ...result.data };
    db.prepare(
      "UPDATE ideas SET title = ?, description = ?, category = ?, updated_at = datetime('now') WHERE id = ?",
    ).run(updated.title, updated.description, updated.category, id);

    const saved = db
      .prepare("SELECT * FROM ideas WHERE id = ?")
      .get(id) as unknown as Idea;

    res.json({ data: saved });
  },
);

// ── DELETE /api/ideas/:id ─────────────────────────────────────────────────────
router.delete("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare("SELECT id FROM ideas WHERE id = ?").get(id);

  if (!existing) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  db.prepare("DELETE FROM ideas WHERE id = ?").run(id);
  res.status(204).send();
});

export default router;
```

**Verify this task:** Save the file. The server restarts — no TypeScript errors in the terminal.

---

### ✅ Task 4 — Mount the Router in Express (`backend/src/app.ts`)

**Why last?** Express doesn't know the router exists until you register it. This is the final wire-up.

Open `backend/src/app.ts`. Add two lines — one import and one `app.use` call:

After the existing imports, add:

```typescript
import ideasRouter from "./routes/ideas";
```

After the health check route (`app.get("/health", ...)`), add:

```typescript
// Mount the ideas router — all its routes are prefixed with /api/ideas
app.use("/api/ideas", ideasRouter);
```

**Verify this task:** Save the file. The server restarts. Now run:

```bash
curl http://localhost:3001/api/ideas
# Expected: {"data":[]}
```

If you see `{"data":[]}` — the entire backend is working! 🎉

---

## 🧪 Testing the API Manually (After All 4 Tasks)

> Open a **new terminal** while `npm run dev` is still running in the other one.

```bash
# Create a new idea
curl -X POST http://localhost:3001/api/ideas \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express", "description": "Build a REST API", "category": "backend"}'
# Expected: {"data":{"id":1,"title":"Learn Express",...}}

# Get all ideas
curl http://localhost:3001/api/ideas
# Expected: {"data":[{"id":1,...}]}

# Update idea #1
curl -X PUT http://localhost:3001/api/ideas/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express with TypeScript"}'

# Delete idea #1
curl -X DELETE http://localhost:3001/api/ideas/1
# Expected: empty response, HTTP 204
```

---

## 📚 Concept: Input Validation with Zod

**Never trust user input!** If someone sends `{"title": 12345}` (a number instead of a string), your app should reject it gracefully — not crash or store corrupt data.

**Zod** is a TypeScript-first validation library:

```typescript
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  category: z.string().max(50).default("general"),
});

// At runtime:
const result = createSchema.safeParse(req.body);
if (!result.success) {
  // Zod tells you EXACTLY what was wrong:
  // "Title is required" / "Title too long" / etc.
  res.status(400).json({ error: result.error.errors[0].message });
  return;
}

// If we reach here, TypeScript KNOWS result.data has the right shape:
const { title, category } = result.data; // ✅ Fully typed!
```

---

## 📚 Concept: HTTP Status Codes

Status codes tell the client what happened:

| Code | Meaning      | When to use                                |
| ---- | ------------ | ------------------------------------------ |
| 200  | OK           | Successful GET or PUT                      |
| 201  | Created      | Successful POST (resource was created)     |
| 204  | No Content   | Successful DELETE (nothing to return)      |
| 400  | Bad Request  | Invalid input from client                  |
| 404  | Not Found    | The requested resource doesn't exist       |
| 500  | Server Error | Something unexpected crashed on the server |

---

## 🔍 Understanding the Code You Just Wrote

Now that you've implemented the routes, look back at `backend/src/routes/ideas.ts` and notice:

1. **Every function has a return type** — TypeScript forces you to be explicit
2. **All inputs are validated with Zod** before touching the database
3. **`db.prepare().run()`** uses parameterized queries — this prevents SQL injection attacks!

### ⚠️ SQL Injection — A Real Security Threat

```typescript
// ❌ DANGEROUS — never do this:
db.exec(`SELECT * FROM ideas WHERE id = ${req.params.id}`);
// If someone sends id = "1; DROP TABLE ideas; --"... the table is gone!

// ✅ SAFE — parameterized query:
db.prepare("SELECT * FROM ideas WHERE id = ?").get(id);
// The ? is a placeholder; SQLite handles it safely
```

---

## 📝 Try This Yourself

1. **Trigger a validation error:** Send a POST with no title and confirm you get HTTP 400:

   ```bash
   curl -X POST http://localhost:3001/api/ideas \
     -H "Content-Type: application/json" \
     -d '{"description": "Forgot the title"}'
   # Expected: {"error":"Title is required"}
   ```

2. **Test a 404:** Request an idea that doesn't exist:

   ```bash
   curl http://localhost:3001/api/ideas/9999
   # Expected: {"error":"Idea not found"}
   ```

3. **Break it intentionally:** Remove the Zod `.min(1)` from the `title` field in `createSchema` — what happens when you send `{"title": ""}`? Then put it back.

4. **Add a new field (stretch goal):** Add a `priority` field (`low`/`medium`/`high`) to the table:
   - Update `types.ts` (`priority: string`)
   - Update `db/database.ts` (`priority TEXT NOT NULL DEFAULT 'low'`)
   - Update `routes/ideas.ts` (add `priority` to both Zod schemas and SQL queries)

---

➡️ **Next Step:** [Step 03 – Frontend UI](./STEP_03_FRONTEND_UI.md)
