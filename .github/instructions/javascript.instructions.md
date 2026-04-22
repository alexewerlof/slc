---
description: "Use when creating or editing JavaScript files in this repository. Enforces module style, formatting, Vue component-loader architecture, and Node.js test conventions."
name: "JavaScript Conventions"
applyTo: "**/*.js"
---

# Type Definitions

- Add typed JSDoc for all objects, functions, types, methods, and classes because this is a large code base and without it is hard to maintain without type information.
- If there is already JSDoc, ensure that they are formatted correctly and that the types are true based on the code behavior.

# JavaScript Conventions

- Use ESM only: `import` and `export`. Do not introduce `require` or `module.exports`.
- Follow [repository formatting rules](../../.prettierrc.json): 4-space indentation, single quotes, no semicolons, trailing commas where valid, and line length up to 120.
- Keep JavaScript directly runnable without transpilation for app source files. Our target runtime is the latest version of evergreen browsers (Firefox, Chrome, Safari) and Node.js LTS (v24+) for backend scripts.
- For Vue UI work, use the component-loader split format with separate `.js`, `.html`, and `.css` files.
- Never create `.vue` single-file components.
- Import third-party libraries from checked-in `vendor/` modules, not from external CDNs.
- Prefix intentionally unused variables/arguments with `_` to satisfy lint rules.

# Runtime

- When giving local run instructions, prefer VS Code Live Server (usually listens on port 5500 or 5501) rather than ad-hoc HTTP servers because it is not needed.

# Optimize for testability

- Prefer pure functions because they are easier to test deterministically.
- Only use classes when passing large amount of state back and forth to the same group of tightly coupled methods makes the code too verbose.
