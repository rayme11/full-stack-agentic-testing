#!/usr/bin/env python3
"""
AI PR Review Script
===================
WHY: This script uses the OpenAI API to automatically review pull request
diffs and post a structured review comment back to GitHub. It demonstrates
how LLMs can be integrated into CI/CD pipelines for automated code review.

CONCEPT: SRE / DevOps – AI-assisted quality gates in the deployment pipeline.

Usage:
  Set these environment variables before running:
    OPENAI_API_KEY  – your OpenAI API key
    GITHUB_TOKEN    – automatically set in GitHub Actions
    PR_NUMBER       – pull request number
    REPO            – "owner/repo"
    BASE_SHA        – base commit SHA
    HEAD_SHA        – head commit SHA
"""

import os
import subprocess
import sys
from openai import OpenAI
import requests
from rich.console import Console

console = Console()

# ── Read environment variables ────────────────────────────────────────────────
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
GITHUB_TOKEN   = os.environ.get("GITHUB_TOKEN", "")
PR_NUMBER      = os.environ.get("PR_NUMBER", "")
REPO           = os.environ.get("REPO", "")
BASE_SHA       = os.environ.get("BASE_SHA", "")
HEAD_SHA       = os.environ.get("HEAD_SHA", "")

if not OPENAI_API_KEY:
    console.print("[yellow]⚠ OPENAI_API_KEY not set – skipping AI review.[/yellow]")
    sys.exit(0)

# ── Get the diff ──────────────────────────────────────────────────────────────
console.print(f"[blue]Fetching diff from {BASE_SHA[:7]}..{HEAD_SHA[:7]}[/blue]")
result = subprocess.run(
    ["git", "diff", BASE_SHA, HEAD_SHA, "--", "*.ts", "*.tsx", "*.js", "*.py", "*.yml", "*.feature"],
    capture_output=True,
    text=True,
)
diff = result.stdout[:8000]  # Limit diff size to stay within token limits

if not diff.strip():
    console.print("[yellow]No relevant diff found – skipping review.[/yellow]")
    sys.exit(0)

# ── Call OpenAI GPT-4o ────────────────────────────────────────────────────────
console.print("[blue]Calling OpenAI for review...[/blue]")
client = OpenAI(api_key=OPENAI_API_KEY)

system_prompt = """You are an expert TypeScript and QA engineer reviewing a pull request.
The project is a full-stack learning app (Node.js + Express + SQLite + Playwright BDD).

Your review must cover:
1. **Code Quality**: TypeScript best practices, type safety, readability
2. **Testing**: Are tests added? Are edge cases covered?
3. **Security**: Any obvious vulnerabilities (SQL injection, missing validation)?
4. **Learning**: Explain concepts the student should know from these changes
5. **Suggestions**: Concrete, actionable improvements

Format your response as clear Markdown with sections."""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Please review this PR diff:\n\n```diff\n{diff}\n```"},
    ],
    max_tokens=1500,
)

review_body = response.choices[0].message.content or "No review generated."

# ── Post review comment to GitHub ─────────────────────────────────────────────
console.print("[blue]Posting review comment to GitHub...[/blue]")
headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

comment_body = f"""## 🤖 AI Code Review (GPT-4o)

{review_body}

---
*This review was generated automatically by the AI PR Review workflow.*
*Always apply your own judgment — AI reviews can make mistakes!*
"""

resp = requests.post(
    f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments",
    headers=headers,
    json={"body": comment_body},
)

if resp.status_code == 201:
    console.print("[green]✅ AI review posted successfully![/green]")
else:
    console.print(f"[red]Failed to post review: {resp.status_code} {resp.text}[/red]")
    sys.exit(1)
