// @zentto/studio — Full Application Shell Web Component
// <zentto-studio-app> is a mini-framework: give it a JSON config, get a full app
// Sidebar + Header + Router + Pages + Data Sources + Forms + Grids + Reports

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { studioTokens } from './styles/tokens.js';
import type {
  AppConfig, NavItem, PageConfig, CardItem, UserContext, GridColumnDef,
  StudioProvider,
} from '@zentto/studio-core';
import {
  type StudioSchema, type StudioBindingContext,
  EventBus, DataModel,
  evaluateRules, applyRulesToModel, validateField,
  solveGridLayout, getFieldTag, getFieldMeta,
  isActionEnabled, evaluateExpression,
  fetchAllDataSources,
  resolveIcon,
} from '@zentto/studio-core';

// Import renderer (which imports all field components)
import './zentto-studio-renderer.js';

@customElement('zentto-studio-app')
export class ZenttoStudioApp extends LitElement {
  static styles = [studioTokens, css`
    :host { display: block; height: 100%; font-family: var(--zs-font-family); }

    /* ─── Shell Layout ──────────────────────────── */
    .zs-app { display: flex; height: 100%; overflow: hidden; background: var(--zs-bg-secondary); }

    /* ─── Sidebar ───────────────────────────────── */
    .zs-sidebar {
      width: 260px; min-width: 260px;
      background: #1e1e2d;
      color: #a2a3b7;
      display: flex; flex-direction: column;
      overflow: hidden;
      transition: width 200ms ease, min-width 200ms ease;
      z-index: 10;
    }
    .zs-sidebar--collapsed { width: 68px; min-width: 68px; }
    .zs-sidebar--light { background: var(--zs-bg); color: var(--zs-text); border-right: 1px solid var(--zs-border); }
    .zs-sidebar-brand {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px; min-height: 64px;
      cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .zs-sidebar--light .zs-sidebar-brand { border-bottom-color: var(--zs-border); }
    .zs-sidebar-logo {
      width: 36px; height: 36px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: var(--zs-primary, #e67e22); color: white;
      font-weight: 700; font-size: 16px; flex-shrink: 0;
      overflow: hidden;
    }
    .zs-sidebar-logo img { width: 100%; height: 100%; object-fit: contain; }
    .zs-sidebar-title {
      font-size: 16px; font-weight: 600; color: white;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .zs-sidebar--light .zs-sidebar-title { color: var(--zs-text); }
    .zs-sidebar-subtitle { font-size: 11px; color: #a2a3b7; }
    .zs-sidebar--collapsed .zs-sidebar-title,
    .zs-sidebar--collapsed .zs-sidebar-subtitle { display: none; }

    .zs-sidebar-nav {
      flex: 1; overflow-y: auto; padding: 8px 0;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
    }

    /* Nav items */
    .zs-nav-header {
      padding: 16px 20px 6px; font-size: 11px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px; color: #636674;
    }
    .zs-sidebar--collapsed .zs-nav-header { text-align: center; padding: 12px 4px 4px; font-size: 0; }
    .zs-nav-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 16px; }
    .zs-sidebar--light .zs-nav-divider { background: var(--zs-border); }

    .zs-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 9px 20px; cursor: pointer;
      color: #a2a3b7; font-size: 14px;
      transition: all 150ms; border-left: 3px solid transparent;
      text-decoration: none; user-select: none;
      white-space: nowrap; overflow: hidden;
    }
    .zs-nav-item:hover { color: white; background: rgba(255,255,255,0.04); }
    .zs-sidebar--light .zs-nav-item { color: var(--zs-text-secondary); }
    .zs-sidebar--light .zs-nav-item:hover { color: var(--zs-text); background: var(--zs-bg-hover); }
    .zs-nav-item--active {
      color: white; background: rgba(255,255,255,0.06);
      border-left-color: var(--zs-primary, #e67e22);
    }
    .zs-sidebar--light .zs-nav-item--active {
      color: var(--zs-primary); background: var(--zs-primary-light);
      border-left-color: var(--zs-primary);
    }
    .zs-nav-icon {
      width: 22px; height: 22px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    .zs-nav-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }
    .zs-sidebar--collapsed .zs-nav-label { display: none; }
    .zs-nav-badge {
      padding: 1px 7px; border-radius: 10px; font-size: 11px;
      font-weight: 600; background: var(--zs-primary); color: white;
    }
    .zs-sidebar--collapsed .zs-nav-badge { display: none; }
    .zs-nav-arrow { font-size: 10px; transition: transform 200ms; color: #636674; }
    .zs-nav-arrow--open { transform: rotate(90deg); }
    .zs-sidebar--collapsed .zs-nav-arrow { display: none; }
    .zs-nav-children { overflow: hidden; }
    .zs-nav-children .zs-nav-item { padding-left: 54px; font-size: 13px; }
    .zs-sidebar--collapsed .zs-nav-children { display: none; }

    /* Sidebar footer */
    .zs-sidebar-footer {
      padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; align-items: center; gap: 10px; cursor: pointer;
    }
    .zs-sidebar--light .zs-sidebar-footer { border-top-color: var(--zs-border); }
    .zs-sidebar-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--zs-primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 14px; flex-shrink: 0;
      overflow: hidden;
    }
    .zs-sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .zs-sidebar-user-name { font-size: 13px; color: white; font-weight: 500; }
    .zs-sidebar--light .zs-sidebar-user-name { color: var(--zs-text); }
    .zs-sidebar-user-role { font-size: 11px; color: #636674; }
    .zs-sidebar--collapsed .zs-sidebar-user-name,
    .zs-sidebar--collapsed .zs-sidebar-user-role { display: none; }

    /* ─── Main Area ──────────────────────────────── */
    .zs-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    /* Header */
    .zs-header {
      height: 56px; min-height: 56px;
      display: flex; align-items: center;
      padding: 0 24px; gap: 12px;
      background: var(--zs-bg); border-bottom: 1px solid var(--zs-border);
    }
    .zs-header--dark { background: #1e1e2d; border-bottom-color: rgba(255,255,255,0.06); }
    .zs-header-toggle {
      border: none; background: none; cursor: pointer;
      font-size: 20px; color: var(--zs-text-secondary); padding: 4px;
    }
    .zs-header--dark .zs-header-toggle { color: #a2a3b7; }
    .zs-breadcrumbs {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--zs-text-secondary);
    }
    .zs-breadcrumb-link {
      color: var(--zs-text-secondary); cursor: pointer; text-decoration: none;
    }
    .zs-breadcrumb-link:hover { color: var(--zs-primary); }
    .zs-breadcrumb-sep { color: var(--zs-text-muted); }
    .zs-breadcrumb-current { color: var(--zs-text); font-weight: 500; }
    .zs-header--dark .zs-breadcrumbs { color: #a2a3b7; }
    .zs-header--dark .zs-breadcrumb-current { color: white; }
    .zs-header-spacer { flex: 1; }
    .zs-header-actions { display: flex; align-items: center; gap: 8px; }
    .zs-header-btn {
      border: none; background: none; cursor: pointer;
      font-size: 18px; color: var(--zs-text-secondary); padding: 6px;
      border-radius: 6px; transition: all 150ms; position: relative;
    }
    .zs-header-btn:hover { background: var(--zs-bg-hover); color: var(--zs-text); }
    .zs-header--dark .zs-header-btn { color: #a2a3b7; }
    .zs-header--dark .zs-header-btn:hover { background: rgba(255,255,255,0.06); color: white; }
    .zs-notif-dot {
      position: absolute; top: 2px; right: 2px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--zs-danger);
    }

    /* Content */
    .zs-content { flex: 1; overflow-y: auto; padding: 24px; }

    /* Page header */
    .zs-page-header {
      display: flex; align-items: center; gap: 16px;
      margin-bottom: 24px;
    }
    .zs-page-title {
      font-size: 22px; font-weight: 600; color: var(--zs-text); margin: 0;
    }
    .zs-page-subtitle {
      font-size: 14px; color: var(--zs-text-secondary); margin: 2px 0 0;
    }
    .zs-page-actions { display: flex; gap: 8px; margin-left: auto; }
    .zs-page-btn {
      padding: 8px 18px; border-radius: var(--zs-radius);
      font-family: var(--zs-font-family); font-size: 13px;
      font-weight: 500; cursor: pointer; border: 1px solid transparent;
      transition: all 150ms;
    }
    .zs-page-btn--primary { background: var(--zs-primary); color: white; }
    .zs-page-btn--primary:hover { background: var(--zs-primary-hover); }
    .zs-page-btn--secondary { background: var(--zs-bg); color: var(--zs-text); border-color: var(--zs-border); }
    .zs-page-btn--secondary:hover { background: var(--zs-bg-hover); }

    /* Cards grid (dashboard) */
    .zs-cards-grid { display: grid; gap: 24px; }
    .zs-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 28px 16px; border-radius: 12px;
      background: var(--zs-bg); cursor: pointer;
      transition: all 200ms; text-decoration: none;
      border: 1px solid var(--zs-border);
      gap: 12px;
    }
    .zs-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px var(--zs-shadow); }
    .zs-card-icon {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; color: white;
    }
    .zs-card-title { font-size: 14px; font-weight: 500; color: var(--zs-text); text-align: center; }
    .zs-card-subtitle { font-size: 12px; color: var(--zs-text-muted); text-align: center; }
    .zs-card-badge {
      position: absolute; top: 8px; right: 8px;
      padding: 2px 8px; border-radius: 10px;
      background: var(--zs-danger); color: white;
      font-size: 11px; font-weight: 600;
    }

    /* KPI cards */
    .zs-kpi-card {
      padding: 20px 24px; border-radius: 12px;
      background: var(--zs-bg); border: 1px solid var(--zs-border);
    }
    .zs-kpi-label { font-size: 13px; color: var(--zs-text-secondary); margin-bottom: 4px; }
    .zs-kpi-value { font-size: 28px; font-weight: 700; color: var(--zs-text); }
    .zs-kpi-trend { font-size: 13px; margin-top: 4px; }
    .zs-kpi-trend--up { color: var(--zs-success); }
    .zs-kpi-trend--down { color: var(--zs-danger); }

    /* Grid placeholder */
    .zs-grid-page { width: 100%; }

    /* Empty state */
    .zs-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 300px;
      color: var(--zs-text-muted); gap: 8px;
    }
    .zs-empty-icon { font-size: 48px; opacity: 0.3; }
    .zs-empty-text { font-size: 16px; }

    /* ─── Responsive ─────────────────────────────── */
    @media (max-width: 768px) {
      .zs-sidebar { position: absolute; height: 100%; z-index: 100; }
      .zs-sidebar--collapsed { width: 0; min-width: 0; overflow: hidden; }
      .zs-content { padding: 16px; }
      .zs-cards-grid { gap: 12px; }
    }
  `];

