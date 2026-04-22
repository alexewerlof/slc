---
---
name: 'CSS Instructions'
description: 'Use when creating or modifying CSS files in this repository.'
applyTo: '**/*.css'
---

## Quick Checklist

- Use `css/variables.css` custom properties for **all** values — no hardcoded colors, sizes, or durations.
- Reach for the existing shared classes before adding new ones.
- Prefer CSS nesting and shallow selectors (max 2-3 levels).
- Desktop (≥ 1000px) is the primary target; add responsive rules only when needed.
- Avoid magic numbers and `!important`.
- Component-specific styles live next to the component file; shared styles live in `css/`.

## 1. Core Philosophy

- **Minimalistic**: Write the least amount of CSS needed.
- **Clear**: Use descriptive class names and logical structure.
- **Variable-First**: Always use CSS custom properties from `css/variables.css`.
- **Responsive**: Desktop is primary; mobile/tablet degrade gracefully with a single breakpoint at `1000px`.
- **BEM-First**: Use BEM naming for all classes and structure selectors around blocks.

## 2. CSS File Responsibilities

Each file in `css/` has a strict scope. Never put rules in the wrong file.

| File | Scope |
|---|---|
| `variables.css` | All CSS custom properties (single source of truth) |
| `style.css` | Base HTML element styles (`body`, `h1`–`h6`, `a`, `table`, `hr`, …) and utility surface classes (`.frost`, `.surface`, `.well`) |
| `inputs.css` | All interactive controls: `button`, `input`, `select`, `textarea`, `fieldset`, `.button-bar` |
| `layout.css` | Page structure: `.container`, `article`/`section`, `.main-container`, `.sidebar`, `.mozaic` grid, spacing utilities |
| `block.css` | Callout blocks: `.block.info`, `.block.warning`, `.block.error` |
| `code.css` | Code and math rendering: `code`, `pre`, syntax-highlight helpers, MathML elements |
| `toast.css` | Toast notification overlay: `.toast__container`, `.toast__item` |
| `vue-specific.css` | Vue.js transition classes and `[v-cloak]` |

Component-specific CSS (e.g. `calculator-component.css`) lives next to the component JS/HTML files.
App-level overrides (e.g. `index.css`) live at the app root.

## 3. CSS Variables (Critical)

**ALWAYS** use CSS custom properties from `css/variables.css` instead of hardcoded values.
The variables are defined in `:root` and are always available — never override them inside components.

### Available Variables

```css
/* Spacing — base unit is 0.5rem, each step multiplies */
--gap          /* 0.5rem */
--gap2         /* 1rem   */
--gap3         /* 1.5rem */
--gap4         /* 2rem   */
--gap5         /* 2.5rem */
--gap6         /* 3rem   */

/* Semantic Colors */
--primary-color        /* brand amber — headings, accents */
--primary-lighter      /* lighter amber — gradients */
--secondary-color      /* brand blue — links, info */
--background-color     /* page background (dark navy) */
--background-darker    /* deeper navy — inputs, sunken areas */
--background-lighter   /* slightly lighter navy — cards */
--foreground-color     /* warm white — body text */
--divider-color        /* subtle border between sections */
--disabled-color       /* muted — disabled controls */
--ui-border            /* default border color for inputs/panels */

/* Semantic Status Colors */
--brand-interactive    /* blue — focused/hovered controls, buttons */
--brand-error          /* red   */
--brand-warning        /* amber */
--brand-success        /* green */

/* Palette Colors (use sparingly — prefer semantic names above) */
--brand-blue, --brand-yellow, --brand-green
--brand-red, --brand-pink, --brand-purple

/* Border Radius */
--bradius    /* 3px  */
--bradius2   /* 6px  */
--bradius3   /* 9px  */
--bradius4   /* 12px */
--bradius5   /* 15px */

/* Border Thickness */
--bthick     /* 1px */
--bthick2    /* 2px */
--bthick3    /* 3px */
--bthick4    /* 4px */

/* Animation Duration */
--animation-speed    /* 0.2s */
--animation-speed2   /* 0.4s */
--animation-speed3   /* 0.6s */
--animation-speed4   /* 0.8s */
--animation-speed10  /* 2.0s */

/* Typography */
--title-font-family   /* 'Alata', sans-serif    */
--body-font-family    /* 'Roboto', sans-serif   */
--code-font-family    /* 'Roboto Mono', monospace */
```

### Usage Examples

```css
/* ✅ GOOD — semantic variables */
.panel {
    padding: var(--gap2);
    background: var(--background-lighter);
    border: var(--bthick) solid var(--ui-border);
    border-radius: var(--bradius2);
    transition: border-color var(--animation-speed);

    &:hover {
        border-color: var(--brand-interactive);
    }
}

/* ❌ BAD — hardcoded values */
.panel {
    padding: 1rem;
    background: #001b33;
    border: 1px solid #183a57;
    border-radius: 6px;
    transition: border-color 0.2s;
}
```

