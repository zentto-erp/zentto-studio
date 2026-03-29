// @zentto/studio-core — Public API

// Types (re-export everything)
export type {
  FieldType, LayoutType, LayoutConfig, ResponsiveBreakpoint,
  FieldConfig, SelectOption, LookupConfig,
  ValidationType, ValidationRule,
  DataSourceType, DataSourceConfig, PaginationConfig,
  ActionType, ActionConfig,
  RuleActionType, RuleAction, Rule,
  Section,
  FlavorOverride, Flavor, PermissionConfig,
  ThemeConfig, I18nConfig,
  StudioSchema,
  FieldState, FormState,
  StudioEventMap, StudioBindingContext,
  FieldCategory, FieldRendererMeta,
} from './types.js';

// Schema validation
export {
  studioSchemaValidator,
  validateSchema,
  safeValidateSchema,
} from './schema/studio-schema.js';

// Expression engine
export {
  evaluateExpression,
  safeEvaluateExpression,
  evaluateCondition,
  registerFunction,
  ExprError,
} from './engine/expression.js';

// Data binding
export {
  DataModel,
  getDeepValue,
  setDeepValue,
} from './engine/data-binding.js';

// Validation
export {
  validateField,
  validateAllFields,
} from './engine/validation.js';

// Rule engine
export {
  evaluateRules,
  applyRulesToModel,
} from './engine/rule-engine.js';
export type { RuleResult } from './engine/rule-engine.js';

// Action engine
export {
  isActionEnabled,
  executeAction,
} from './engine/action-engine.js';
export type { ActionExecutionResult } from './engine/action-engine.js';

// Event bus
export { EventBus } from './events/event-bus.js';

// Field registry
export {
  registerField,
  getFieldMeta,
  getFieldTag,
  getAllFields,
  getFieldsByCategory,
} from './registry/field-registry.js';

// Layout
export {
  solveGridLayout,
  getResponsiveColumns,
  generateResponsiveCSS,
} from './layout/grid-solver.js';
export type { GridLayoutResult } from './layout/grid-solver.js';

// i18n
export { t, setLocale, getLocale, registerLocale } from './i18n/i18n.js';

// Data sources
export {
  fetchAllDataSources,
  setupPolling,
} from './data/data-source.js';
export type { FetchedDataSources } from './data/data-source.js';

export {
  flattenObject,
  unflattenObject,
  pickFields,
} from './data/data-transformer.js';

// Persistence
export {
  saveSchemaLocal,
  loadSchemaLocal,
  deleteSchemaLocal,
  listSchemasLocal,
  saveSchemaRemote,
  loadSchemaRemote,
  listSchemasRemote,
  loadSchemaWithSync,
  saveSchemaWithSync,
} from './persistence/schema-store.js';
export type { RemoteStoreConfig } from './persistence/schema-store.js';

// Flavors
export {
  resolveFlavor,
  applyFlavor,
  applyFlavorToSchema,
} from './persistence/flavor-manager.js';

// App-level types
export type {
  NavItem, NavItemKind,
  PageConfig, PageContentType,
  GridPageConfig, GridColumnDef, CrudConfig,
  ReportPageConfig,
  CardsPageConfig, CardItem,
  TabsPageConfig, SplitPageConfig, ChartPageConfig,
  BrandingConfig, UserContext,
  AppConfig, NotificationConfig,
} from './app-types.js';

// App templates
export {
  TEMPLATE_BLANK, TEMPLATE_CRM, TEMPLATE_ECOMMERCE, TEMPLATE_HR,
  APP_TEMPLATES, getAppTemplate, listAppTemplates,
} from './templates/app-templates.js';
export type { AppTemplateId } from './templates/app-templates.js';

// Provider system
export type {
  IconResolver, ComponentResolver, PageRenderer,
  ActionHandler, DataFetcher, NotificationHandler, ConfirmHandler,
  StudioProvider,
} from './providers.js';
export { DEFAULT_PROVIDER, mergeProviders, resolveIcon } from './providers.js';
