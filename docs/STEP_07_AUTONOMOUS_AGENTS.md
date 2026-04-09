# Step 07 – Autonomous Multi-Agent Development

## 🎯 What You Will Learn

- What **agentic AI** means and how it differs from single-model AI assistance
- How **multi-agent systems** use a coordinator to orchestrate specialized agents
- How to use **AutoGen** (Microsoft) to build a Python-based agent pipeline
- How agents can autonomously **scaffold a full-stack app** — backend, frontend, and tests — from a single plain-English prompt
- How agents **validate each other's work** using real compiler and test output

---

## 📚 Concept: From Copilot to Agents

By now you have used GitHub Copilot throughout this project — it suggests code inline and answers questions. That is **assisted AI**: a human directs every step and the AI responds to requests.

**Agentic AI** flips this model. You give the system a _goal_, and the agents figure out the plan, delegate the work, validate the results, and correct themselves when something fails. You observe instead of directing.

```
Assisted AI (Copilot):             Agentic AI (AutoGen):
  You → ask → AI → answer            You → give goal → Coordinator
  You → ask → AI → answer                              ↓
  You → ask → AI → answer            Coordinator → delegates → Agent A
  You integrate everything                            ↓
                                     Agent A → output → Agent B
                                                       ↓
                                     Agent B → output → Coordinator
                                                       ↓
                                     Coordinator → validates → done (or retry)
```

---

## 📚 Concept: What Is AutoGen?