## 4. CSS Nesting

**ALWAYS** use native CSS nesting to reduce repetition.

### Native nesting rules

- **No `&` concatenation**: `&__element` is invalid in native CSS nesting. Write the full class name.
- **Descendant by default**: A nested selector without `&` is a descendant combinator.
- **Same element needs `&`**: Use `&:hover`, `&.modifier`, `&[attr]` to target the element itself.
- **Combinators work**: `& + .sibling`, `& > .child`, `& ~ .sibling`.
- **Nestable at-rules**: `@media`, `@supports`, `@container`, `@starting-style`.

```css
/* ✅ GOOD */
.card {
    padding: var(--gap3);
    background: var(--background-lighter);

    &:hover {
        border-color: var(--primary-color);
    }

    & .card__title {
        color: var(--primary-color);
    }

    &.card--highlighted {
        border-color: var(--brand-warning);
    }

    @media (max-width: 999px) {
        padding: var(--gap2);
    }
}

/* ❌ BAD — invalid concatenation */
.card {
    &__title { color: var(--primary-color); }   /* does not work */
}
```

## 5. Responsive Design

Desktop (≥ 1000px) is the **primary target**. Use a single breakpoint.

```css
/* Default styles target desktop */

@media screen and (min-width: 1000px) {
    /* Desktop-only additions */
}

@media screen and (max-width: 999px) {
    /* Mobile / tablet overrides */
}
```

The `mozaic` grid (see §6) handles most responsive layout automatically — tiles stack vertically on mobile.
Touch targets must be large enough to tap comfortably; use at least `--gap4` for height/width of interactive elements.
Use `cursor: pointer` on non-button interactive elements to indicate tappability.

## 6. Layout System (`layout.css`)

### Container

```html
<div class="container">…</div>   <!-- max-width: 1500px, centred -->
```

### Main layout with sidebar

```html
<div class="main-container">
    <aside class="sidebar">…</aside>
    <div class="main-content">…</div>
</div>
```

### Article / Section

`article` becomes a horizontal flex row on desktop (≥ 1000px); each `section` inside grows equally.
Use `article.stretch` to make all sections the same height.

```html
<article>
    <section>…</section>
    <section>…</section>
</article>
```

### Mozaic — 12-column grid

On desktop (≥ 1000px) `.mozaic` renders as a 12-column CSS grid.
On mobile (< 1000px) it becomes a single-column flex column — tiles stack vertically.

```html
<div class="mozaic mozaic--gap2">
    <div class="mozaic__tile--4c">One third</div>
    <div class="mozaic__tile--8c">Two thirds</div>
</div>
```

Available column spans: `--1c` through `--12c`, plus named aliases:
- `--third` = 3 columns, `--fourth` = 4 columns
- `--half` / `--6c` = 6 columns
- `--whole` / `--12c` = full width (use for headings/titles that span all columns)
- `--2r` spans two rows

Gap modifiers: `.mozaic--gap2`, `.mozaic--gap4`

### Spacing utilities

Padding: `.pad-gap`, `.pad-gap2`, `.v-pad-gap`, `.h-pad-gap`, `.v-pad-gap2`, `.h-pad-gap2`
Margin: `.mar-0`, `.mar-gap`, `.mar-gap2`, `.v-mar-gap`, `.h-mar-gap`, `.v-mar-gap2`, `.h-mar-gap2`, `.t-mar-gap2`, `.b-mar-gap2`

### Visibility

`.only-mobile` — hidden on desktop (≥ 1000px).

## 7. Surface Utilities (`style.css`)

These utility classes apply polished visual treatments without extra CSS.

| Class | Effect |
|---|---|
| `.frost` | Frosted-glass card with animated diagonal gradient on hover — use for app item cards and hero sections |
| `.surface` | Bordered panel with inner glow — use for primary content blocks |
| `.well` | Bordered panel with outer glow — use for inset/recessed areas |
| `.surface--cta` | Modifier for `.surface`: highlights border with `--primary-color` |
| `.scribble-bg` | Decorative scribble SVG background image |
| `.logo-bg` | Brand logo SVG background image |
| `.cursor-pointer` | `cursor: pointer` for non-button interactive elements |

```html
<!-- Frosted card (links, tiles) -->
<a class="frost pad-gap2" href="…">…</a>

<!-- Content block -->
<div class="surface pad-gap2">…</div>

<!-- Call-to-action block -->
<div class="surface surface--cta pad-gap2">…</div>

<!-- Inset / recessed area -->
<div class="well pad-gap2">…</div>
```

