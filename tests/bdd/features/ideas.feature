# ════════════════════════════════════════════════════════════════
# Feature: Idea Management
# ════════════════════════════════════════════════════════════════
#
# WHY BDD (Behaviour-Driven Development):
#   BDD bridges the gap between technical teams and non-technical
#   stakeholders. Feature files are written in plain English (Gherkin)
#   so everyone — developers, QA engineers, and product managers —
#   can understand and agree on the expected behaviour.
#
# GHERKIN SYNTAX EXPLAINED:
#   Feature  – the capability being described
#   Scenario – a specific situation / test case
#   Given    – the initial context (precondition)
#   When     – the action the user takes
#   Then     – the expected outcome
#   And      – continues the previous keyword
#   But      – contrasts the previous keyword
#
# CONCEPT: Each Scenario maps to a test case. Step Definitions
# (in steps/ideas.steps.ts) contain the actual code that runs.
# ════════════════════════════════════════════════════════════════

Feature: Idea Management API
  As a student learning QA engineering
  I want to manage my learning ideas via the API
  So that I can track and retrieve my ideas from the database

  Background:
    Given the API is running at "http://localhost:3001"

  # ── CREATE ──────────────────────────────────────────────────

  Scenario: Successfully create a new idea
    When I send a POST request to "/api/ideas" with:
      | title       | Learn BDD with Cucumber      |
      | description | Use Gherkin to write tests   |
      | category    | testing                      |
    Then the response status should be 201
    And the response should contain an idea with title "Learn BDD with Cucumber"
    And the idea should have category "testing"

  Scenario: Fail to create an idea without a title
    When I send a POST request to "/api/ideas" with:
      | description | Missing the title field |
    Then the response status should be 400
    And the response should contain an error mentioning "Title"

  Scenario: Create an idea with default category
    When I send a POST request to "/api/ideas" with:
      | title | Default category idea |
    Then the response status should be 201
    And the idea should have category "general"

  # ── READ ────────────────────────────────────────────────────

  Scenario: Retrieve all ideas
    Given an idea exists with title "Retrieve all ideas test"
    When I send a GET request to "/api/ideas"
    Then the response status should be 200
    And the response should contain an array of ideas

  Scenario: Retrieve a single idea by ID
    Given an idea exists with title "Retrieve by ID test"
    When I fetch the idea by its ID
    Then the response status should be 200
    And the response should contain the idea with title "Retrieve by ID test"

  Scenario: Attempt to retrieve a non-existent idea
    When I send a GET request to "/api/ideas/999999"
    Then the response status should be 404
    And the response should contain an error mentioning "not found"

  # ── UPDATE ──────────────────────────────────────────────────

  Scenario: Update an existing idea's title
    Given an idea exists with title "Old title"
    When I update the idea's title to "New title"
    Then the response status should be 200
    And the response should contain an idea with title "New title"

  # ── DELETE ──────────────────────────────────────────────────

  Scenario: Delete an existing idea
    Given an idea exists with title "Idea to be deleted"
    When I delete the idea by its ID
    Then the response status should be 204
    And the idea should no longer exist in the API
