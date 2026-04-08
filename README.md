<p align="center">
  <img src="https://zentto.net/favicon.svg" width="64" alt="Zentto Logo" />
</p>

<h1 align="center">Zentto Studio</h1>

<p align="center">
  <strong>Runtime UI builder as a web component — generate full apps from JSON.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@zentto/studio-core"><img src="https://img.shields.io/npm/v/@zentto/studio-core?label=studio-core&color=e67e22" alt="studio-core" /></a>
  <a href="https://www.npmjs.com/package/@zentto/studio"><img src="https://img.shields.io/npm/v/@zentto/studio?label=studio&color=1976d2" alt="studio" /></a>
  <a href="https://www.npmjs.com/package/@zentto/studio-react"><img src="https://img.shields.io/npm/v/@zentto/studio-react?label=studio-react&color=61dafb" alt="studio-react" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT" /></a>
  <img src="https://img.shields.io/badge/framework-agnostic-blueviolet" alt="Framework agnostic" />
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#documentation">Docs</a> ·
  <a href="#related-packages">Ecosystem</a> ·
  <a href="#development">Development</a>
</p>

---

Generate full applications from JSON — forms, grids, charts, dashboards, wizards — rendered dynamically inside any web app.

Think MUI Toolpad + SAP Screen Personas + Retool, but as a **framework-agnostic web component** you install from npm.

---

## Features

- **JSON → Full App** — One config generates sidebar, header, routing, pages, forms, grids, charts
- **30+ Field Types** — Text, number, date, select, chips, tree view, signature, address, file upload, rating, and more
- **Visual Designer** — Figma-style drag-drop editor with undo/redo, autosave, and live preview
- **Expression Engine** — Safe recursive-descent parser: `{precio} * {cantidad} * (1 + {iva}/100)`
- **Rule Engine** — Conditional visibility, computed values, validation: `{role} == "admin" AND {total} > 1000`
- **Data Sources** — Connect to any REST/GraphQL API with auto-field detection
- **Modals & Toasts** — Promise-based confirm/alert/prompt/delete/decision dialogs + stackable toasts
- **App Templates** — CRM, E-Commerce, HR, Invoice — start designing in seconds
- **Provider System** — Inject your own icons (MUI, FontAwesome), components, auth, and fetch
- **Theme System** — CSS custom properties (`--zs-*`), light/dark mode
- **i18n** — Spanish, English, Portuguese built-in
- **Framework Agnostic** — Works in Vanilla JS, React, Vue, Angular, .NET Blazor, Vite
- **TypeScript** — Full type safety with Zod validation
- **Zero Config** — One `<script>` tag or `npm install` and you're ready

---

## Quick Start

### CDN (Vanilla JS)

```html
<script type="module">
  import 'https://unpkg.com/@zentto/studio@latest/dist/zentto-studio-renderer.js';
</script>

<zentto-studio-renderer id="form"></zentto-studio-renderer>

<script>
  document.getElementById('form').schema = {
    id: 'demo', version: '1.0', title: 'Contact Form',
    layout: { type: 'grid', columns: 2 },
    sections: [{
      id: 'main', title: 'Contact',
      fields: [
        { id: 'name', type: 'text', field: 'name', label: 'Name', required: true },
        { id: 'email', type: 'email', field: 'email', label: 'Email', required: true },
        { id: 'message', type: 'textarea', field: 'message', label: 'Message', colSpan: 2 },
      ]
    }],
    actions: [{ id: 'send', type: 'submit', label: 'Send', variant: 'primary' }]
  };
</script>
```

### npm (React / Next.js)

```bash
npm install @zentto/studio @zentto/studio-core @zentto/studio-react
```

```tsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function MyForm() {
  const [ready, setReady] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    import("@zentto/studio").then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    ref.current.schema = {
      id: 'demo', version: '1.0', title: 'Contact',
      layout: { type: 'grid', columns: 2 },
      sections: [{
        id: 'main', fields: [
          { id: 'name', type: 'text', field: 'name', label: 'Name', required: true },
          { id: 'email', type: 'email', field: 'email', label: 'Email' },
        ]
      }],
      actions: [{ id: 'save', type: 'submit', label: 'Save', variant: 'primary' }]
    };
  }, [ready]);

  if (!ready) return <div>Loading...</div>;
  return <zentto-studio-renderer ref={ref} />;
}
```

---

## Packages

