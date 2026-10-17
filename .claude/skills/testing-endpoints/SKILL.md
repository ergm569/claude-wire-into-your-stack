---
name: testing-endpoints
description: "Use when creating, adding, updating, or debugging automated tests for Express HTTP endpoints in this repository, including route tests, API tests, Supertest, or node:test. Do not use for general application changes or tests unrelated to HTTP endpoints."
---

# Testing HTTP Endpoints

Use the repository's existing Node.js test and Supertest conventions when testing Express routes.

## Procedure

1. Read the route and nearby tests first. Keep tests in the relevant file under `tests/`, following its existing organization.
2. Import `node:test`, `node:assert`, `supertest`, the Express app from `../server`, and `db/store` as needed. Send requests through Supertest; do not start a separate listening server.
3. Reset in-memory data before each test with `test.beforeEach(() => store.reset())` when tests depend on user state.
4. Cover the expected success response and relevant failure cases. Assert HTTP status codes and response JSON, including `{ error: "message" }` for errors where applicable.
5. Keep each test isolated and deterministic. Avoid changing application code or unrelated tests when the request is specifically to work on endpoint tests.
6. Run `npm test` and report the result. If a test exposes an application defect, describe it rather than changing production code unless the user also requested that fix.
