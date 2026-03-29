# Developer Guide

## Architecture

Zentto Studio is a monorepo with 3 npm packages:

```
@zentto/studio-core    → Pure logic (types, validation, expressions, data binding)
@zentto/studio         → Lit web components (renderer, designer, fields, modals)
@zentto/studio-react   → React wrapper via @lit/react
```

Core has zero UI dependencies. Web component depends on `lit ^3.2.0`. React depends on `@lit/react`.

## Types

### StudioSchema (Form definition)

```typescript
interface StudioSchema {
  id: string;
  version: string;
  title: string;
  description?: string;
  layout: LayoutConfig;          // type, columns, gap, responsive breakpoints
  theme?: ThemeConfig;
  dataSources?: DataSourceConfig[];
  sections: Section[];           // groups of fields
  actions?: ActionConfig[];      // buttons (submit, reset, custom)
  rules?: Rule[];                // conditional logic
  permissions?: PermissionConfig; // role-based field visibility (Flavors)
  i18n?: I18nConfig;
}
```

### FieldConfig (Single field)

```typescript
interface FieldConfig {
  id: string;
  type: FieldType;              // 'text' | 'number' | 'select' | 'datagrid' | ...
  field: string;                // data binding path: "customer.address.city"
  label?: string;
  placeholder?: string;
  defaultValue?: unknown;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  colSpan?: number;             // grid columns to span
  validation?: ValidationRule[];
  visibilityRule?: string;      // expression: '{role} == "admin"'
  computedValue?: string;       // expression: '{precio} * {cantidad}'
  props?: Record<string, unknown>; // type-specific properties
}
```

### AppConfig (Full app definition)

```typescript
interface AppConfig {
  id: string;
  branding: BrandingConfig;     // logo, title, sidebar style
  navigation: NavItem[];        // sidebar menu (pages, headers, dividers)
  pages: PageConfig[];          // content for each route
  dataSources?: DataSourceConfig[];
  headers?: Record<string, string>;
  theme?: ThemeConfig;
  user?: UserContext;           // role-based filtering
  notifications?: NotificationConfig[];
}
```

### PageConfig

```typescript
interface PageConfig {
  id: string;
  segment: string;              // URL segment for routing
  title: string;
  content: 'schema' | 'datagrid' | 'cards' | 'chart' | 'html' | 'iframe' | 'tabs' | 'custom' | 'empty';
  dataSources?: DataSourceConfig[];
  schema?: StudioSchema;        // for content='schema'
  gridConfig?: GridPageConfig;  // for content='datagrid'
  cardsConfig?: CardsPageConfig; // for content='cards'
  chartConfig?: ChartPageConfig; // for content='chart'
  actions?: ActionConfig[];
  roles?: string[];             // access control
}
```

## Expression Engine

The expression engine is a recursive-descent parser (forked from `@zentto/report-core`). It never uses `eval()`.

### Syntax

- Field references: `{fieldName}` or `{customer.address.city}`
- Operators: `+`, `-`, `*`, `/`, `%`, `^`, `&` (concat)
- Comparisons: `==`, `!=`, `<>`, `<`, `>`, `<=`, `>=`
- Logic: `AND`, `OR`, `NOT`
- Literals: `"string"`, `123`, `true`, `false`, `null`

### Usage

```typescript
import { evaluateExpression, evaluateCondition } from '@zentto/studio-core';

// Arithmetic
evaluateExpression('{precio} * {cantidad}', { formData: { precio: 10, cantidad: 5 } });
// → 50

// Condition (returns boolean)
evaluateCondition('{role} == "admin"', { formData: { role: 'admin' }, dataSources: {} });
// → true

// Register custom function
import { registerFunction } from '@zentto/studio-core';
registerFunction('TAX', (args) => Number(args[0]) * 0.16);
```

## Data Binding

Two-way binding using `Proxy` with dot-notation path resolution.

```typescript
import { DataModel, EventBus } from '@zentto/studio-core';

const bus = new EventBus();
const model = new DataModel({ name: 'Juan', age: 25 }, bus);

bus.on('field:change', ({ fieldId, value, previousValue }) => {
  console.log(`${fieldId} changed: ${previousValue} → ${value}`);
});

model.setValue('f1', 'name', 'Pedro'); // triggers event
model.getValue('name'); // 'Pedro'
model.isDirty(); // true
model.reset(); // back to 'Juan'
```

## Validation

```typescript
import { validateField } from '@zentto/studio-core';

const field = { id: 'email', type: 'email', field: 'email', required: true };
const result = validateField(field, 'invalid', { formData: {}, dataSources: {} });
// { valid: false, errors: ['Email invalido'] }
```

Validation types: `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`, `url`, `custom` (expression).

## Provider System

The `StudioProvider` interface allows host apps to inject services:

```typescript
interface StudioProvider {
  resolveIcon?: (name: string, props?) => string;      // HTML string
  resolveComponent?: (name: string, props) => string;  // HTML string
  renderPage?: (pageId: string, data) => string;       // HTML string
  handleAction?: (actionId, type, data) => Promise<Result>;
  fetchData?: (url, options) => Promise<unknown>;
  notify?: (type, title, message?) => void;
  confirm?: (title, message, options?) => Promise<boolean>;
  navigate?: (path: string) => void;
  getUser?: () => User | null;
  getAuthHeaders?: () => Record<string, string>;
  customFields?: Record<string, FieldRendererMeta>;
}
```

## Events

All components emit `CustomEvent` with `bubbles: true, composed: true`.

| Component | Event | Detail |
|-----------|-------|--------|
| `<zentto-studio-renderer>` | `studio-change` | `{ fieldId, field, value, data }` |
| `<zentto-studio-renderer>` | `studio-submit` | `{ actionId, data }` |
| `<zentto-studio-app>` | `app-navigate` | `{ segment, page }` |
| `<zentto-studio-app>` | `app-action` | `{ actionId, page, data }` |
| `<zentto-studio-app>` | `app-row-click` | `{ page, row }` |
| `<zs-page-designer>` | `schema-change` | `{ schema }` |
| `<zs-page-designer>` | `auto-save` | `{ schema }` |
| `<zs-page-designer>` | `api-login` | `{ token, user, company, baseUrl }` |
| `<zs-app-wizard>` | `wizard-complete` | `{ config }` |
| `<zs-modal>` | `modal-confirm` | `{}` |
| `<zs-toast>` | `toast-action` | `{ id, actionId }` |

## Theming

Override CSS custom properties:

```css
zentto-studio-renderer {
  --zs-primary: #8e44ad;
  --zs-primary-hover: #7d3c98;
  --zs-radius: 12px;
  --zs-font-family: 'Inter', sans-serif;
  --zs-font-size: 15px;
}
```

Or use the `cssVars` prop:

```js
el.cssVars = { '--zs-primary': '#8e44ad', '--zs-radius': '12px' };
```

Full token list: `--zs-primary`, `--zs-accent`, `--zs-danger`, `--zs-success`, `--zs-warning`, `--zs-bg`, `--zs-bg-secondary`, `--zs-text`, `--zs-text-secondary`, `--zs-border`, `--zs-radius`, `--zs-font-family`, `--zs-font-size`, `--zs-spacing-*`, `--zs-input-height`.
