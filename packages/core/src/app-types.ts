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

  // Branding
  branding: BrandingConfig;

  // Navigation (sidebar menu)
  navigation: NavItem[];

  // Pages (each segment maps to a page)
  pages: PageConfig[];

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
