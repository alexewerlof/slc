# Calculator App - Agent Context

Just like the other apps in this repo, the Calculator app is a client-side only application.

It uses a URL-based state management system.

### Key Concepts

1.  **URL as Source of Truth**: The application state is serialized and stored in the URL query parameters.
    -   Key parameter: `state` (contains the JSON-serialized state).
    -   Versioning: `urlVer` parameter handles schema versions.

2.  **Initialization**:
    -   On load, `makeCalculator(globalThis.location.href)` (in `components/calculator.js`) parses the URL.
    -   If valid state parameters exist, it initializes the `Calculator` model with that state.
    -   Otherwise, it loads a default state.

3.  **State Updates**:
    -   When the user interacts with the UI (e.g., changes values), the internal state updates.
    -   The app computes a `shareUrl` (in `app/calculator/index.js`) using `stateToUrl` from `lib/share.js`.
    -   This URL corresponds to the current state, allowing users to "save" or "share" their configuration simply by copying the URL.

## Relevant Files

-   `app/calculator/index.js`: Entry point. Initializes the app and computes the shareable URL.
-   `components/calculator.js`: Contains `makeCalculator` factory and `Calculator` class. Handles logic for hydrating state from URL.
-   `lib/share.js`: Utilities for serializing/deserializing state to/from URLs (`stateToUrl`, `urlToState`).
