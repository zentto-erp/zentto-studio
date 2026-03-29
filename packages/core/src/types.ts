// @zentto/studio-core — Central type definitions
// All public interfaces for the Zentto Studio runtime UI builder

// ─── Field Types ──────────────────────────────────────────────────

export type FieldType =
  | 'text' | 'textarea' | 'number' | 'currency' | 'percentage'
  | 'date' | 'time' | 'datetime'
  | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'switch'
  | 'file' | 'image'
  | 'color' | 'richtext' | 'code' | 'signature'
  | 'qr-scanner' | 'barcode-scanner'
  | 'address' | 'phone' | 'email' | 'url' | 'password'
  | 'slider' | 'rating' | 'tags'
  | 'lookup'
  | 'datagrid' | 'report' | 'chart'
  | 'html' | 'separator' | 'heading' | 'media'
  | 'chips' | 'treeview'
  | 'button' | 'link' | 'spacer' | 'icon' | 'alert' | 'badge'
  | 'card' | 'tabs' | 'accordion' | 'progress' | 'avatar'
  | 'custom';

// ─── Layout Types ─────────────────────────────────────────────────

export type LayoutType = 'form' | 'grid' | 'tabs' | 'wizard' | 'accordion' | 'dashboard' | 'master-detail';

export interface LayoutConfig {
  type: LayoutType;
  columns?: number;          // for grid layout (default 1)
  gap?: number;              // px between fields
  labelPosition?: 'top' | 'left' | 'inline';
  responsive?: ResponsiveBreakpoint[];
}

export interface ResponsiveBreakpoint {
  maxWidth: number;          // px breakpoint
  columns: number;           // columns at this width
}

// ─── Field Configuration ──────────────────────────────────────────

export interface FieldConfig {
  id: string;
  type: FieldType;
  field: string;             // data binding path (dot notation: "customer.address.city")
  label?: string;
  placeholder?: string;
  defaultValue?: unknown;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  width?: string | number;   // CSS value or grid span
  colSpan?: number;          // grid columns to span (default 1)
  validation?: ValidationRule[];
  visibilityRule?: string;   // expression: "{role} == 'admin'"
  computedValue?: string;    // expression: "{precio} * {cantidad}"
  style?: Record<string, string>;
  cssClass?: string;
  props?: Record<string, unknown>; // type-specific properties
  i18nKey?: string;
  helpText?: string;
}

// ─── Select/Lookup Options ────────────────────────────────────────

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface LookupConfig {
  dataSourceId: string;
  valueField: string;
  displayField: string;
  searchFields?: string[];
  minChars?: number;         // min chars before search (default 2)
  debounceMs?: number;       // debounce for search (default 300)
}

// ─── Validation ───────────────────────────────────────────────────

export type ValidationType =
  | 'required' | 'min' | 'max' | 'minLength' | 'maxLength'
  | 'pattern' | 'email' | 'url' | 'custom';

export interface ValidationRule {
  type: ValidationType;
  value?: unknown;           // min value, max value, pattern string, etc.
  message?: string;          // custom error message
  expression?: string;       // for 'custom' type — expression that must return true
}

// ─── Data Sources ─────────────────────────────────────────────────

export type DataSourceType = 'rest' | 'graphql' | 'static' | 'computed';

export interface DataSourceConfig {
  id: string;
  name: string;
  type: DataSourceType;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  transform?: string;        // expression to map response data
  autoFetch?: boolean;        // fetch on load (default true)
  refreshInterval?: number;   // ms, for polling
  dependsOn?: string[];       // other data source IDs (fetch after them)
  pagination?: PaginationConfig;
  staticData?: unknown;       // for 'static' type
}

export interface PaginationConfig {
  type: 'offset' | 'cursor';
  pageSize: number;
  pageSizeParam?: string;
  pageParam?: string;
  cursorParam?: string;
}

// ─── Actions ──────────────────────────────────────────────────────

export type ActionType = 'submit' | 'apiCall' | 'navigate' | 'openModal' | 'print' | 'reset' | 'custom';

export interface ActionConfig {
  id: string;
  type: ActionType;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  position?: 'top' | 'bottom' | 'inline';
  disabled?: boolean;
  disabledRule?: string;     // expression
  confirmMessage?: string;   // show confirmation dialog before executing
  // Type-specific config
  url?: string;              // for submit/apiCall
  method?: string;           // for submit/apiCall
  headers?: Record<string, string>;
  navigateTo?: string;       // for navigate
  schemaId?: string;         // for openModal
  eventName?: string;        // for custom — event name to emit
  successMessage?: string;
  errorMessage?: string;
}