  // ─── Properties ───────────────────────────────────

  @property({ type: Object }) config: AppConfig | null = null;
  @property({ type: Object }) provider: StudioProvider = {};  // host app bridge
  @property({ type: String }) customCss = '';   // inject custom CSS string
  @property({ type: Object }) cssVars: Record<string, string> = {}; // override --zs-* tokens

  // ─── Internal State ───────────────────────────────

  @state() private currentSegment = '';
  @state() private sidebarCollapsed = false;
  @state() private expandedNavItems = new Set<string>();
  @state() private pageData: Record<string, unknown> = {};
  @state() private pageLoading = false;
  @state() private renderKey = 0;
  private eventBus = new EventBus();
  private history: string[] = [];

  // ─── Lifecycle ────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    // Set initial page
    if (this.config?.branding.homeSegment) {
      this.currentSegment = this.config.branding.homeSegment;
    } else if (this.config?.pages.length) {
      this.currentSegment = this.config.pages[0].segment;
    }
    this.loadPageData();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config') && this.config) {
      if (!this.currentSegment && this.config.pages.length > 0) {
        this.currentSegment = this.config.branding.homeSegment ?? this.config.pages[0].segment;
      }
      this.loadPageData();
    }
  }

  // ─── Navigation ───────────────────────────────────

  private navigate(segment: string) {
    if (segment === this.currentSegment) return;
    this.history.push(this.currentSegment);
    this.currentSegment = segment;
    this.loadPageData();

    this.dispatchEvent(new CustomEvent('app-navigate', {
      detail: { segment, page: this.currentPage },
      bubbles: true, composed: true,
    }));
  }

  private goBack() {
    const prev = this.history.pop();
    if (prev) {
      this.currentSegment = prev;
      this.loadPageData();
    }
  }

  private get currentPage(): PageConfig | undefined {
    return this.config?.pages.find(p => p.segment === this.currentSegment);
  }

  private get breadcrumbs(): { title: string; segment: string }[] {
    const crumbs: { title: string; segment: string }[] = [];
    if (!this.config) return crumbs;

    // Find nav path to current segment
    const findPath = (items: NavItem[], path: NavItem[]): NavItem[] | null => {
      for (const item of items) {
        if (item.segment === this.currentSegment) return [...path, item];
        if (item.children) {
          const result = findPath(item.children, [...path, item]);
          if (result) return result;
        }
      }
      return null;
    };

    const path = findPath(this.config.navigation, []);
    if (path) {
      for (const item of path) {
        if (item.segment && item.title) {
          crumbs.push({ title: item.title, segment: item.segment });
        }
      }
    }

    return crumbs;
  }

  // ─── Data Loading ─────────────────────────────────

  private async loadPageData() {
    const page = this.currentPage;
    if (!page?.dataSources || page.autoFetch === false) return;

    this.pageLoading = true;
    try {
      const globalSources = this.config?.dataSources ?? [];
      const pageSources = page.dataSources ?? [];
      const allSources = [...globalSources, ...pageSources];

      const ctx: StudioBindingContext = {
        formData: {},
        dataSources: this.pageData,
        user: this.config?.user,
      };

      // Use provider's auth headers if available
      const headers = {
        ...this.config?.headers,
        ...(this.provider.getAuthHeaders?.() ?? {}),
      };
      const data = await fetchAllDataSources(allSources, ctx, this.eventBus, headers);
      this.pageData = { ...this.pageData, ...data };
    } catch { /* silently fail */ }
    this.pageLoading = false;
    this.renderKey++;
  }

  // ─── Role Checks ─────────────────────────────────

  private hasRole(roles?: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    const userRoles = this.config?.user?.roles ?? [];
    return roles.some(r => userRoles.includes(r));
  }

  // ─── Render ───────────────────────────────────────

  render() {
    if (!this.config) {
      return html`<div class="zs-empty"><span class="zs-empty-icon">⚙️</span><span class="zs-empty-text">No app config provided</span></div>`;
    }

    const sidebarStyle = this.config.branding.sidebarStyle ?? 'dark';
    const headerStyle = this.config.branding.headerStyle ?? 'light';
    const sidebarClass = `zs-sidebar ${this.sidebarCollapsed ? 'zs-sidebar--collapsed' : ''} ${sidebarStyle === 'light' ? 'zs-sidebar--light' : ''}`;
    const headerClass = `zs-header ${headerStyle === 'dark' ? 'zs-header--dark' : ''}`;

    // Apply custom CSS variables
    const cssVarStyle = Object.entries(this.cssVars).map(([k, v]) => `${k}:${v}`).join(';');

    return html`
      ${this.customCss ? html`<style>${this.customCss}</style>` : ''}
      <div class="zs-app" style="${cssVarStyle}">
        <!-- Sidebar -->
        <aside class="${sidebarClass}">
          ${this.renderSidebarBrand()}
          <nav class="zs-sidebar-nav">
            ${this.config.navigation.map(item => this.renderNavItem(item))}
          </nav>
          ${this.renderSidebarFooter()}
        </aside>

        <!-- Main -->
        <div class="zs-main">
          <header class="${headerClass}">
            <button class="zs-header-toggle" @click="${() => { this.sidebarCollapsed = !this.sidebarCollapsed; }}">☰</button>
            ${this.renderBreadcrumbs()}
            <div class="zs-header-spacer"></div>
            ${this.renderHeaderActions()}
          </header>
          <main class="zs-content">
            ${this.renderPage()}
          </main>
        </div>
      </div>
    `;
  }

  // ─── Sidebar Brand ────────────────────────────────

  private renderSidebarBrand() {
    const b = this.config!.branding;
    const home = b.homeSegment ?? this.config!.pages[0]?.segment ?? '';

    return html`
      <div class="zs-sidebar-brand" @click="${() => this.navigate(home)}">
        <div class="zs-sidebar-logo">
          ${b.logo ? (b.logo.startsWith('<') ? unsafeHTML(b.logo) : html`<img src="${b.logo}" alt="" />`) : (b.title?.[0] ?? 'Z')}
        </div>
        <div>
          <div class="zs-sidebar-title">${b.title ?? 'Studio App'}</div>
          ${b.subtitle ? html`<div class="zs-sidebar-subtitle">${b.subtitle}</div>` : ''}
        </div>
      </div>
    `;
  }

  // ─── Nav Items ────────────────────────────────────

  private renderNavItem(item: NavItem): TemplateResult | typeof nothing {
    if (item.hidden || !this.hasRole(item.roles)) return nothing;

    if (item.kind === 'header') {
      return html`<div class="zs-nav-header">${item.title}</div>`;
    }
    if (item.kind === 'divider') {
      return html`<div class="zs-nav-divider"></div>`;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isActive = this.currentSegment === item.segment;
    const isExpanded = this.expandedNavItems.has(item.segment ?? '');
    const isChildActive = hasChildren && item.children!.some(c => c.segment === this.currentSegment);

    const itemClass = `zs-nav-item ${isActive || isChildActive ? 'zs-nav-item--active' : ''}`;

    return html`
      <div class="${itemClass}" @click="${() => {
        if (hasChildren) {
          const next = new Set(this.expandedNavItems);
          if (isExpanded) next.delete(item.segment!); else next.add(item.segment!);
          this.expandedNavItems = next;
        }
        if (item.segment && !hasChildren) this.navigate(item.segment);
      }}">
        <span class="zs-nav-icon">${unsafeHTML(resolveIcon(item.icon ?? 'file', this.provider))}</span>
        <span class="zs-nav-label">${item.title}</span>
        ${item.badge != null ? html`<span class="zs-nav-badge" style="${item.badgeColor ? `background:${item.badgeColor}` : ''}">${item.badge}</span>` : ''}
        ${hasChildren ? html`<span class="zs-nav-arrow ${isExpanded ? 'zs-nav-arrow--open' : ''}">▶</span>` : ''}
      </div>
      ${hasChildren && isExpanded ? html`
        <div class="zs-nav-children">
          ${item.children!.map(child => this.renderNavItem(child))}
        </div>
      ` : ''}
    `;
  }

  // ─── Sidebar Footer ──────────────────────────────

  private renderSidebarFooter() {
    const user = this.config?.user;
    if (!user) return nothing;

    const initials = (user.name ?? 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return html`
      <div class="zs-sidebar-footer">
        <div class="zs-sidebar-avatar">
          ${user.avatar ? html`<img src="${user.avatar}" alt="" />` : initials}
        </div>
        <div>
          <div class="zs-sidebar-user-name">${user.name ?? 'Usuario'}</div>
          <div class="zs-sidebar-user-role">${user.company ?? user.email ?? ''}</div>
        </div>
      </div>
    `;
  }

  // ─── Breadcrumbs ──────────────────────────────────

  private renderBreadcrumbs() {
    const crumbs = this.breadcrumbs;
    if (crumbs.length === 0) return html`<div class="zs-breadcrumbs"><span class="zs-breadcrumb-current">${this.config?.branding.title ?? 'Home'}</span></div>`;

    return html`
      <div class="zs-breadcrumbs">
        <span class="zs-breadcrumb-link" @click="${() => this.navigate(this.config!.branding.homeSegment ?? this.config!.pages[0]?.segment ?? '')}">Home</span>
        ${crumbs.map((c, i) => html`
          <span class="zs-breadcrumb-sep">/</span>
          ${i < crumbs.length - 1
            ? html`<span class="zs-breadcrumb-link" @click="${() => this.navigate(c.segment)}">${c.title}</span>`
            : html`<span class="zs-breadcrumb-current">${c.title}</span>`
          }
        `)}
      </div>
    `;
  }

  // ─── Header Actions ──────────────────────────────

  private renderHeaderActions() {
    const notifCount = this.config?.notifications?.filter(n => !n.read).length ?? 0;

    return html`
      <div class="zs-header-actions">
        <button class="zs-header-btn" title="Buscar" @click="${() => this.dispatchEvent(new CustomEvent('app-search', { bubbles: true, composed: true }))}">🔍</button>
        <button class="zs-header-btn" title="Notificaciones" @click="${() => this.dispatchEvent(new CustomEvent('app-notifications', { bubbles: true, composed: true }))}">
          🔔${notifCount > 0 ? html`<span class="zs-notif-dot"></span>` : ''}
        </button>
        <button class="zs-header-btn" title="Ajustes" @click="${() => this.dispatchEvent(new CustomEvent('app-settings', { bubbles: true, composed: true }))}">⚙️</button>
      </div>
    `;
  }

  // ─── Page Renderer ────────────────────────────────

  private renderPage(): TemplateResult {
    const page = this.currentPage;
    if (!page) {
      return html`<div class="zs-empty"><span class="zs-empty-icon">📄</span><span class="zs-empty-text">Pagina no encontrada: ${this.currentSegment}</span></div>`;
    }

    if (!this.hasRole(page.roles)) {
      return html`<div class="zs-empty"><span class="zs-empty-icon">🔒</span><span class="zs-empty-text">Sin acceso a esta pagina</span></div>`;
    }

    return html`
      <!-- Page Header -->
      ${page.title ? html`
        <div class="zs-page-header">
          <div>
            <h1 class="zs-page-title">${page.title}</h1>
            ${page.subtitle ? html`<p class="zs-page-subtitle">${page.subtitle}</p>` : ''}
          </div>
          ${page.actions ? html`
            <div class="zs-page-actions">
              ${page.actions.map(a => html`
                <button class="zs-page-btn zs-page-btn--${a.variant ?? 'secondary'}"
                  @click="${() => this.dispatchEvent(new CustomEvent('app-action', { detail: { actionId: a.id, page: page.segment, data: this.pageData }, bubbles: true, composed: true }))}"
                >${a.label}</button>
              `)}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Page Content -->
      ${this.pageLoading ? html`<div class="zs-empty"><span>Cargando...</span></div>` : this.renderPageContent(page)}
    `;
  }

  private renderPageContent(page: PageConfig): TemplateResult {
    switch (page.content) {
      case 'cards': return this.renderCardsPage(page);
      case 'schema': return this.renderSchemaPage(page);
      case 'datagrid': return this.renderGridPage(page);
      case 'html': return html`<div>${unsafeHTML(page.htmlContent ?? '')}</div>`;
      case 'iframe': return html`<iframe src="${page.iframeUrl ?? ''}" style="width:100%;height:calc(100vh - 200px);border:1px solid var(--zs-border);border-radius:8px;" frameborder="0"></iframe>`;
      case 'chart': return this.renderChartPage(page);
      case 'tabs': return this.renderTabsPage(page);
      case 'empty':
        this.dispatchEvent(new CustomEvent('app-render-page', { detail: { page }, bubbles: true, composed: true }));
        return html`<slot name="${page.segment}"></slot>`;
      case 'custom': {
        // Try provider first
        if (this.provider.renderPage) {
          const rendered = this.provider.renderPage(page.segment, this.pageData);
          if (rendered) return html`${unsafeHTML(rendered)}`;
        }
        // Try provider's component resolver
        if (this.provider.resolveComponent) {
          const rendered = this.provider.resolveComponent(page.segment, { ...this.pageData, page });
          if (rendered) return html`${unsafeHTML(rendered)}`;
        }
        this.dispatchEvent(new CustomEvent('app-render-page', { detail: { page, data: this.pageData }, bubbles: true, composed: true }));
        return html`<slot name="${page.segment}"></slot>`;
      }
      default:
        return html`<div class="zs-empty"><span class="zs-empty-icon">📋</span><span class="zs-empty-text">Tipo de contenido: ${page.content}</span></div>`;
    }
  }

  // ─── Cards Page (Dashboard) ───────────────────────

  private renderCardsPage(page: PageConfig): TemplateResult {
    const cfg = page.cardsConfig;
    if (!cfg) return html``;

    const cols = cfg.columns ?? 6;
    const variant = cfg.variant ?? 'icon';

    if (variant === 'kpi') {
      return html`
        <div class="zs-cards-grid" style="grid-template-columns: repeat(${cols}, 1fr);">
          ${cfg.items.filter(c => this.hasRole(c.roles)).map(card => html`
            <div class="zs-kpi-card" @click="${() => card.segment ? this.navigate(card.segment) : null}" style="${card.segment ? 'cursor:pointer' : ''}">
              <div class="zs-kpi-label">${card.title}</div>
              <div class="zs-kpi-value">${card.value ?? '—'}</div>
              ${card.trend ? html`<div class="zs-kpi-trend zs-kpi-trend--${card.trend}">${card.trend === 'up' ? '↑' : card.trend === 'down' ? '↓' : '→'} ${card.trendValue ?? ''}</div>` : ''}
            </div>
          `)}
        </div>
      `;
    }

    return html`
      <div class="zs-cards-grid" style="grid-template-columns: repeat(${cols}, 1fr); gap: ${cfg.gap ?? 24}px;">
        ${cfg.items.filter(c => this.hasRole(c.roles)).map(card => html`
          <div class="zs-card" @click="${() => card.segment ? this.navigate(card.segment) : card.url ? window.open(card.url) : null}"
            style="position:relative;">
            ${card.badge != null ? html`<span class="zs-card-badge">${card.badge}</span>` : ''}
            <div class="zs-card-icon" style="background: ${card.iconBg ?? 'var(--zs-primary)'}">
              ${unsafeHTML(resolveIcon(card.icon ?? 'product', this.provider, { size: 28, color: 'white' }))}
            </div>
            <div class="zs-card-title">${card.title}</div>
            ${card.subtitle ? html`<div class="zs-card-subtitle">${card.subtitle}</div>` : ''}
          </div>
        `)}
      </div>
    `;
  }

  // ─── Schema Page (Form) ───────────────────────────

  private renderSchemaPage(page: PageConfig): TemplateResult {
    if (!page.schema) return html`<div>Sin schema configurado</div>`;
    return html`
      <zentto-studio-renderer
        .schema="${page.schema}"
        .data="${this.pageData}"
        @studio-change="${(e: CustomEvent) => { this.pageData = { ...this.pageData, ...e.detail.data }; }}"
        @studio-submit="${(e: CustomEvent) => { this.dispatchEvent(new CustomEvent('app-submit', { detail: { page: page.segment, ...e.detail }, bubbles: true, composed: true })); }}"
      ></zentto-studio-renderer>
    `;
  }

  // ─── Grid Page ────────────────────────────────────

  private renderGridPage(page: PageConfig): TemplateResult {
    const cfg = page.gridConfig;
    if (!cfg) return html`<div>Sin grid configurado</div>`;

    const rows = (this.pageData[cfg.dataSourceId] as unknown[]) ?? [];

    // Emit event for host to render zentto-grid
    this.dispatchEvent(new CustomEvent('app-render-grid', {
      detail: { page: page.segment, config: cfg, rows, data: this.pageData },
      bubbles: true, composed: true,
    }));

    // Simple table fallback if zentto-grid not available
    return html`
      <div class="zs-grid-page">
        <slot name="grid-${page.segment}">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr>${cfg.columns.filter(c => !c.hidden).map(c => html`<th style="text-align:left;padding:10px 12px;border-bottom:2px solid var(--zs-border);font-weight:600;color:var(--zs-text-secondary);font-size:12px;text-transform:uppercase;">${c.header}</th>`)}</tr>
            </thead>
            <tbody>
              ${(rows as Record<string, unknown>[]).slice(0, 100).map(row => html`
                <tr style="cursor:pointer;transition:background 100ms;" @click="${() => {
                  if (cfg.onRowClick === 'navigate' && cfg.rowClickSegment) {
                    this.navigate(`${cfg.rowClickSegment}/${(row as Record<string, unknown>)[cfg.rowKey ?? 'id']}`);
                  }
                  this.dispatchEvent(new CustomEvent('app-row-click', { detail: { page: page.segment, row }, bubbles: true, composed: true }));
                }}">
                  ${cfg.columns.filter(c => !c.hidden).map(c => html`<td style="padding:10px 12px;border-bottom:1px solid var(--zs-border);">${(row as Record<string, unknown>)[c.field] ?? ''}</td>`)}
                </tr>
              `)}
              ${rows.length === 0 ? html`<tr><td colspan="${cfg.columns.length}" style="padding:24px;text-align:center;color:var(--zs-text-muted);">Sin datos</td></tr>` : ''}
            </tbody>
          </table>
        </slot>
      </div>
    `;
  }

  // ─── Chart Page ───────────────────────────────────

  private renderChartPage(page: PageConfig): TemplateResult {
    const cfg = page.chartConfig;
    if (!cfg) return html``;

    return html`
      <div class="zs-cards-grid" style="grid-template-columns: repeat(${cfg.columns ?? 2}, 1fr);">
        ${cfg.charts.map(chart => {
          const dsData = this.pageData[chart.dataSourceId];
          const chartData = Array.isArray(dsData)
            ? dsData.map((item: Record<string, unknown>) => ({
                label: String(item[chart.labelField] ?? ''),
                value: Number(item[chart.valueFields[0]] ?? 0),
              }))
            : [];

          return html`
            <div style="${chart.colSpan ? `grid-column: span ${chart.colSpan}` : ''}">
              <zs-field-chart
                .label="${chart.title}"
                .chartType="${chart.type}"
                .data="${chartData}"
                .height="${chart.height ?? 250}"
              ></zs-field-chart>
            </div>
          `;
        })}
      </div>
    `;
  }

  // ─── Tabs Page ────────────────────────────────────

  @state() private activeTab = 0;

  private renderTabsPage(page: PageConfig): TemplateResult {
    const cfg = page.tabsConfig;
    if (!cfg) return html``;

    const tab = cfg.tabs[this.activeTab];
    const tabPage = this.config?.pages.find(p => p.id === tab?.pageId);

    return html`
      <div style="display:flex;gap:0;border-bottom:2px solid var(--zs-border);margin-bottom:16px;">
        ${cfg.tabs.map((t, i) => html`
          <button style="padding:10px 20px;cursor:pointer;border:none;background:none;font-family:var(--zs-font-family);font-size:14px;color:${i === this.activeTab ? 'var(--zs-primary)' : 'var(--zs-text-secondary)'};border-bottom:2px solid ${i === this.activeTab ? 'var(--zs-primary)' : 'transparent'};margin-bottom:-2px;font-weight:${i === this.activeTab ? '500' : '400'};"
            @click="${() => { this.activeTab = i; }}"
          >${t.icon ? `${t.icon} ` : ''}${t.title}</button>
        `)}
      </div>
      ${tabPage ? this.renderPageContent(tabPage) : html`<div>Tab page not found: ${tab?.pageId}</div>`}
    `;
  }

  // ─── Public API ───────────────────────────────────

  /** Navigate to a page segment programmatically */
  navigateTo(segment: string) { this.navigate(segment); }

  /** Get current page segment */
  getCurrentSegment(): string { return this.currentSegment; }

  /** Get fetched data for current page */
  getPageData(): Record<string, unknown> { return { ...this.pageData }; }

  /** Reload current page data */
  async reloadData() { await this.loadPageData(); }

  /** Update page data externally */
  setPageData(data: Record<string, unknown>) {
    this.pageData = { ...this.pageData, ...data };
    this.renderKey++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zentto-studio-app': ZenttoStudioApp;
  }
}