## 8. Callout Blocks (`block.css`)

`.block` renders a left-bordered callout with a Material Symbol icon injected via `::before`.
Requires the **Material Symbols Outlined** icon font to be loaded.

```html
<div class="block info"><p>Informational message.</p></div>
<div class="block warning"><p>Something to be careful about.</p></div>
<div class="block error"><p>Something went wrong.</p></div>
```

Do not add an icon element manually — it is inserted automatically.
The block color is driven by `currentColor`, so each modifier only needs to set the color.

## 9. Form Inputs (`inputs.css`)

All native form elements are pre-styled. Use them as-is without extra wrapper classes.

### Text inputs

`input[type='text']`, `input[type='number']`, `input[type='url']`, `input[type='search']`,
`input[type='password']`, `select`, `textarea` share the same base style:
- Dark background (`--background-darker`), full-width, bordered.
- Hover and focus highlight the border with `--brand-interactive`.
- Invalid state uses `--brand-error`.
- Disabled state uses `--disabled-color` and `cursor: not-allowed`.

### Range slider

`input[type='range']` has a custom track and thumb; the thumb grows on hover/focus for touch friendliness.

### Checkbox and radio

Custom-rendered with `appearance: none` + `::before`. Checked state fills with `--brand-interactive`.
Radio inputs have `border-radius: 50%`; checkboxes use `--bradius`.

### Fieldset

Pre-styled with a sunken background, coloured `<legend>`, and stacked spacing (sibling `fieldset + fieldset` gets `margin-top`).

### Buttons

`button` is styled globally — no extra class needed for a standard button.

```html
<button>Standard</button>
<button disabled>Disabled</button>
```

Size modifiers: `.button--small`, `.button--large`, `.button--round`

### Button bar

Groups buttons in a flex row (right-aligned by default).

```html
<div class="button-bar">
    <button>Cancel</button>
    <span class="button-bar__sep"></span>
    <button>Save</button>
</div>
```

Alignment modifiers: `.button-bar--left`, `.button-bar--center`
Other modifiers: `.button-bar--small`, `.button-bar--vertical`, `.button-bar--unified-corner`

## 10. Code Highlighting (`code.css`)

Use `<code>` for inline code and `<pre><code>` for blocks. The monospace font is applied automatically.
Annotate tokens with span elements for syntax colouring:

| Class | Token type | Color variable |
|---|---|---|
| `.funct` | Function name | `--primary-color` |
| `.punct` | Punctuation | `--brand-red` |
| `.exprs` | Expression / value | `--secondary-color` |
| `.str` | String literal | `--brand-green` |
| `.cmnt` | Comment | `--brand-purple` |
| `.const` | Constant | `--brand-pink` |

MathML elements (`math`, `mfrac`, `mn`, `mo`, `ms`, `mi`, `mtd`) are also styled in this file.

## 11. BEM Methodology

Use BEM naming for all classes. Keep blocks independent.

- **Block**: `.component-name`
- **Element**: `.component-name__element`
- **Modifier**: `.component-name--modifier`

Rules:
- Do not style IDs or rely on bare tag selectors inside component CSS.
- Do not write cross-block selectors like `.card .sidebar` — components must be independent.
- Modifiers adjust an existing base style; they never define the base on their own.

```css
/* ✅ GOOD */
.alert {
    padding: var(--gap2);
    border: var(--bthick) solid currentColor;

    & .alert__title {
        font-family: var(--title-font-family);
    }

    &.alert--error {
        color: var(--brand-error);
    }
}

/* ❌ BAD */
#alert .title { }          /* ID selector */
.alert .alert__title { }   /* redundant double prefix */
.alert {
    &__title { }           /* & concatenation — invalid in native CSS */
}
```

## 12. Forbidden Patterns

```css
/* ❌ Hardcoded sizes */
padding: 10px;
margin: 20px 15px;

/* ❌ Hardcoded colors */
background: #ffbc52;
color: red;

/* ❌ Inline styles in HTML */
<div style="padding: 10px;">

/* ❌ Deep nesting (> 3 levels) */
.a .b .c .d { }

/* ❌ Magic numbers */
z-index: 9999;
margin-top: 37px;

/* ❌ Unnecessary !important */
color: red !important;

/* ❌ BEM concatenation (native CSS does not support it) */
.block { &__element { } }
```

## 13. Documentation Maintenance

When adding new variables to `variables.css`, document them in §3.
When establishing new shared patterns, add them to the relevant section above.

---

**Remember**: The goal is minimal, maintainable CSS. Before adding new styles, check whether an
existing utility class, surface class, or variable already covers the need.