// ─── Rules (Conditional Logic) ────────────────────────────────────

export type RuleActionType = 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'setStyle' | 'validate' | 'setRequired';

export interface RuleAction {
  type: RuleActionType;
  target: string;            // field ID or section ID
  value?: unknown;           // for setValue, setStyle
}

export interface Rule {
  id: string;
  name?: string;
  condition: string;         // expression engine syntax
  actions: RuleAction[];
  priority?: number;         // higher = evaluated first (default 0)
}

// ─── Sections ─────────────────────────────────────────────────────

export interface Section {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  fields: FieldConfig[];
  collapsible?: boolean;
  collapsed?: boolean;       // initial state for accordion
  columns?: number;          // override layout columns for this section
  visibilityRule?: string;   // expression for section-level visibility
  // Wizard-specific
  validationRule?: string;   // expression that must pass to advance to next step
}

// ─── Permissions / Flavors ────────────────────────────────────────

export interface FlavorOverride {
  fieldId: string;
  hidden?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  defaultValue?: unknown;
  label?: string;            // override label for this flavor
}

export interface Flavor {
  id: string;
  name: string;
  description?: string;
  roles: string[];           // which roles see this flavor
  overrides: FlavorOverride[];
}

export interface PermissionConfig {
  flavors: Flavor[];
  defaultFlavorId?: string;
}

// ─── Theme ────────────────────────────────────────────────────────

export interface ThemeConfig {
  mode?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  accentColor?: string;
  borderRadius?: number;
  fontFamily?: string;
  fontSize?: number;
  spacing?: number;
  tokens?: Record<string, string>; // custom --zs-* CSS variables
}

// ─── i18n ─────────────────────────────────────────────────────────

export interface I18nConfig {
  defaultLocale: string;
  translations?: Record<string, Record<string, string>>; // { "es": { "save": "Guardar" } }
}

// ─── StudioSchema (Root Document) ─────────────────────────────────

export interface StudioSchema {
  id: string;
  version: string;
  title: string;
  description?: string;
  layout: LayoutConfig;
  theme?: ThemeConfig;
  dataSources?: DataSourceConfig[];
  sections: Section[];
  actions?: ActionConfig[];
  rules?: Rule[];
  permissions?: PermissionConfig;
  i18n?: I18nConfig;
  meta?: Record<string, unknown>; // extension point
}

// ─── Runtime State ────────────────────────────────────────────────

export interface FieldState {
  value: unknown;
  errors: string[];
  touched: boolean;
  dirty: boolean;
  visible: boolean;
  enabled: boolean;
  required: boolean;
  readOnly: boolean;
}

export interface FormState {
  data: Record<string, unknown>;
  fields: Map<string, FieldState>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  activeSection: number;     // for wizard/tabs
}

// ─── Event Types ──────────────────────────────────────────────────

export interface StudioEventMap {
  'field:change': { fieldId: string; field: string; value: unknown; previousValue: unknown };
  'field:focus': { fieldId: string };
  'field:blur': { fieldId: string };
  'field:validate': { fieldId: string; errors: string[] };
  'section:change': { sectionIndex: number };
  'action:execute': { actionId: string; type: ActionType; data: Record<string, unknown> };
  'action:success': { actionId: string; response: unknown };
  'action:error': { actionId: string; error: Error };
  'datasource:loading': { sourceId: string };
  'datasource:loaded': { sourceId: string; data: unknown };
  'datasource:error': { sourceId: string; error: Error };
  'schema:change': { schema: StudioSchema };
  'flavor:change': { flavorId: string };
  'form:submit': { data: Record<string, unknown> };
  'form:reset': {};
  'form:valid': { isValid: boolean };
}

// ─── Expression Context ───────────────────────────────────────────

export interface StudioBindingContext {
  formData: Record<string, unknown>;
  dataSources: Record<string, unknown>;
  user?: { id?: string; roles?: string[]; email?: string };
  parameters?: Record<string, unknown>;
  locale?: string;
}

// ─── Field Registry ───────────────────────────────────────────────

export type FieldCategory = 'basic' | 'advanced' | 'layout' | 'data' | 'media' | 'custom';

export interface FieldRendererMeta {
  type: FieldType;
  tagName: string;           // web component tag name
  label: string;             // display name in designer toolbox
  icon: string;              // icon identifier
  category: FieldCategory;
  defaultProps?: Record<string, unknown>;
  defaultValidation?: ValidationRule[];
}
