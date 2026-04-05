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
  // Landing page types
  LandingConfig, LandingNavbar, LandingNavLink, LandingFooter, FooterColumn, LandingStyles,
  SeoConfig, LandingSectionType, LandingSection, SectionBackground,
  HeroSectionConfig, FeaturesSectionConfig, PricingSectionConfig,
  TestimonialsSectionConfig, CtaSectionConfig, StatsSectionConfig,
  FaqSectionConfig, TeamSectionConfig, GallerySectionConfig,
  LogosSectionConfig, ContentSectionConfig, VideoSectionConfig, ContactSectionConfig, SocialLinksSectionConfig,
  MapSectionConfig, CountdownSectionConfig, CarouselSectionConfig, CtaFormSectionConfig,
  ComparisonSectionConfig, TimelineSectionConfig, TabsSectionConfig, SocialProofSectionConfig,
  BeforeAfterSectionConfig, PopupSectionConfig,
  BlogPreviewSectionConfig, SocialFeedSectionConfig,
  // Blog types
  BlogListConfig, BlogPostConfig,
  // i18n
  LandingLocale,
} from './app-types.js';

// App templates
export {
  TEMPLATE_BLANK, TEMPLATE_CRM, TEMPLATE_ECOMMERCE, TEMPLATE_HR,
  APP_TEMPLATES, getAppTemplate, listAppTemplates,
} from './templates/app-templates.js';
export type { AppTemplateId } from './templates/app-templates.js';

// Landing page templates
export {
  LANDING_TEMPLATES, getLandingTemplate, listLandingTemplates, listLandingTemplatesByCategory,
} from './templates/landing-templates.js';
export type { LandingTemplateMeta, LandingTemplateCategory } from './templates/landing-templates.js';

// Theme presets
export { THEME_PRESETS, getThemePreset, applyThemePresetToConfig } from './templates/theme-presets.js';
export type { ThemePreset } from './templates/theme-presets.js';

// Landing i18n
export {
  translateLandingConfig,
  getAvailableLandingLocales,
  LANDING_UI_STRINGS,
} from './i18n/landing-i18n.js';

// Google Fonts loader
export { loadGoogleFont, loadGoogleFonts, POPULAR_FONTS } from './utils/font-loader.js';

// Code generation
export {
  generateReactComponent,
  generateNextPage,
  generateAppPage,
  toComponentName,
  formatJson,
  escapeForJsx,
} from './codegen/index.js';
export type { CodegenOptions } from './codegen/index.js';

// Social icons
export { SOCIAL_ICONS, getSocialIcon, getSocialIconNames } from './icons/social-icons.js';
export type { SocialIconData } from './icons/social-icons.js';

// Provider system
export type {
  IconResolver, ComponentResolver, PageRenderer,
  ActionHandler, DataFetcher, NotificationHandler, ConfirmHandler,
  StudioProvider,
} from './providers.js';
export { DEFAULT_PROVIDER, mergeProviders, resolveIcon } from './providers.js';

// Social sharing
export { getShareUrl, getSupportedShareNetworks, canNativeShare, nativeShare } from './social/share.js';
export type { ShareConfig } from './social/share.js';

// Static site builder
export { buildStaticSite } from './builder/static-builder.js';
export type { StaticSiteOutput, BuildOptions } from './builder/static-builder.js';

// SEO
export { generateSitemap, generateRobotsTxt, generateJsonLd, generateOpenGraphTags, generateTwitterCardTags, generateCanonicalUrl, generateHreflangTags, generateMetaTagsHtml } from './seo/seo-generator.js';
export { generateCSP, generateSecurityHeaders } from './seo/csp-generator.js';
