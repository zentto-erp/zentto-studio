// @zentto/studio-core — Provider system
// Allows host apps to inject their own icons, components, and renderers
// The studio doesn't know what MUI, FontAwesome, or any library is —
// it just calls the provider and the host resolves it.

/**
 * Icon resolver function.
 * Host app maps icon names to rendered HTML strings.
 *
 * @example
 * // In React host app:
 * import { renderToString } from 'react-dom/server';
 * import * as MuiIcons from '@mui/icons-material';
 *
 * const iconResolver = (name: string, props?: Record<string, unknown>) => {
 *   const Icon = (MuiIcons as any)[name];
 *   if (Icon) return renderToString(<Icon {...props} />);
 *   return name; // fallback to text/emoji
 * };
 */
export type IconResolver = (
  name: string,
  props?: { size?: number; color?: string; className?: string },
) => string; // returns HTML string or emoji

/**
 * Component resolver function.
 * Host app maps component names to rendered HTML strings.
 * Used for custom field types the studio doesn't know about.
 *
 * @example
 * const componentResolver = (name: string, props: Record<string, unknown>) => {
 *   if (name === 'MyCustomChart') return '<my-chart ...>';
 *   if (name === 'GoogleMap') return '<iframe src="...">';
 *   return null; // not handled
 * };
 */
export type ComponentResolver = (
  name: string,
  props: Record<string, unknown>,
) => string | null; // returns HTML string or null if not handled

/**
 * Page renderer function.
 * Host app renders a full page given a page ID and data.
 * Returns HTML string to inject into the content area.
 */
export type PageRenderer = (
  pageId: string,
  data: Record<string, unknown>,
) => string | null;

/**
 * Action handler function.
 * Host app handles custom actions (API calls, navigation, etc.)
 */
export type ActionHandler = (
  actionId: string,
  actionType: string,
  data: Record<string, unknown>,
) => Promise<{ success: boolean; data?: unknown; error?: string }>;

/**
 * Data fetcher function.
 * Host app fetches data (can use its own auth tokens, interceptors, etc.)
 */
export type DataFetcher = (
  url: string,
  options: { method: string; headers?: Record<string, string>; body?: unknown },
) => Promise<unknown>;

/**
 * Toast/notification handler.
 * Host app shows notifications in its own style.
 */
export type NotificationHandler = (
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message?: string,
) => void;

/**
 * Confirmation handler.
 * Host app shows its own confirmation dialog.
 */
export type ConfirmHandler = (
  title: string,
  message: string,
  options?: { variant?: string; okText?: string; cancelText?: string },
) => Promise<boolean>;

/**
 * StudioProvider — the bridge between studio and the host app.
 * Host app creates this and passes it to <zentto-studio-app> or <zentto-studio-renderer>.
 * Every function is optional — studio falls back to built-in behavior.
 */
export interface StudioProvider {
  /** Resolve icon names to HTML (MUI icons, FontAwesome, custom SVGs) */
  resolveIcon?: IconResolver;

  /** Resolve custom components to HTML */
  resolveComponent?: ComponentResolver;

  /** Render custom pages */
  renderPage?: PageRenderer;

  /** Handle actions (submit, apiCall, custom) */
  handleAction?: ActionHandler;

  /** Fetch data with host app's auth/interceptors */
  fetchData?: DataFetcher;

  /** Show notifications in host app's style */
  notify?: NotificationHandler;

  /** Show confirmation dialogs in host app's style */
  confirm?: ConfirmHandler;

  /** Navigate in the host app's router */
  navigate?: (path: string) => void;

  /** Open a URL in a new tab or modal */
  openUrl?: (url: string, target?: '_blank' | '_self' | 'modal') => void;

  /** Get the current user (may change over time) */
  getUser?: () => { id?: string; name?: string; email?: string; roles?: string[]; avatar?: string } | null;

  /** Get auth headers for API calls */
  getAuthHeaders?: () => Record<string, string>;

  /** Register a custom field type with a web component tag */
  customFields?: Record<string, {
    tagName: string;        // e.g., 'my-custom-datepicker'
    label: string;
    icon: string;
    category?: string;
    defaultProps?: Record<string, unknown>;
  }>;

  /** CSS class mappings (e.g., MUI class names the host uses) */
  cssClasses?: Record<string, string>;

  /** Additional config the host app wants to pass through */
  extra?: Record<string, unknown>;
}

// ─── Default (no-op) provider ─────────────────────────────────────

export const DEFAULT_PROVIDER: StudioProvider = {};

// ─── Helper to merge providers ────────────────────────────────────

export function mergeProviders(...providers: (StudioProvider | undefined)[]): StudioProvider {
  const merged: StudioProvider = {};
  for (const p of providers) {
    if (!p) continue;
    Object.assign(merged, p);
    // Merge customFields deeply
    if (p.customFields) {
      merged.customFields = { ...merged.customFields, ...p.customFields };
    }
  }
  return merged;
}

// ─── Icon resolution with fallback chain ──────────────────────────

const BUILTIN_ICONS: Record<string, string> = {
  // Navigation
  home: '🏠', dashboard: '📊', settings: '⚙️', search: '🔍', menu: '☰',
  // Actions
  add: '➕', edit: '✏️', delete: '🗑️', save: '💾', cancel: '✕', refresh: '🔄',
  close: '✕', check: '✓', copy: '📋', download: '⬇️', upload: '⬆️', print: '🖨️',
  // Status
  success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️', loading: '⏳',
  // Content
  user: '👤', users: '👥', company: '🏢', email: '📧', phone: '📱',
  calendar: '📅', clock: '🕐', map: '🗺️', location: '📍',
  // Business
  invoice: '📄', order: '📋', product: '📦', cart: '🛒', money: '💰',
  bank: '🏦', chart: '📈', report: '📊', file: '📁', folder: '📂',
  // UI
  star: '⭐', heart: '❤️', flag: '🚩', tag: '🏷️', lock: '🔒', unlock: '🔓',
  eye: '👁️', notification: '🔔', link: '🔗', code: '💻',
  // Arrows
  arrowUp: '↑', arrowDown: '↓', arrowLeft: '←', arrowRight: '→',
  chevronRight: '▶', chevronDown: '▼', chevronUp: '▲', chevronLeft: '◀',
};

/**
 * Resolve an icon name using the provider chain:
 * 1. Provider's resolveIcon (MUI, FontAwesome, etc.)
 * 2. Built-in emoji map
 * 3. Raw string (emoji/text passthrough)
 */
export function resolveIcon(
  name: string | undefined,
  provider?: StudioProvider,
  props?: { size?: number; color?: string },
): string {
  if (!name) return '';

  // 1. Try provider
  if (provider?.resolveIcon) {
    const result = provider.resolveIcon(name, props);
    if (result) return result;
  }

  // 2. Built-in emoji map
  if (name in BUILTIN_ICONS) return BUILTIN_ICONS[name];

  // 3. Passthrough (emoji, SVG string, or text)
  return name;
}