| Package | Description | Size |
|---------|-------------|------|
| [`@zentto/studio-core`](https://www.npmjs.com/package/@zentto/studio-core) | Logic engine: types, schema validation, expressions, data binding, rules, i18n | ~60 KB |
| [`@zentto/studio`](https://www.npmjs.com/package/@zentto/studio) | Web components (Lit 3.x): renderer, designer, app shell, fields, modals | ~90 KB |
| [`@zentto/studio-react`](https://www.npmjs.com/package/@zentto/studio-react) | React wrapper via `@lit/react` with event bindings | ~2 KB |

---

## Components

### `<zentto-studio-renderer>`

Renders a `StudioSchema` as a dynamic form with validation, data binding, and actions.

```html
<zentto-studio-renderer></zentto-studio-renderer>
```

**Props:** `schema`, `data`, `themeMode`
**Events:** `studio-change`, `studio-submit`, `studio-action`

### `<zentto-studio-app>`

Full application shell — sidebar, header, routing, pages — from an `AppConfig`.

```html
<zentto-studio-app></zentto-studio-app>
```

**Props:** `config`, `provider`, `customCss`, `cssVars`
**Events:** `app-navigate`, `app-action`, `app-submit`, `app-row-click`

### `<zs-page-designer>`

Visual form designer with drag-drop, undo/redo, autosave, API connection, and templates.

```html
<zs-page-designer auto-save-ms="2000"></zs-page-designer>
```

**Props:** `schema`, `data`, `provider`, `autoSaveMs`
**Events:** `schema-change`, `auto-save`, `api-connected`, `api-login`

### `<zs-app-wizard>`

Step-by-step wizard to create an `AppConfig` from a template.

```html
<zs-app-wizard></zs-app-wizard>
```

**Events:** `wizard-complete`

### Dialogs

```html
<zs-modal open title="Confirm" variant="danger" okText="Delete">
  Are you sure?
</zs-modal>

<zs-toast position="top-right"></zs-toast>

<zs-confirm-dialog></zs-confirm-dialog>
```

---

## Field Types

| Category | Types |
|----------|-------|
| **Basic** | `text`, `textarea`, `number`, `currency`, `percentage`, `date`, `time`, `datetime`, `select`, `multiselect`, `radio`, `checkbox`, `switch`, `email`, `url`, `password`, `phone` |
| **Advanced** | `color`, `richtext`, `code`, `signature`, `slider`, `rating`, `tags`, `chips`, `address`, `qr-scanner`, `barcode-scanner` |
| **Data** | `lookup`, `datagrid`, `report`, `chart`, `treeview` |
| **Media** | `file`, `image`, `media` |
| **Layout** | `html`, `separator`, `heading` |

---

## Expression Engine

Safe recursive-descent parser (no `eval()`). Used in visibility rules, computed values, and validation.

```
{precio} * {cantidad}                          → arithmetic
{role} == "admin" AND {total} > 1000           → conditions
IF({activo}, "Si", "No")                       → logic
UPPER(LEFT({nombre}, 1)) & ". " & {apellido}   → string
DATEDIFF({inicio}, {fin}, "days")              → dates
ROUND({subtotal} * 0.16, 2)                    → math
```

**50+ built-in functions:** `IF`, `SWITCH`, `COALESCE`, `SUM`, `AVG`, `MIN`, `MAX`, `ROUND`, `ABS`, `UPPER`, `LOWER`, `LEFT`, `RIGHT`, `LEN`, `TRIM`, `CONTAINS`, `REPLACE`, `NOW`, `TODAY`, `YEAR`, `MONTH`, `DAY`, `DATEADD`, `DATEDIFF`, `FIELD`, `ROLE_IS`, `ISEMPTY`, and more.

---

## Provider System

Inject your host app's icons, components, auth, and services into Studio:

```tsx
const provider = {
  // MUI icons inside Studio
  resolveIcon: (name, props) => {
    const Icon = MuiIcons[name];
    return Icon ? renderToStaticMarkup(<Icon />) : name;
  },

  // Your auth headers for API calls
  getAuthHeaders: () => ({ Authorization: `Bearer ${token}` }),

  // Your router
  navigate: (path) => router.push(path),

  // Your custom components
  customFields: {
    'my-datepicker': { tagName: 'my-fancy-datepicker', label: 'DatePicker', icon: 'calendar' },
  },
};

<zentto-studio-app .config={config} .provider={provider} />
```

---

## Examples

See the [`examples/`](examples/) directory for integration guides:

- [Vanilla JS](examples/vanilla/)
- [React / Next.js](examples/react-nextjs/)
- [Vue 3](examples/vue/)
- [Angular](examples/angular/)
- [Vite](examples/vite/)
- [.NET Blazor](examples/blazor/)

---

## Documentation

- [Developer Guide](docs/developer-guide.md) — API reference, types, architecture
- [User Guide](docs/user-guide.md) — How to use the designer, connect APIs, create templates
- [Expression Reference](docs/expressions.md) — Complete function list and syntax
- [Theming](docs/theming.md) — CSS custom properties and dark mode

---

## Related Packages

Zentto Studio is part of the broader **Zentto** ecosystem:

| Package | Description |
|---------|-------------|
| [`@zentto/datagrid`](https://github.com/zentto-erp/zentto-datagrid) | High-performance data grid web component (90+ features) |
| [`@zentto/report-core`](https://github.com/zentto-erp/zentto-report) | Report engine — Crystal Reports alternative |
| [`@zentto/cache`](https://github.com/zentto-erp/zentto-cache) | Redis caching microservice for layouts and templates |
| [`zentto-landing-designer`](https://github.com/zentto-erp/zentto-landing-designer) | Visual builder for landing pages and blogs (built on Studio) |
| [`zentto-sites`](https://github.com/zentto-erp/zentto-sites) | API to publish and manage static sites |
| [`zentto-web`](https://github.com/zentto-erp/zentto-web) | Zentto ERP core platform |
| [`zentto-erp-docs`](https://github.com/zentto-erp/zentto-erp-docs) | Official documentation |

---

## Development

```bash
# Install
npm install

# Build all packages
npx turbo build

# Run tests
npx turbo test

# Watch mode
npx turbo dev
```

### Contributing

- Branch from `developer`, PR to `developer`, final merge to `main`.
- No co-authors in commit messages.
- Never use `<table>` HTML — always use `@zentto/datagrid`.
- Keep packages framework-agnostic whenever possible.

## License

MIT

---

<p align="center">
  Made with care by the <a href="https://zentto.net">Zentto</a> team
</p>
