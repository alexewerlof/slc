# Contributing to SLC

Thank you for your interest in contributing to the Service Level Calculator (SLC) project!

## Architecture & Philosophy

This project follows a specific philosophy to keep dependencies low and performance high:

-   **Native Web Standards**: We use modern browser features (ES Modules, Template Literals, etc.) directly.
-   **No Transpilers**: There is no build step for development. No Babel, no Webpack, no TypeScript compilation for runtime code.
-   **Vue 3 (No .vue files)**: We use Vue 3 but **NOT** Single File Components (`.vue`). Instead, we use a custom `component-loader.js` that loads:
    -   `.html` for templates
    -   `.js` for logic (modules)
    -   `.css` for styles

## Project Structure

-   `components/`: UI components. Each component consists of 3 files with the same basename (e.g., `my-comp.html`, `my-comp.js`, `my-comp.css`).
-   `lib/`: reusable libraries and utilities (including `component-loader.js`).
-   `vendor/`: third-party dependencies (managed manually or via simple scripts, no complex bundlers).
-   `test/`: native Node.js tests.

## Development Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the dev server**:
    There is no specific dev server command because it's just static files. You can use any static file server.
    ```bash
    npx serve .
    ```
    Or just open `index.html` (though some ESM features might require a server).

3.  **Run tests**:
    ```bash
    npm test
    ```
    We use the native Node.js test runner (`node --test`).

4.  **Linting**:
    ```bash
    npm run lint
    ```
    We use ESLint and Prettier.

5.  **Build**:
    ```bash
    npm run build
    ```
    This is only for production optimization, not required for development.

## Coding Conventions

-   **Indentation**: 4 spaces.
-   **Semicolons**: None.
-   **Quotes**: Single quotes for strings.
-   **Line length**: Max 120 characters.
-   **JSDoc**: Document functions and classes using JSDoc.

## Creating a New Component

Do **NOT** create `.vue` files. Instead:

1.  Create `components/folder/my-component.html` (Template)
2.  Create `components/folder/my-component.js` (Export default object with Vue options)
3.  Create `components/folder/my-component.css` (Styles)
4.  Register it or load it via `component-loader.js`.

For example, to load a component in another component:
```javascript
// in parent-component.js
export default {
   components: {
       'my-component': defineAsyncComponent(() => loadComponent('./path/to/my-component.hjc'))
   }
}
```
*Note the `.hjc` suffix flags: h=html, j=js, c=css.*

## Pull Requests

1.  Ensure `npm test` passes.
2.  Ensure `npm run lint` passes.
3.  Keep PRs focused and small.
