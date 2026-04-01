// @zentto/studio-core — App-level types for the mini-framework
// <zentto-studio-app> receives an AppConfig and renders a full application shell

import type { StudioSchema, ThemeConfig, DataSourceConfig, ActionConfig } from './types.js';

// ─── Navigation ───────────────────────────────────────────────────

export type NavItemKind = 'page' | 'header' | 'divider';

export interface NavItem {
  kind?: NavItemKind;           // default: 'page'
  segment?: string;             // URL segment (e.g. 'invoices')
  title?: string;
  icon?: string;                // icon name, emoji, or SVG string
  badge?: string | number;      // notification badge
  badgeColor?: string;
  children?: NavItem[];         // nested sub-items (accordion)
  hidden?: boolean;
  roles?: string[];             // only show if user has these roles
}

// ─── Page Config ──────────────────────────────────────────────────

export type PageContentType =
  | 'schema'      // renders a StudioSchema form/dashboard
  | 'datagrid'    // renders a zentto-grid with config
  | 'report'      // renders a zentto-report-viewer
  | 'chart'       // renders charts from data sources
  | 'html'        // renders raw HTML
  | 'iframe'      // renders an iframe
  | 'custom'      // emits event for host to render
  | 'cards'       // renders card grid (like the dashboard screenshot)
  | 'tabs'        // renders multiple sub-pages as tabs
  | 'split'       // master-detail split view
  | 'landing'     // full landing page with sections
  | 'blog-list'   // blog listing with cards/grid
  | 'blog-post'   // single blog post renderer
  | 'empty';      // blank page (slot for host content)

export interface PageConfig {
  id: string;
  segment: string;              // URL segment (matches NavItem.segment)
  title: string;
  subtitle?: string;
  icon?: string;
  breadcrumb?: boolean;         // show breadcrumbs (default true)

  // Content type determines what renders
  content: PageContentType;

  // Data sources for this page
  dataSources?: DataSourceConfig[];
  autoFetch?: boolean;          // fetch on page load (default true)

  // For content='schema' — full form/dashboard
  schema?: StudioSchema;

  // For content='datagrid'
  gridConfig?: GridPageConfig;

  // For content='report'
  reportConfig?: ReportPageConfig;

  // For content='cards'
  cardsConfig?: CardsPageConfig;

  // For content='tabs'
  tabsConfig?: TabsPageConfig;

  // For content='split'
  splitConfig?: SplitPageConfig;

  // For content='chart'
  chartConfig?: ChartPageConfig;

  // For content='html' or 'iframe'
  htmlContent?: string;
  iframeUrl?: string;

  // For content='landing'
  landingSections?: LandingSection[];

  // For content='blog-list'
  blogListConfig?: BlogListConfig;

  // For content='blog-post'
  blogPostConfig?: BlogPostConfig;

  // SEO metadata (per-page, overrides LandingConfig.seo)
  seo?: SeoConfig;

  // Actions (buttons in page header)
  actions?: ActionConfig[];

  // Role-based access
  roles?: string[];
}

// ─── Grid Page ────────────────────────────────────────────────────

export interface GridPageConfig {
  columns: GridColumnDef[];
  dataSourceId: string;         // which data source provides rows
  rowKey?: string;              // unique key field (default 'id')
  enableToolbar?: boolean;
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableExport?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  height?: string;
  onRowClick?: 'navigate' | 'select' | 'detail' | 'emit';
  rowClickSegment?: string;     // navigate to this segment + /{id}
  crud?: CrudConfig;
}

export interface GridColumnDef {
  field: string;
  header: string;
  width?: number;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'status' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  currency?: string;
  statusColors?: Record<string, string>;
  format?: string;
  pin?: 'left' | 'right';
  hidden?: boolean;
  actions?: { icon: string; label: string; action: string; color?: string }[];
}

export interface CrudConfig {
  create?: { schema: StudioSchema; url: string; method?: string };
  edit?: { schema: StudioSchema; url: string; method?: string };
  delete?: { url: string; confirmMessage?: string };
}

// ─── Report Page ──────────────────────────────────────────────────

export interface ReportPageConfig {
  templateId?: string;
  layout?: unknown;             // report layout JSON
  dataSourceId?: string;
  showToolbar?: boolean;
}

// ─── Cards Page (Dashboard grid like the screenshot) ──────────────

export interface CardItem {
  id: string;
  title: string;
  icon?: string;
  iconBg?: string;              // background color for icon circle
  subtitle?: string;
  segment?: string;             // navigate to this page on click
  url?: string;                 // external URL on click
  badge?: string | number;
  roles?: string[];
  value?: string | number;      // for KPI cards
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
}

export interface CardsPageConfig {
  items: CardItem[];
  columns?: number;             // grid columns (default 6)
  variant?: 'icon' | 'kpi' | 'stat' | 'link';  // card style
  gap?: number;
}