**[AutoGen](https://github.com/microsoft/autogen)** is an open-source Python framework from Microsoft Research for building multi-agent AI applications.

Its core building blocks:

### `AssistantAgent`

An AI agent with a **system prompt** that defines its role. It receives messages and responds using an LLM (GPT-4o, Claude, Gemini, etc.).

```python
api_agent = AssistantAgent(
    name="api_agent",
    system_message="""You are a backend engineer specializing in Node.js,
    Express, TypeScript, and SQLite. When asked to build an API, you output
    complete file contents — one file at a time — starting with types.ts,
    then database.ts, then routes/*.ts, then app.ts.""",
    llm_config=llm_config,
)
```

### `UserProxyAgent`

A special agent that acts as the **bridge between AI and your machine**. It can execute the code that `AssistantAgent` produces — running shell commands, writing files, running tests.

```python
executor = UserProxyAgent(
    name="executor",
    human_input_mode="NEVER",   # fully autonomous — no human approval needed
    code_execution_config={"work_dir": "./agent-output"},
)
```

### `GroupChat` + `GroupChatManager`

The **coordinator layer**. `GroupChat` defines which agents participate and the rules for turn order. `GroupChatManager` (backed by its own LLM) decides which agent should speak next based on the conversation so far.

```python
group_chat = GroupChat(
    agents=[coordinator, api_agent, frontend_agent, test_agent, executor],
    messages=[],
    max_round=30,
)
manager = GroupChatManager(groupchat=group_chat, llm_config=llm_config)
```

---

## 🏗 Agent Architecture for This Project

```
┌──────────────────────────────────────────────────────────┐
│                     👤 Human Prompt                       │
│  "Build a Notes app: Express + SQLite backend,           │
│   Vite + TypeScript frontend, Playwright tests"          │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                 🧠 Coordinator Agent                      │
│  - Reads the prompt and decomposes it into tasks         │
│  - Routes tasks to the right specialist agent            │
│  - Receives each agent's output and validates it         │
│  - Re-routes failures back to the responsible agent      │
└────┬──────────────┬──────────────┬────────────────────────┘
     │              │              │
     ▼              ▼              ▼
┌─────────┐  ┌───────────┐  ┌─────────────┐
│  🏗 API  │  │ 🎨 Frontend│  │  🧪 Testing │
│  Agent  │  │   Agent   │  │    Agent    │
│         │  │           │  │             │
│ Produces│  │ Produces  │  │ Produces    │
│ types.ts│  │index.html │  │ api.spec.ts │
│ db.ts   │  │api.ts     │  │ e2e.spec.ts │
│ routes/ │  │app.ts     │  │ ideas.      │
│ app.ts  │  │style.css  │  │  feature   │
└────┬────┘  └─────┬─────┘  └──────┬──────┘
     │              │               │
     └──────────────┴───────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────┐
│                  ⚙️  Executor Agent                       │
│  - Writes files to disk                                  │
│  - Runs: npx tsc --noEmit                                │
│  - Runs: npm run test:api                                │
│  - Returns stdout/stderr to the Coordinator              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  🔍 Review Agent                         │
│  - Reads all generated files                             │
│  - Checks for: missing Zod validation, XSS risks,       │
│    SQL injection, missing error handling                 │
│  - Outputs a structured security/quality report          │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Scripts Structure

```
scripts/
├── agents/
│   ├── coordinator.py      ← GroupChatManager + task decomposition prompt
│   ├── api_agent.py        ← Backend scaffolding agent definition
│   ├── frontend_agent.py   ← Frontend scaffolding agent definition
│   ├── test_agent.py       ← Test generation agent definition
│   └── review_agent.py     ← Security & quality review agent definition
└── run_agents.py           ← Entry point — parses args, starts GroupChat
```

---

## 🚀 How to Run the Pipeline

### Prerequisites

- Python 3.11+
- An OpenAI API key (GPT-4o recommended) **or** a local model via Ollama
- Node.js 22+ (the Executor agent needs it to run `tsc` and tests)

### 1. Install Python dependencies

```bash
# From the project root
pip install -r requirements.txt
```

### 2. Set your API key

```bash
export OPENAI_API_KEY=sk-...

# Or use a .env file — python-dotenv will load it automatically
echo "OPENAI_API_KEY=sk-..." >> .env
```

### 3. Run the pipeline

```bash
python scripts/run_agents.py \
  --prompt "Build a Todo app with Express, SQLite, Vite, and Playwright tests" \
  --output ./agent-output/
```

### 4. Watch the conversation

Each line of terminal output is one agent message — you can see the coordinator delegating, agents responding, and the executor running validation commands. When a test fails, watch the coordinator send the error back to the originating agent and request a fix.

### 5. Inspect the output

```bash
ls agent-output/
# backend/   frontend/   tests/   review-report.md
```

---

## 🔑 Key Concepts to Understand

### Why a Coordinator?

Without a coordinator, agents talk in circles or produce conflicting output. The coordinator's LLM is given the full conversation history and decides: _"Which agent should respond next? Is the current task complete enough to move on?"_ This is the same judgment call a human team lead makes in a standup.

### Why Validate with Real Tools?

A language model can write code that _looks_ correct but doesn't compile. By running `tsc --noEmit` and `npm run test:api` inside the Executor agent, the system gets **ground truth** about whether the output works. The coordinator interprets the compiler output just like a developer would and routes the error message back to the right agent.

### The Retry Loop

```
Coordinator → API Agent: "Write routes/ideas.ts"
API Agent → Executor: [code block]
Executor → Coordinator: "tsc error: Property 'db' does not exist on ..."
Coordinator → API Agent: "Fix this TypeScript error: ..."
API Agent → Executor: [corrected code block]
Executor → Coordinator: "tsc: no errors"
Coordinator → Frontend Agent: "Backend is ready. Now write the frontend."
```

This loop is what makes the system _agentic_ rather than just generative.

### Reflection and Review

The **Review Agent** doesn't write code — it reads it. Its system prompt focuses entirely on security and quality patterns specific to this stack. It knows to look for: raw `innerHTML` without `escapeHtml()`, string-concatenated SQL queries, missing Zod validation on request bodies, and Express routes without `try/catch`. It outputs a structured report with file:line citations.

---

## 📝 Exercises

### Exercise 7a — Change the Goal Prompt

Edit `scripts/run_agents.py` and change the `--prompt` to:

> _"Build a Bookmarks app with a tag system. Express + SQLite backend, Vite frontend, Playwright tests."_

Run it and observe how the agents adapt. Notice which parts of the agent output change and which stay the same (the project conventions are baked into each agent's system prompt).

### Exercise 7b — Add a New Agent Role

Create a new `docs_agent.py` that reads the final generated code and writes a `README.md` for the generated app. Add it to the `GroupChat` in `run_agents.py`. The coordinator will automatically include it in the pipeline.

### Exercise 7c — Study the Coordinator Prompt

Open `scripts/agents/coordinator.py` and read the system prompt carefully. It's the most important file in the pipeline — it defines the rules the whole system follows: task order, validation gates, and retry conditions. Try changing the validation gate to also require all E2E tests to pass before moving to the review phase.

### Exercise 7d — Swap the Model

In `run_agents.py`, change the `model` in `llm_config` from `"gpt-4o"` to `"gpt-4o-mini"`. Run the pipeline on a small prompt. Compare the output quality and token cost. What tradeoffs do you notice?

---

## 🤔 Think About This

- What happens when two agents disagree about how something should be implemented?
- How would you give an agent access to your existing codebase as context? (Hint: look at AutoGen's built-in `RetrieveUserProxyAgent`)
- What's the difference between an agent **using a tool** (calling a function) and an agent **executing code** (running a shell command)? Which is safer?
- If you were building production software with agents, where would you want **humans in the loop** — and why?

---

➡️ **You've completed the learning path!** Review the full project, open a PR, and see the AI pipeline from Step 6 review everything you've built.
