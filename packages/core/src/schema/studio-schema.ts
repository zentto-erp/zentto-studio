// @zentto/studio-core — Zod schema validation for StudioSchema

import { z } from 'zod';

// ─── Field Types ──────────────────────────────────────────────────

export const fieldTypeSchema = z.enum([
  'text', 'textarea', 'number', 'currency', 'percentage',
  'date', 'time', 'datetime',
  'select', 'multiselect', 'radio', 'checkbox', 'switch',
  'file', 'image',
  'color', 'richtext', 'code', 'signature',
  'qr-scanner', 'barcode-scanner',
  'address', 'phone', 'email', 'url', 'password',
  'slider', 'rating', 'tags',
  'lookup',
  'datagrid', 'report', 'chart',
  'html', 'separator', 'heading', 'media',
  'chips', 'treeview',
  'custom',
]);

// ─── Validation Rules ─────────────────────────────────────────────

const validationRuleSchema = z.object({
  type: z.enum(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern', 'email', 'url', 'custom']),
  value: z.unknown().optional(),
  message: z.string().optional(),
  expression: z.string().optional(),
});

// ─── Field Config ─────────────────────────────────────────────────

const fieldConfigSchema = z.object({
  id: z.string().min(1),
  type: fieldTypeSchema,
  field: z.string().min(1),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.unknown().optional(),
  required: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
  width: z.union([z.string(), z.number()]).optional(),
  colSpan: z.number().int().min(1).optional(),
  validation: z.array(validationRuleSchema).optional(),
  visibilityRule: z.string().optional(),
  computedValue: z.string().optional(),
  style: z.record(z.string(), z.string()).optional(),
  cssClass: z.string().optional(),
  props: z.record(z.string(), z.unknown()).optional(),
  i18nKey: z.string().optional(),
  helpText: z.string().optional(),
});

// ─── Layout ───────────────────────────────────────────────────────

const responsiveBreakpointSchema = z.object({
  maxWidth: z.number().positive(),
  columns: z.number().int().min(1),
});

const layoutConfigSchema = z.object({
  type: z.enum(['form', 'grid', 'tabs', 'wizard', 'accordion', 'dashboard', 'master-detail']),
  columns: z.number().int().min(1).optional(),
  gap: z.number().min(0).optional(),
  labelPosition: z.enum(['top', 'left', 'inline']).optional(),
  responsive: z.array(responsiveBreakpointSchema).optional(),
});

// ─── Sections ─────────────────────────────────────────────────────

const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  fields: z.array(fieldConfigSchema),
  collapsible: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  columns: z.number().int().min(1).optional(),
  visibilityRule: z.string().optional(),
  validationRule: z.string().optional(),
});

// ─── Data Sources ─────────────────────────────────────────────────

const paginationConfigSchema = z.object({
  type: z.enum(['offset', 'cursor']),
  pageSize: z.number().int().positive(),
  pageSizeParam: z.string().optional(),
  pageParam: z.string().optional(),
  cursorParam: z.string().optional(),
});

const dataSourceConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['rest', 'graphql', 'static', 'computed']),
  url: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.unknown().optional(),
  transform: z.string().optional(),
  autoFetch: z.boolean().optional(),
  refreshInterval: z.number().int().positive().optional(),
  dependsOn: z.array(z.string()).optional(),
  pagination: paginationConfigSchema.optional(),
  staticData: z.unknown().optional(),
});

// ─── Actions ──────────────────────────────────────────────────────

const actionConfigSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['submit', 'apiCall', 'navigate', 'openModal', 'print', 'reset', 'custom']),
  label: z.string().min(1),
  icon: z.string().optional(),
  variant: z.enum(['primary', 'secondary', 'danger', 'ghost']).optional(),
  position: z.enum(['top', 'bottom', 'inline']).optional(),
  disabled: z.boolean().optional(),
  disabledRule: z.string().optional(),
  confirmMessage: z.string().optional(),
  url: z.string().optional(),
  method: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  navigateTo: z.string().optional(),
  schemaId: z.string().optional(),
  eventName: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
});

// ─── Rules ────────────────────────────────────────────────────────

const ruleActionSchema = z.object({
  type: z.enum(['show', 'hide', 'enable', 'disable', 'setValue', 'setStyle', 'validate', 'setRequired']),
  target: z.string().min(1),
  value: z.unknown().optional(),
});

const ruleSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  condition: z.string().min(1),
  actions: z.array(ruleActionSchema).min(1),
  priority: z.number().int().optional(),
});

// ─── Permissions / Flavors ────────────────────────────────────────

const flavorOverrideSchema = z.object({
  fieldId: z.string().min(1),
  hidden: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  disabled: z.boolean().optional(),
  defaultValue: z.unknown().optional(),
  label: z.string().optional(),
});

const flavorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  roles: z.array(z.string()).min(1),
  overrides: z.array(flavorOverrideSchema),
});

const permissionConfigSchema = z.object({
  flavors: z.array(flavorSchema),
  defaultFlavorId: z.string().optional(),
});

// ─── Theme ────────────────────────────────────────────────────────

const themeConfigSchema = z.object({
  mode: z.enum(['light', 'dark', 'auto']).optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  borderRadius: z.number().min(0).optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().positive().optional(),
  spacing: z.number().min(0).optional(),
  tokens: z.record(z.string(), z.string()).optional(),
});

// ─── i18n ─────────────────────────────────────────────────────────

const i18nConfigSchema = z.object({
  defaultLocale: z.string().min(2),
  translations: z.record(z.string(), z.record(z.string(), z.string())).optional(),
});

// ─── StudioSchema (Root) ──────────────────────────────────────────

export const studioSchemaValidator = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  layout: layoutConfigSchema,
  theme: themeConfigSchema.optional(),
  dataSources: z.array(dataSourceConfigSchema).optional(),
  sections: z.array(sectionSchema).min(1),
  actions: z.array(actionConfigSchema).optional(),
  rules: z.array(ruleSchema).optional(),
  permissions: permissionConfigSchema.optional(),
  i18n: i18nConfigSchema.optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

// ─── Validation Functions ─────────────────────────────────────────

/** Validate a StudioSchema, returns parsed schema or throws ZodError */
export function validateSchema(data: unknown) {
  return studioSchemaValidator.parse(data);
}

/** Safe validation — returns { success, data, error } */
export function safeValidateSchema(data: unknown) {
  return studioSchemaValidator.safeParse(data);
}