// ─── Tabs Page ────────────────────────────────────────────────────

export interface TabsPageConfig {
  tabs: { id: string; title: string; icon?: string; pageId: string }[];
  position?: 'top' | 'left';
}

// ─── Split Page (Master-Detail) ──────────────────────────────────

export interface SplitPageConfig {
  masterPageId: string;
  detailPageId: string;
  splitRatio?: number;          // 0-100, left panel width % (default 40)
  direction?: 'horizontal' | 'vertical';
}

// ─── Chart Page ───────────────────────────────────────────────────

export interface ChartPageConfig {
  charts: {
    id: string;
    type: 'bar' | 'line' | 'pie' | 'donut' | 'area';
    title: string;
    dataSourceId: string;
    labelField: string;
    valueFields: string[];
    colSpan?: number;           // grid columns this chart spans
    height?: number;
  }[];
  columns?: number;             // grid columns for chart layout
}

// ─── Branding ─────────────────────────────────────────────────────

export interface BrandingConfig {
  logo?: string;                // URL or SVG string
  title?: string;
  subtitle?: string;
  homeSegment?: string;         // default home page segment
  favicon?: string;
  primaryColor?: string;
  sidebarStyle?: 'dark' | 'light' | 'branded';
  headerStyle?: 'dark' | 'light' | 'branded';
}

// ─── User Context ─────────────────────────────────────────────────

export interface UserContext {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
  company?: string;
  branch?: string;
  locale?: string;
  extra?: Record<string, unknown>;
}

// ─── AppConfig (Root) ─────────────────────────────────────────────

export interface AppConfig {
  id: string;
  version?: string;

  // App mode: 'app' (sidebar shell), 'landing' (full-page), 'blog' (blog layout)
  appMode?: 'app' | 'landing' | 'blog';

  // Branding
  branding: BrandingConfig;

  // Navigation (sidebar menu — used in 'app' mode)
  navigation: NavItem[];

  // Pages (each segment maps to a page)
  pages: PageConfig[];

  // Landing page config (navbar, footer, SEO — used in 'landing'/'blog' mode)
  landingConfig?: LandingConfig;

  // Global data sources (available to all pages)
  dataSources?: DataSourceConfig[];

  // Global API headers (auth tokens, etc.)
  headers?: Record<string, string>;

  // Theme
  theme?: ThemeConfig;

  // User context (for role-based nav/pages)
  user?: UserContext;

  // i18n
  locale?: string;

  // Notifications
  notifications?: NotificationConfig[];
}

export interface NotificationConfig {
  id: string;
  title: string;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  timestamp?: string;
  read?: boolean;
  action?: string;              // segment to navigate to
}

// ─── Landing Page Config ──────────────────────────────────────────

export type LandingLocale = 'es' | 'en' | 'pt' | 'fr' | 'de';

export interface LandingConfig {
  navbar?: LandingNavbar;
  footer?: LandingFooter;
  seo?: SeoConfig;
  globalStyles?: LandingStyles;
  /** Active locale for text rendering */
  locale?: LandingLocale;
  /** Translation dictionaries keyed by locale. Values are flat maps: "sectionId.field" → text */
  i18n?: Record<string, Record<string, string>>;
}

export interface LandingNavbar {
  logo?: string;               // URL or SVG string
  logoAlt?: string;
  title?: string;
  links: LandingNavLink[];
  ctaButton?: { label: string; href: string; variant?: 'primary' | 'secondary' };
  sticky?: boolean;            // default true
  transparent?: boolean;       // transparent over hero, solid on scroll
}

export interface LandingNavLink {
  label: string;
  href: string;                // #anchor for scroll, /segment for navigation, or external URL
  external?: boolean;
}

export interface LandingFooter {
  columns: FooterColumn[];
  copyright?: string;
  socialLinks?: { icon: string; url: string }[];
  newsletter?: { placeholder: string; buttonLabel: string; dataSourceId?: string };
}

export interface FooterColumn {
  title: string;
  links: LandingNavLink[];
}

export interface LandingStyles {
  maxWidth?: string;           // default '1200px'
  fontFamily?: string;
  headingFontFamily?: string;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;             // 'website' | 'article'
  twitterCard?: string;        // 'summary_large_image'
  canonicalUrl?: string;
  jsonLd?: Record<string, unknown>;
  keywords?: string[];
}

// ─── Landing Sections ─────────────────────────────────────────────

export type LandingSectionType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'stats'
  | 'faq'
  | 'team'
  | 'gallery'
  | 'logos'
  | 'content'
  | 'video'
  | 'contact'
  | 'html';

