# Step 6 – BDD Feature File (Starter)
# ======================================
# WHY BDD: Feature files describe BEHAVIOUR in plain English so that
# developers, QA engineers, and product managers all share the same
# understanding of what the system should do.
#
# This file starts with ONE scenario: verifying the health check.
# After reading docs/STEP_05_BDD_GHERKIN.md, you will add scenarios for:
#  - Creating an idea
#  - Retrieving ideas
#  - Updating an idea
#  - Deleting an idea
#  - Validation errors (e.g., missing title)
#
# GHERKIN KEYWORDS:
#   Feature   — the capability under test
#   Scenario  — one specific test case
#   Given     — precondition (the state before the action)
#   When      — the action the user takes
#   Then      — the expected outcome
#   And       — continues the previous keyword

Feature: Idea Journal API
  As a student learning QA engineering
  I want to verify the API behaves correctly
  So that I can trust the system works as expected

  Background:
    Given the API is running at "http://localhost:3001"

  # ── Starter Scenario ──────────────────────────────────────────────────────
  Scenario: API health check passes
    When I send a GET request to "/health"
    Then the response status should be 200

  # ── TODO (Step 6): Add your own scenarios below ───────────────────────────
  # Follow docs/STEP_05_BDD_GHERKIN.md for the full list of step definitions.

  # Scenario: Successfully create a new idea
  #   When I send a POST request to "/api/ideas" with:
  #     | title    | Learn Gherkin |
  #     | category | testing       |
  #   Then the response status should be 201

  # Scenario: Fail to create an idea without a title
  #   When I send a POST request to "/api/ideas" with:
  #     | description | No title! |
  #   Then the response status should be 400

  # Scenario: Retrieve all ideas
  #   When I send a GET request to "/api/ideas"
  #   Then the response status should be 200
  #   And the response should contain an array of ideas

