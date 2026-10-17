---
description: Add or update automated tests for a specified Express endpoint and scenarios.
argument-hint: "<method and route> <scenarios to cover>"
---

Add or update automated tests for the Express endpoint `$1`, covering these scenarios: `$2`.

Read the repository instructions, the relevant route, and nearby tests first. Follow the `testing-endpoints` skill and the existing `node:test` and Supertest conventions. Keep the changes limited to endpoint tests; do not change application code. Run `npm test` and report the test results and files changed. If either argument is missing or ambiguous, ask for clarification before editing.