export interface LandingSection {
  id: string;
  type: LandingSectionType;
  variant?: string;            // visual variant per section type
  anchor?: string;             // scroll anchor (e.g. 'features')
  background?: SectionBackground;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'none' | 'fade-up' | 'fade-in' | 'slide-left';

  // Type-specific configs (only one should be set)
  heroConfig?: HeroSectionConfig;
  featuresConfig?: FeaturesSectionConfig;
  pricingConfig?: PricingSectionConfig;
  testimonialsConfig?: TestimonialsSectionConfig;
  ctaConfig?: CtaSectionConfig;
  statsConfig?: StatsSectionConfig;
  faqConfig?: FaqSectionConfig;
  teamConfig?: TeamSectionConfig;
  galleryConfig?: GallerySectionConfig;
  logosConfig?: LogosSectionConfig;
  contentConfig?: ContentSectionConfig;
  videoConfig?: VideoSectionConfig;
  contactConfig?: ContactSectionConfig;
  htmlContent?: string;        // for type='html'
}

export interface SectionBackground {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  value: string;               // color, gradient CSS, image URL, or pattern name
  overlay?: string;            // e.g. 'rgba(0,0,0,0.5)'
}

export interface HeroSectionConfig {
  headline: string;
  subheadline?: string;
  description?: string;
  image?: string;
  video?: string;              // background video URL
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  alignment?: 'left' | 'center' | 'right';
  minHeight?: string;          // CSS value, default '80vh'
}

export interface FeaturesSectionConfig {
  headline?: string;
  subtitle?: string;
  items: {
    icon: string;
    title: string;
    description: string;
    link?: string;
  }[];
  columns?: 2 | 3 | 4;
  variant?: 'cards' | 'icons' | 'list' | 'alternating';
}

export interface PricingSectionConfig {
  headline?: string;
  subtitle?: string;
  plans: {
    name: string;
    price: string;
    period?: string;           // '/mo', '/yr'
    description?: string;
    features: string[];
    cta: { label: string; href: string };
    highlighted?: boolean;
    badge?: string;
  }[];
  billingToggle?: boolean;
}

export interface TestimonialsSectionConfig {
  headline?: string;
  items: {
    quote: string;
    name: string;
    title?: string;
    avatar?: string;
    company?: string;
    rating?: number;
  }[];
  variant?: 'carousel' | 'grid' | 'masonry';
}

export interface CtaSectionConfig {
  headline: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: 'banner' | 'centered' | 'split';
}

export interface StatsSectionConfig {
  headline?: string;
  items: {
    value: string;
    label: string;
    suffix?: string;           // '+', '%', etc.
    icon?: string;
  }[];
}

export interface FaqSectionConfig {
  headline?: string;
  subtitle?: string;
  items: { question: string; answer: string }[];
  variant?: 'accordion' | 'two-column';
}

export interface TeamSectionConfig {
  headline?: string;
  subtitle?: string;
  members: {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
    social?: { icon: string; url: string }[];
  }[];
  columns?: 2 | 3 | 4;
}

export interface GallerySectionConfig {
  headline?: string;
  images: { src: string; alt: string; caption?: string }[];
  columns?: 2 | 3 | 4;
  variant?: 'grid' | 'masonry' | 'carousel';
}

export interface LogosSectionConfig {
  headline?: string;           // e.g. 'Trusted by 500+ companies'
  logos: { src: string; alt: string; url?: string }[];
  grayscale?: boolean;
}

export interface ContentSectionConfig {
  headline?: string;
  body: string;                // HTML or Markdown
  image?: string;
  imagePosition?: 'left' | 'right';
  bodyFormat?: 'html' | 'markdown';
}

export interface VideoSectionConfig {
  headline?: string;
  subtitle?: string;
  videoUrl: string;
  provider?: 'youtube' | 'vimeo' | 'self';
  poster?: string;
}

export interface ContactSectionConfig {
  headline?: string;
  subtitle?: string;
  schema?: StudioSchema;       // reuses the existing form system
  successMessage?: string;
  submitAction?: ActionConfig;
}

// ─── Blog Config ──────────────────────────────────────────────────

export interface BlogListConfig {
  dataSourceId: string;
  layout?: 'grid' | 'list' | 'magazine';
  columns?: 2 | 3;
  showCategories?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  featuredCount?: number;
  postSegment?: string;        // segment for individual posts
  cardFields?: {
    title?: string;
    excerpt?: string;
    image?: string;
    date?: string;
    author?: string;
    category?: string;
    tags?: string;
    slug?: string;
  };
}

export interface BlogPostConfig {
  dataSourceId: string;
  slugParam?: string;          // URL param name (default 'slug')
  layout?: 'standard' | 'wide' | 'full';
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showRelated?: boolean;
  showComments?: boolean;
  contentFormat?: 'html' | 'markdown';
  contentField?: string;       // field name in data source (default 'content')
  relatedDataSourceId?: string;
}
