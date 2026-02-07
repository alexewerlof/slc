This monorepo hots a suit of web applications that help the user understand, assess, measure, and commit to Service Levels (SLI, SLO, SLA).

# Development

The code base is quite opinionated.
- It does not use any compiler or transpiler.
- It uses Vue@3 using a thin JavaScript layer in `./lib/component-loader.js` which is responsible for loading the template, style, and functionality of the component using separate `.html`, `.css`, and `.js` files.
- NEVER create `.vue` files. ALWAYS use the custom component pattern (3 separate files).
- For tests, it uses the native test framework that is available in Node.js@22

# Build

Although this application has no compilation process, it needs some package from NPM.
- We use standard NPM `package.json` to define the dependencies.
- `build.js` is a script that uses `esbuild` to export those dependencies as ESM to the `vendor` directory
- The rest of the application just imports those modules from vendor/npm-package-name.
- This has the added benefit that the application is self-contained and does not require any external CDN and since the dependencies are checked in to the repo, it is safer from supply chain attacks.

# Run

- This app is served using a simple HTTP server that is started using the VS Code extension `Live Server` (`ritwickdey.liveserver` which is supposed to be installed in the user's VS Code).
- Since there's no build step, the app is served directly from the source code.

# Formatting

Formatting uses the following rules:
- Indentation: 4 spaces
- No semicolon
- Use single quote `'` for strings
- Use dangling comma when applicable
- No line should be longer than 120 characters
- Use JSDoc as much as possible

# Styling

- The application uses a bespoke styling library located in `css/` directory.
- The branding variables (fonts, colors, border thickness, gap, etc.) are all defined in `css/variables.css`.
- `css/inputs.css` is the central place for styling all input elements across the app.
- Component-specific styles are in `components/component-name.css`.
- Do **not** hard code values like `1px`, `white`, or `0.5em` in the component CSS files. Use CSS variables defined in `css/variables.css` for consistency (colors, spacing, etc.).
- Use the latest CSS features including CSS nested rules.
- Avoid using absolute values (like `px`) directly in CSS. Always prefer using the defined CSS variables (e.g., `var(--gap)`, `var(--bthick)`).
    - Use `var(--gap...)` for margins and paddings.
    - Use `var(--bthick...)` for border widths.

# Your suggestion

- Skip flattery and praising my question with sentences like "That's a very insightful question" or "What an excellent observation". - Get to the point as quick as possible with as few words as possible. 
- Be honest and challenge my assumptions. Be frank and to the point.
- Please don't modify the code directly unless explicitly instructed to.
- Teach me the concepts and let me figure out how to use them in the code as I see fit.
- Focus on principals, teaching, and learning instead of solving the immediate problem at hand.
- When referring to new concepts, make sure to include links to references like MDN (mozilla developer network), RFCs, or even StackOverflow.
- Don't make up stuff. Say "I don't know" if you are not sure.
- Most engineering questions depend on many factors and are the result of trade-offs. Please ask clarifying questions before answering my questions. If there are alternatives with cons and pros, mention them.
