# Step 05 – BDD with Gherkin and Cucumber.js

## 🎯 What You Will Learn
- What **BDD (Behaviour-Driven Development)** is and why companies use it
- How to write **Gherkin** feature files in plain English
- How **Cucumber.js** connects Gherkin to TypeScript step definitions
- The **Given / When / Then** pattern and what each part means
- How BDD makes tests understandable by non-technical stakeholders

---

## 📚 Concept: What is BDD?

**Behaviour-Driven Development** is a development practice where:
1. **Business analysts, QA engineers, and developers** sit together
2. They write **plain English descriptions** of how the system should behave
3. Those descriptions become **executable tests**

The magic: the same document that a product manager can read is also the test spec that a developer runs.

```
Product Manager says:                Developer runs:
"When a user creates an idea         Cucumber executes:
without a title, they should         Given the API is running
see an error message."          →    When I POST /api/ideas without a title
                                     Then the status should be 400
                                     And the error should say "Title is required"
```

---

## 📚 Concept: Gherkin Language

Gherkin is the language used to write BDD scenarios. It's designed to be read by humans first, machines second.

```gherkin
# Everything after # is a comment

Feature: Idea Management API
  As a student learning QA engineering      ← WHO (the user)
  I want to manage my learning ideas        ← WHAT (the goal)
  So that I can track my progress           ← WHY (the value)

  Background:
    Given the API is running at "http://localhost:3001"
    # Background steps run before EVERY scenario (like beforeEach)

  Scenario: Successfully create a new idea
    # Given = the setup / precondition
    Given nothing special

    # When = the action the user takes
    When I send a POST request to "/api/ideas" with:
      | title    | Learn Gherkin           |
      | category | testing                 |

    # Then = the expected outcome
    Then the response status should be 201
    And the response should contain an idea with title "Learn Gherkin"
```

### Gherkin Keywords Explained

| Keyword | Meaning | Example |
|---------|---------|---------|
| `Feature` | The capability being tested | "Idea Management API" |
| `Scenario` | One specific test case | "Create idea without title" |
| `Background` | Setup that runs before every scenario | Set base URL |
| `Given` | Initial context (state before the action) | "an idea already exists" |
| `When` | The action the user performs | "I POST to /api/ideas" |
| `Then` | The expected result | "status is 201" |
| `And` | Continues the previous keyword | "And the title is correct" |
| `But` | Negative follow-up | "But the description is empty" |
| `"""` | Multi-line string (docstring) | Block of JSON |
| `\| key \| value \|` | Data table | Form fields |

---

## 📁 BDD File Structure

```
tests/bdd/
├── features/
│   └── ideas.feature      ← Plain English scenarios (written by anyone)
└── steps/
    └── ideas.steps.ts     ← TypeScript code that runs each step
```

The **feature file** answers "WHAT should happen?"
The **step definitions** answer "HOW do we verify it?"

---

## 🚀 Running BDD Tests

```bash
# Make sure the backend is running first!
cd backend && npm run dev

# In another terminal:
cd tests
npm run test:bdd
```

You'll see output like:
```
Feature: Idea Management API

  Background:
    ✔ Given the API is running at "http://localhost:3001"

  Scenario: Successfully create a new idea
    ✔ When I send a POST request to "/api/ideas" with:
    ✔ Then the response status should be 201
    ✔ And the response should contain an idea with title "Learn BDD with Cucumber"

  6 scenarios (6 passed)
  28 steps (28 passed)
  0m02.341s
```

---

## 📚 Concept: Step Definitions in TypeScript

Each Gherkin step maps to a TypeScript function:

```gherkin
# In .feature file:
When I send a POST request to "/api/ideas" with:
  | title    | Learn Cucumber |
  | category | testing        |
```

```typescript
// In ideas.steps.ts:
When(
  "I send a POST request to {string} with:",
  async function(path: string, dataTable) {
    // Cucumber passes:
    //   path = "/api/ideas"
    //   dataTable = { title: "Learn Cucumber", category: "testing" }

    const data = dataTable.rowsHash(); // Converts table to object

    this.lastResponse = await fetch(`${this.apiBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    this.lastBody = await this.lastResponse.json();
  }
);
```

### Step Argument Types

| Gherkin | TypeScript type | Example |
|---------|----------------|---------|
| `{string}` | `string` | `"http://localhost:3001"` |
| `{int}` | `number` | `201`, `404` |
| `{float}` | `number` | `3.14` |
| Data table (vertical) | `.rowsHash()` → `Record<string, string>` | `\| key \| value \|` |
| Data table (horizontal) | `.hashes()` → `Array<Record<string, string>>` | Multiple rows |

---

## 📚 Concept: Cucumber World (Shared State)

Within a single scenario, steps share state through the **World** object (`this`):

```typescript
// Step 1 creates an idea and saves its ID
Given("an idea exists", async function(this: MyWorld) {
  const res = await createIdea();
  this.createdIdeaId = res.id;  // 👈 saved to World
});

// Step 2 reads that ID — even though it's a different function!
When("I fetch the idea", async function(this: MyWorld) {
  const res = await fetch(`/api/ideas/${this.createdIdeaId}`);  // 👈 reads from World
  this.lastResponse = res;
});

// Step 3 checks the response
Then("the status should be 200", function(this: MyWorld) {
  assert.strictEqual(this.lastResponse.status, 200);
});
```

The World is **reset between scenarios** (like `beforeEach`), so scenarios don't share state with each other.

---

## 📚 Concept: BDD vs. Traditional Testing

| Aspect | Traditional (Playwright/Jest) | BDD (Cucumber + Gherkin) |
|--------|-------------------------------|--------------------------|
| Who writes tests | Developers/QA | Anyone (business, QA, dev) |
| Language | TypeScript/JavaScript | Plain English (Gherkin) |
| Documentation value | Low (technical code) | High (readable by all) |
| Best for | Implementation details | Business requirements |
| Speed | Faster to write | More setup upfront |

Use BDD for **critical business requirements**. Use Playwright directly for **implementation-level tests**.

---

## 📝 Write Your First Gherkin Scenario

Add this to `tests/bdd/features/ideas.feature`:

```gherkin
Scenario: Update an idea's category
  Given an idea exists with title "Category update test"
  When I update the idea's category to "devops"
  Then the response status should be 200
  And the idea should have category "devops"
```

Then add the missing step definition to `tests/bdd/steps/ideas.steps.ts`:

```typescript
When("I update the idea's category to {string}", async function(newCategory: string) {
  this.lastResponse = await fetch(`${this.apiBase}/api/ideas/${this.createdIdeaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: newCategory }),
  });
  this.lastBody = await this.lastResponse.json();
});
```

Run `npm run test:bdd` and watch your new scenario pass!

---

➡️ **Next Step:** [Step 06 – GitHub Actions & AI](./STEP_06_GITHUB_ACTIONS_AI.md)
