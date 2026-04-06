# Step 02 – Backend API with Express + TypeScript + SQLite

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

| Layer | File | Responsibility |
|-------|------|----------------|
| **Types** | `types.ts` | Defines the shape of data — the single source of truth |
| **Database** | `db/database.ts` | Opens SQLite and creates tables |
| **Routes** | `routes/ideas.ts` | Handles HTTP requests and calls the database |
| **App** | `app.ts` | Starts Express, registers middleware and routes |

This pattern is called **Separation of Concerns** — each file has exactly ONE job.

---

## 🚀 Running the Backend

```bash
cd backend

# Development mode (auto-restarts on file changes):
npm run dev

# Production (compile first, then run):
npm run build
npm start
```

You should see:
```
✅ Backend running on http://localhost:3001
   Health:  GET http://localhost:3001/health
   Ideas:   GET http://localhost:3001/api/ideas
```

---

## 🧪 Testing the API Manually

Once the backend is running, open a **new terminal** and try these commands:

```bash
# Check the server is alive
curl http://localhost:3001/health

# Get all ideas (empty array at first)
curl http://localhost:3001/api/ideas

# Create a new idea
curl -X POST http://localhost:3001/api/ideas \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express", "description": "Build a REST API", "category": "backend"}'

# Get all ideas (should now show your idea)
curl http://localhost:3001/api/ideas

# Update idea #1
curl -X PUT http://localhost:3001/api/ideas/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express with TypeScript"}'

# Delete idea #1
curl -X DELETE http://localhost:3001/api/ideas/1
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

| Code | Meaning | When to use |
|------|---------|-------------|
| 200 | OK | Successful GET or PUT |
| 201 | Created | Successful POST (resource was created) |
| 204 | No Content | Successful DELETE (nothing to return) |
| 400 | Bad Request | Invalid input from client |
| 404 | Not Found | The requested resource doesn't exist |
| 500 | Server Error | Something unexpected crashed on the server |

---

## 🔍 Exploring the Code

Open `backend/src/routes/ideas.ts` and notice:

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

1. **Add a new field**: Add a `priority` field (low/medium/high) to the `ideas` table
   - Update `types.ts` (add `priority` to the `Idea` interface)
   - Update `db/database.ts` (add the column to `CREATE TABLE`)
   - Update `routes/ideas.ts` (add `priority` to the Zod schemas and SQL queries)

2. **Add sorting**: Modify `GET /api/ideas` to accept a `?sort=title` query parameter

3. **Break it intentionally**: Remove the Zod validation — what happens when you send `{}`?

---

➡️ **Next Step:** [Step 03 – Frontend UI](./STEP_03_FRONTEND_UI.md)
