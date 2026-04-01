# User Guide — Zentto Studio

## What is Zentto Studio?

Zentto Studio lets you create forms, dashboards, and full applications **without writing code**. You design visually, connect to your API, and deploy instantly.

## The Designer

Open the **Studio Designer** and you'll see 3 panels:

### Left Panel — Toolbox

**Campos tab:** Drag fields from the toolbox to the canvas:
- **Basicos:** Text, Number, Currency, Date, Select, Checkbox, Switch, Email, Phone, Password
- **Avanzados:** Color, Rich Text, Code Editor, Signature, Slider, Rating, Tags, Chips, Address
- **Datos:** Lookup, DataGrid, Report, Chart, TreeView
- **Media:** File Upload, Image, Media Player
- **Layout:** Heading, Separator, HTML

**Secciones tab:** Manage form sections (add, reorder, rename).

**API tab:** Connect to your backend:
1. Enter your credentials (user, password, company)
2. Click **Iniciar Sesion**
3. Use quick links (Clientes, Articulos, Facturas...) or type any endpoint
4. Click **Probar Conexion** — fields are detected automatically
5. Drag API fields to the canvas — they auto-bind

### Center — Canvas

Your form design. Each field shows:
- **Type badge** (top-left, color-coded)
- **Action buttons** (top-right): move up/down, duplicate, delete
- **Resize handles** (8 points when selected)

**Views:**
- **Diseño** — Edit mode with drag-drop
- **Preview** — Live rendered form
- **JSON** — Raw schema (copy to clipboard)

### Right Panel — Properties

Click any field to edit its properties:

- **General:** Label, field binding, placeholder, help text
- **Layout:** Column span, field type, CSS class
- **Estilo:** Width (auto/100%/50%)
- **Comportamiento:** Required, read-only, disabled, hidden (toggle switches)
- **Reglas:** Visibility condition, computed value, default value
- **Origen de Datos:** API endpoint, value/display fields

### Templates

Click **Plantillas** in the toolbar to load a pre-built form:
- Blank, Contact, Client, Employee, Invoice, Product, Survey

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Double-click toolbox item | Add field to canvas |
| Click field on canvas | Select (shows properties) |
| Click empty area | Deselect |

## The App Builder

Use `<zentto-studio-app>` to create full applications:

1. Define navigation (sidebar menu with pages, headers, dividers)
2. Define pages (cards dashboard, data grid, form, charts, HTML, iframe)
3. Set branding (logo, title, colors, sidebar style)
4. Set user context (name, roles — for access control)

Each page type renders differently:
- **cards** — Icon grid (like a dashboard home)
- **datagrid** — Table with data from API
- **schema** — Form with validation
- **chart** — SVG charts (bar, line, pie, donut)
- **html** / **iframe** — Custom content

## Connecting to APIs

In the designer's API tab:
1. Leave **URL Base** empty (uses your app's proxy — recommended)
2. Enter user/password for your Zentto ERP
3. Click login
4. Select an endpoint from quick links or type custom URL
5. Click **Probar Conexion**
6. Detected fields appear — drag them to your form

The login session persists while the designer is open. All API calls include the auth token automatically.

## Saving Your Work

Currently, designs are exported as JSON. Copy the JSON from the **JSON view** and save it in your project. In the next version, designs will be saved automatically to the cloud via `@zentto/cache`.

## Landing Page Designer

The **Landing Designer** (`<zs-landing-designer>`) lets you build landing pages visually.

### Opening the Designer

```html
<script type="module">
  import '@zentto/studio/landing';
  import '@zentto/studio/landing-designer';
</script>

<zs-landing-designer></zs-landing-designer>
```

### How to Use

1. **Pick a template** — Click "Templates" in the toolbar and choose from 15 pre-built designs (SaaS, Portfolio, E-Commerce, Blog, etc.)
2. **Add sections** — Click "Add Section" to insert any of the 14 section types (Hero, Features, Pricing, Testimonials, FAQ, etc.)
3. **Reorder sections** — Drag sections up/down in the sidebar
4. **Edit properties** — Click any section to open the property panel. Edit text, images, colors, layout variant
5. **Change theme** — Use the theme preset picker to switch between 8 color schemes (Indigo, Emerald, Rose, Midnight, etc.)
6. **Preview** — Click "Preview" to see the live landing page
7. **Save** — The `designer-save` event fires with the full `AppConfig` JSON

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+S | Save |

---

## Creating a Landing Page

### Step 1: Pick a Template

```ts
import { getLandingTemplate, listLandingTemplates } from '@zentto/studio-core';

// See all available templates
const templates = listLandingTemplates();
// → [{ id: 'saas-startup', name: 'SaaS Startup', category: 'saas', ... }, ...]

// Get one
const config = getLandingTemplate('saas-startup');
```

### Step 2: Customize

Edit the config JSON to change text, images, colors, and sections. Or use the visual designer.

### Step 3: Apply a Theme Preset

```ts
import { applyThemePresetToConfig, getThemePreset } from '@zentto/studio-core';

const preset = getThemePreset('emerald');
const themed = applyThemePresetToConfig(config, preset);
```

### Step 4: Render

```html
<zentto-studio-app id="app"></zentto-studio-app>
<script>
  document.getElementById('app').config = themed;
</script>
```

---

## Blog Setup

### Adding a Blog Page

Add a page with `content: 'blog-list'` to your AppConfig:

```json
{
  "id": "blog",
  "segment": "blog",
  "title": "Blog",
  "content": "blog-list",
  "blogListConfig": {
    "dataSourceId": "posts",
    "layout": "grid",
    "columns": 3,
    "showCategories": true,
    "showSearch": true
  }
}
```

### Blog Post Page

Add a page with `content: 'blog-post'`:

```json
{
  "id": "blog-post",
  "segment": "blog/:slug",
  "title": "Post",
  "content": "blog-post",
  "blogPostConfig": {
    "dataSourceId": "posts",
    "layout": "standard",
    "showAuthor": true,
    "showDate": true,
    "showRelatedPosts": true
  }
}
```

Blog posts support Markdown content and auto-generate JSON-LD Article schema for SEO.

### Blog Layouts

- **grid** — Cards in a 2 or 3 column grid
- **list** — Full-width horizontal cards
- **magazine** — Featured post large, rest in grid

---

## Theme Presets

Zentto Studio includes 8 theme presets you can apply to any landing page:

| Preset | Primary Color | Style |
|--------|--------------|-------|
| **Indigo** | `#6366f1` | Modern SaaS default |
| **Emerald** | `#10b981` | Fresh and natural |
| **Rose** | `#f43f5e` | Bold and energetic |
| **Amber** | `#f59e0b` | Warm and inviting |
| **Ocean** | `#0ea5e9` | Clean and professional |
| **Slate** | `#475569` | Minimal and elegant |
| **Midnight** | `#818cf8` | Dark mode preset |
| **Sunset** | `#fb923c` | Warm orange tones |

Apply via the designer's theme picker or programmatically with `applyThemePresetToConfig()`.

---

## Using in Your App

Once you have a schema JSON, render it in your app:

```html
<zentto-studio-renderer id="myForm"></zentto-studio-renderer>
<script>
  document.getElementById('myForm').schema = /* your JSON */;
  document.getElementById('myForm').addEventListener('studio-submit', (e) => {
    console.log('Form data:', e.detail.data);
    // Send to your API
  });
</script>
```
