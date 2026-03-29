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
