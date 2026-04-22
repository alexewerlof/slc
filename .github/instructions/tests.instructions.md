---
description: "Use when creating or editing Node.js test files (*.test.js). Enforces construct-level describe blocks, symbol-name based describe titles, and internal-test-surface conventions."
name: "Testing Conventions"
applyTo: "**/*.test.js"
---

# Testing Conventions

- Use Node.js native test and assertion tools from `node:test` and `node:assert/strict`.
- Use `describe(...)` and `it(...)` for test organization and labeling instead of `suite()` and `test()`.
- Organize tests by code construct: each function or class under test must have its own `describe(...)` block.
- Build `describe(...)` labels from symbols, not hard-coded strings:
  - Use `describe(fn.name, ...)` for functions.
  - Use `describe(TheClass.name, ...)` for classes.
- For internal/private code constructs (functions, classes, objects) that need direct tests:
  - Keep them out of the public API surface (no `export`).
  - Expose them through a dedicated `const _test = {...}` object at the module level.
  - Test files should import and test `_test` explicitly and get a reference to those internal/private code constructs.
- Keep tests behavior-focused: assert inputs, outputs, and edge cases for each construct.
- Avoid coupling tests to unrelated module internals beyond the `_test` surface.
