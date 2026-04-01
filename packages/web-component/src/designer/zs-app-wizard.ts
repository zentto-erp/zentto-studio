// @zentto/studio — App Creation Wizard
// Step-by-step wizard to create an AppConfig from a template
// Steps: 1) Template → 2) Branding → 3) Menu → 4) Data Sources → 5) Pages → 6) Style & Theme → 7) Preview

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens, fieldBaseStyles } from '../styles/tokens.js';
import type { AppConfig, NavItem, PageConfig, BrandingConfig, CardItem } from '@zentto/studio-core';
import type { DataSourceConfig, ThemeConfig } from '@zentto/studio-core';
import { listAppTemplates, getAppTemplate } from '@zentto/studio-core';
import { listLandingTemplates, getLandingTemplate } from '@zentto/studio-core';
import { generateReactComponent, generateNextPage, generateAppPage } from '@zentto/studio-core';
import type { AppTemplateId } from '@zentto/studio-core';

// Import the app component for preview
import '../zentto-studio-app.js';

interface WizardStep {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const STEPS: WizardStep[] = [
  { id: 'template', title: 'Plantilla', icon: '📋', description: 'Elige una plantilla base' },
  { id: 'branding', title: 'Marca', icon: '🎨', description: 'Personaliza tu aplicacion' },
  { id: 'navigation', title: 'Menu', icon: '📑', description: 'Configura el sidebar' },
  { id: 'datasources', title: 'Fuentes de Datos', icon: '🔗', description: 'Conecta tus APIs y servicios' },
  { id: 'pages', title: 'Paginas', icon: '📄', description: 'Agrega paginas y contenido' },
  { id: 'theme', title: 'Estilo y Tema', icon: '🎭', description: 'Personaliza colores y tipografia' },
  { id: 'preview', title: 'Vista Previa', icon: '👁️', description: 'Revisa, exporta y finaliza' },
];

const SIDEBAR_STYLES = [
  { value: 'dark', label: 'Oscuro', preview: '#1e1e2d' },
  { value: 'light', label: 'Claro', preview: '#ffffff' },
  { value: 'branded', label: 'Marca', preview: '#e67e22' },
];

const ICON_PALETTE = [
  '📊', '👥', '📦', '💰', '🛒', '📄', '📋', '➕', '⚙️', '📈',
  '🏢', '🏦', '🌐', '🚚', '✅', '🤝', '📅', '🔍', '📝', '🏷️',
  '⭐', '🎯', '💼', '📱', '🖥️', '🔔', '🔒', '📂', '🗂️', '💡',
  '🏠', '🍽️', '🏖️', '🕐', '👷', '🛡️', '🎓', '🏭', '✈️', '🔧',
];

const COLOR_PALETTE = [
  '#e67e22', '#3498db', '#27ae60', '#e74c3c', '#9b59b6',
  '#f39c12', '#1abc9c', '#34495e', '#e91e63', '#00bcd4',
  '#ff6b6b', '#6bcb77', '#4ecdc4', '#45b7d1', '#96ceb4',
  '#ffd93d', '#ff69b4', '#a29bfe', '#fd79a8', '#2d3436',
];

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

const THEME_MODES = [
  { value: 'light', label: 'Claro', icon: '☀️' },
  { value: 'dark', label: 'Oscuro', icon: '🌙' },
  { value: 'auto', label: 'Automatico', icon: '🔄' },
] as const;

const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Poppins, sans-serif',
  'Nunito, sans-serif',
  'system-ui, sans-serif',
  'Georgia, serif',
  'Fira Code, monospace',
];

const RADIUS_OPTIONS = [
  { value: 0, label: 'Sin bordes' },
  { value: 4, label: 'Sutil (4px)' },
  { value: 8, label: 'Medio (8px)' },
  { value: 12, label: 'Redondeado (12px)' },
  { value: 20, label: 'Pill (20px)' },
];

@customElement('zs-app-wizard')
export class ZsAppWizard extends LitElement {
  static styles = [studioTokens, fieldBaseStyles, css`
    :host { display: block; font-family: var(--zs-font-family); }

    .wizard {
      max-width: 900px; margin: 0 auto;
      background: var(--zs-bg); border-radius: 12px;
      border: 1px solid var(--zs-border);
      overflow: hidden;
    }

    /* Steps bar */
    .wizard-steps {
      display: flex; background: var(--zs-bg-secondary);
      border-bottom: 1px solid var(--zs-border); padding: 0;
      overflow-x: auto;
    }
    .wizard-step {
      flex: 1; display: flex; align-items: center; gap: 6px;
      padding: 14px 12px; cursor: pointer;
      color: var(--zs-text-muted); font-size: 12px;
      border-bottom: 3px solid transparent;
      transition: all 150ms; min-width: 0; white-space: nowrap;
    }
    .wizard-step:hover { color: var(--zs-text-secondary); }
    .wizard-step--active {
      color: var(--zs-primary); border-bottom-color: var(--zs-primary);
      font-weight: 500;
    }
    .wizard-step--done { color: var(--zs-success); }
    .wizard-step-icon { font-size: 16px; }
    .wizard-step-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Body */
    .wizard-body { padding: 32px; min-height: 400px; }
    .wizard-title { font-size: 22px; font-weight: 600; margin: 0 0 4px; color: var(--zs-text); }
    .wizard-desc { font-size: 14px; color: var(--zs-text-secondary); margin: 0 0 24px; }

    /* Footer */
    .wizard-footer {
      display: flex; justify-content: space-between;
      padding: 16px 32px; border-top: 1px solid var(--zs-border);
      background: var(--zs-bg-secondary);
    }

    /* Template cards */
    .template-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .template-card {
      padding: 24px; border: 2px solid var(--zs-border);
      border-radius: 12px; cursor: pointer;
      transition: all 200ms; text-align: center;
    }
    .template-card:hover { border-color: var(--zs-primary); transform: translateY(-2px); box-shadow: 0 4px 12px var(--zs-shadow); }
    .template-card--selected { border-color: var(--zs-primary); background: var(--zs-primary-light); }
    .template-icon { font-size: 40px; margin-bottom: 12px; }
    .template-title { font-size: 16px; font-weight: 600; color: var(--zs-text); }
    .template-desc { font-size: 13px; color: var(--zs-text-secondary); margin-top: 4px; }

    /* Form groups */
    .form-group { margin-bottom: 20px; }
    .form-label { font-size: 13px; font-weight: 500; color: var(--zs-text); margin-bottom: 6px; display: block; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-row-3 { grid-template-columns: 1fr 1fr 1fr; }
    .form-row-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

    /* Color picker grid */
    .color-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .color-swatch {
      width: 36px; height: 36px; border-radius: 8px;
      cursor: pointer; border: 3px solid transparent;
      transition: all 150ms;
    }
    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch--selected { border-color: var(--zs-text); box-shadow: 0 0 0 2px white, 0 0 0 4px var(--zs-text); }

    /* Sidebar style picker */
    .style-grid { display: flex; gap: 12px; }
    .style-option {
      flex: 1; padding: 16px; text-align: center;
      border: 2px solid var(--zs-border); border-radius: 8px;
      cursor: pointer; transition: all 150ms;
    }
    .style-option:hover { border-color: var(--zs-primary); }
    .style-option--selected { border-color: var(--zs-primary); background: var(--zs-primary-light); }
    .style-preview {
      width: 60px; height: 40px; border-radius: 4px;
      margin: 0 auto 8px; border: 1px solid var(--zs-border);
    }

    /* Nav editor */
    .nav-list { border: 1px solid var(--zs-border); border-radius: 8px; overflow: hidden; }
    .nav-item-row {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; border-bottom: 1px solid var(--zs-border);
      font-size: 14px;
    }
    .nav-item-row:last-child { border-bottom: none; }
    .nav-item-icon { font-size: 18px; cursor: pointer; }
    .nav-item-title { flex: 1; }
    .nav-item-actions { display: flex; gap: 4px; }
    .nav-item-btn {
      border: none; background: none; cursor: pointer;
      font-size: 14px; padding: 2px 6px; border-radius: 4px;
      color: var(--zs-text-muted); transition: all 100ms;
    }
    .nav-item-btn:hover { background: var(--zs-bg-hover); color: var(--zs-text); }
    .nav-item-btn--danger:hover { color: var(--zs-danger); }
    .add-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; margin-top: 12px;
      border: 1px dashed var(--zs-border); border-radius: 8px;
      background: none; cursor: pointer;
      font-family: var(--zs-font-family); font-size: 13px;
      color: var(--zs-text-secondary); transition: all 150ms;
    }
    .add-btn:hover { border-color: var(--zs-primary); color: var(--zs-primary); }

    /* Icon picker */
    .icon-grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .icon-btn {
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      border: 1px solid transparent; border-radius: 6px;
      cursor: pointer; font-size: 18px; background: none;
      transition: all 100ms;
    }
    .icon-btn:hover { background: var(--zs-bg-hover); border-color: var(--zs-border); }
    .icon-btn--selected { background: var(--zs-primary-light); border-color: var(--zs-primary); }

    /* Preview */
    .preview-container {
      border: 1px solid var(--zs-border); border-radius: 8px;
      height: 500px; overflow: hidden;
    }

    /* Buttons */
    .btn {
      padding: 10px 24px; border-radius: var(--zs-radius);
      font-family: var(--zs-font-family); font-size: 14px;
      font-weight: 500; cursor: pointer; border: 1px solid transparent;
      transition: all 150ms;
    }
    .btn--primary { background: var(--zs-primary); color: white; }
    .btn--primary:hover { background: var(--zs-primary-hover); }
    .btn--secondary { background: var(--zs-bg); color: var(--zs-text); border-color: var(--zs-border); }
    .btn--secondary:hover { background: var(--zs-bg-hover); }
    .btn--success { background: var(--zs-success); color: white; }
    .btn--success:hover { opacity: 0.9; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Data source rows */
    .ds-card {
      border: 1px solid var(--zs-border); border-radius: 8px;
      padding: 16px; margin-bottom: 12px;
      background: var(--zs-bg);
    }
    .ds-card-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px;
    }
    .ds-card-title { font-size: 14px; font-weight: 500; color: var(--zs-text); }
    .ds-method-badge {
      display: inline-block; padding: 2px 8px; border-radius: 4px;
      font-size: 11px; font-weight: 600; color: white;
    }
    .ds-method-GET { background: #27ae60; }
    .ds-method-POST { background: #3498db; }
    .ds-method-PUT { background: #e67e22; }
    .ds-method-PATCH { background: #9b59b6; }
    .ds-method-DELETE { background: #e74c3c; }

    /* Theme preview card */
    .theme-preview-card {
      border: 1px solid var(--zs-border); border-radius: 12px;
      padding: 24px; margin-top: 20px;
      transition: all 200ms;
    }
    .theme-preview-header {
      font-size: 16px; font-weight: 600; margin-bottom: 8px;
    }
    .theme-preview-text {
      font-size: 13px; margin-bottom: 16px; opacity: 0.7;
    }
    .theme-preview-btn {
      display: inline-block; padding: 8px 20px;
      border: none; border-radius: 8px;
      color: white; font-size: 13px; font-weight: 500;
    }
    .theme-preview-input {
      display: inline-block; padding: 6px 12px;
      border: 1px solid; border-radius: 8px;
      font-size: 13px; margin-left: 8px; width: 150px;
    }

    /* Code modal */
    .code-modal-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.5); display: flex;
      align-items: center; justify-content: center;
    }
    .code-modal {
      background: var(--zs-bg); border-radius: 12px;
      width: 90%; max-width: 800px; max-height: 80vh;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .code-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--zs-border);
    }
    .code-modal-header h3 { margin: 0; font-size: 16px; }
    .code-modal-body {
      flex: 1; overflow: auto; padding: 0;
    }
    .code-modal-body pre {
      margin: 0; padding: 20px; font-size: 13px;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      line-height: 1.5; white-space: pre-wrap; word-break: break-word;
      background: var(--zs-bg-secondary); min-height: 200px;
    }
    .code-modal-footer {
      display: flex; gap: 8px; justify-content: flex-end;
      padding: 12px 20px; border-top: 1px solid var(--zs-border);
    }

    /* Export buttons row */
    .export-row {
      display: flex; gap: 8px; flex-wrap: wrap;
    }
  `];

  @property({ type: Object }) initialConfig: AppConfig | null = null;

  @state() private currentStep = 0;
  @state() private selectedTemplate: AppTemplateId | null = null;
  @state() private config: AppConfig | null = null;
  @state() private editingNavIndex = -1;
  @state() private showIconPicker = false;
  @state() private iconPickerTarget: 'nav' | 'branding' = 'nav';

  // Landing template selection
  @state() private _landingTemplateId = '';

  // Code export modal
  @state() private codeModalOpen = false;
  @state() private codeModalTitle = '';
  @state() private codeModalContent = '';

  connectedCallback() {
    super.connectedCallback();
    if (this.initialConfig) {
      this.config = structuredClone(this.initialConfig);
      this.currentStep = 1; // skip template selection
    }
  }

  // ─── Navigation ───────────────────────────────────

  private canNext(): boolean {
    if (this.currentStep === 0) return this.selectedTemplate != null || this._landingTemplateId !== '' || this.config != null;
    return this.config != null;
  }

  private next() {
    if (this.currentStep === 0 && !this.config && this.selectedTemplate) {
      this.config = getAppTemplate(this.selectedTemplate);
    } else if (this.currentStep === 0 && !this.config && this._landingTemplateId) {
      this.config = getLandingTemplate(this._landingTemplateId);
    }
    if (this.currentStep < STEPS.length - 1) this.currentStep++;
  }

  private prev() {
    if (this.currentStep > 0) this.currentStep--;
  }

  private finish() {
    if (!this.config) return;
    this.dispatchEvent(new CustomEvent('wizard-complete', {
      detail: { config: structuredClone(this.config) },
      bubbles: true, composed: true,
    }));
  }

  // ─── Helpers ──────────────────────────────────────

  private ensureTheme(): ThemeConfig {
    if (!this.config!.theme) {
      this.config!.theme = { mode: 'light' };
    }
    return this.config!.theme;
  }

  private ensureDataSources(): DataSourceConfig[] {
    if (!this.config!.dataSources) {
      this.config!.dataSources = [];
    }
    return this.config!.dataSources;
  }

  // ─── Render ───────────────────────────────────────

  render() {
    return html`
      <div class="wizard">
        <div class="wizard-steps">
          ${STEPS.map((step, i) => html`
            <div class="wizard-step ${i === this.currentStep ? 'wizard-step--active' : i < this.currentStep ? 'wizard-step--done' : ''}"
              @click="${() => { if (i <= this.currentStep || this.config) this.currentStep = i; }}">
              <span class="wizard-step-icon">${i < this.currentStep ? '✓' : step.icon}</span>
              <span class="wizard-step-title">${step.title}</span>
            </div>
          `)}
        </div>

        <div class="wizard-body">
          <h2 class="wizard-title">${STEPS[this.currentStep].title}</h2>
          <p class="wizard-desc">${STEPS[this.currentStep].description}</p>

          ${this.currentStep === 0 ? this.renderTemplateStep() :
            this.currentStep === 1 ? this.renderBrandingStep() :
            this.currentStep === 2 ? this.renderNavStep() :
            this.currentStep === 3 ? this.renderDataSourcesStep() :
            this.currentStep === 4 ? this.renderPagesStep() :
            this.currentStep === 5 ? this.renderThemeStep() :
            this.renderPreviewStep()}
        </div>

        <div class="wizard-footer">
          <button class="btn btn--secondary" ?disabled="${this.currentStep === 0}" @click="${this.prev}">Anterior</button>
          ${this.currentStep < STEPS.length - 1
            ? html`<button class="btn btn--primary" ?disabled="${!this.canNext()}" @click="${this.next}">Siguiente</button>`
            : html`<button class="btn btn--success" @click="${this.finish}">Crear Aplicacion</button>`
          }
        </div>
      </div>

      ${this.codeModalOpen ? this.renderCodeModal() : nothing}
    `;
  }

  // ─── Step 1: Template Selection ──────────────────

  private renderTemplateStep() {
    const templates = listAppTemplates();
    const landingTemplates = listLandingTemplates();

    return html`
      <div style="font-size:13px;font-weight:600;color:var(--zs-text);margin-bottom:12px;">Aplicaciones</div>
      <div class="template-grid">
        ${templates.map(t => html`
          <div class="template-card ${this.selectedTemplate === t.id ? 'template-card--selected' : ''}"
            @click="${() => { this.selectedTemplate = t.id as AppTemplateId; this._landingTemplateId = ''; }}">
            <div class="template-icon">${t.icon}</div>
            <div class="template-title">${t.title}</div>
            <div class="template-desc">${t.description}</div>
          </div>
        `)}
      </div>

      <div style="font-size:13px;font-weight:600;color:var(--zs-text);margin:24px 0 12px;">Landing Pages</div>
      <div class="template-grid">
        ${landingTemplates.map(t => html`
          <div class="template-card ${this._landingTemplateId === t.id ? 'template-card--selected' : ''}"
            @click="${() => { this._landingTemplateId = t.id; this.selectedTemplate = null; }}">
            <div class="template-icon">${t.icon}</div>
            <div class="template-title">${t.title}</div>
            <div class="template-desc">${t.description}</div>
          </div>
        `)}
      </div>
    `;
  }

  // ─── Step 2: Branding ─────────────────────────────

  private renderBrandingStep() {
    if (!this.config) return nothing;
    const b = this.config.branding;

    return html`
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nombre de la App</label>
          <input class="zs-input" .value="${b.title ?? ''}" @input="${(e: Event) => { this.config!.branding.title = (e.target as HTMLInputElement).value; this.requestUpdate(); }}" />
        </div>
        <div class="form-group">
          <label class="form-label">Subtitulo</label>
          <input class="zs-input" .value="${b.subtitle ?? ''}" @input="${(e: Event) => { this.config!.branding.subtitle = (e.target as HTMLInputElement).value; this.requestUpdate(); }}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Color Principal</label>
        <div class="color-grid">
          ${COLOR_PALETTE.map(color => html`
            <div class="color-swatch ${b.primaryColor === color ? 'color-swatch--selected' : ''}"
              style="background: ${color}"
              @click="${() => { this.config!.branding.primaryColor = color; this.requestUpdate(); }}"
            ></div>
          `)}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Estilo del Sidebar</label>
        <div class="style-grid">
          ${SIDEBAR_STYLES.map(s => html`
            <div class="style-option ${b.sidebarStyle === s.value ? 'style-option--selected' : ''}"
              @click="${() => { this.config!.branding.sidebarStyle = s.value as 'dark' | 'light' | 'branded'; this.requestUpdate(); }}">
              <div class="style-preview" style="background: ${s.preview}"></div>
              <div style="font-size:13px;font-weight:500;">${s.label}</div>
            </div>
          `)}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">URL del Logo (opcional)</label>
        <input class="zs-input" .value="${b.logo ?? ''}" placeholder="https://..." @input="${(e: Event) => { this.config!.branding.logo = (e.target as HTMLInputElement).value; this.requestUpdate(); }}" />
      </div>
    `;
  }

  // ─── Step 3: Navigation Editor ────────────────────

  private renderNavStep() {
    if (!this.config) return nothing;

    return html`
      <div class="nav-list">
        ${this.config.navigation.map((item, i) => html`
          <div class="nav-item-row">
            <span class="nav-item-icon" @click="${() => { this.editingNavIndex = i; this.showIconPicker = !this.showIconPicker; }}">${item.icon ?? (item.kind === 'header' ? '📌' : item.kind === 'divider' ? '—' : '📄')}</span>
            ${item.kind === 'divider'
              ? html`<span class="nav-item-title" style="color:var(--zs-text-muted);font-style:italic;">Separador</span>`
              : html`<input class="zs-input" style="height:32px;font-size:13px;" .value="${item.title ?? ''}" @input="${(e: Event) => { this.config!.navigation[i].title = (e.target as HTMLInputElement).value; this.requestUpdate(); }}" />`
            }
            <div class="nav-item-actions">
              <button class="nav-item-btn" title="Subir" @click="${() => this.moveNav(i, -1)}">↑</button>
              <button class="nav-item-btn" title="Bajar" @click="${() => this.moveNav(i, 1)}">↓</button>
              <button class="nav-item-btn nav-item-btn--danger" title="Eliminar" @click="${() => { this.config!.navigation.splice(i, 1); this.requestUpdate(); }}">✕</button>
            </div>
          </div>
        `)}
      </div>

      ${this.showIconPicker ? html`
        <div style="margin-top:12px;padding:12px;border:1px solid var(--zs-border);border-radius:8px;">
          <div style="font-size:12px;color:var(--zs-text-secondary);margin-bottom:8px;">Selecciona un icono:</div>
          <div class="icon-grid">
            ${ICON_PALETTE.map(icon => html`
              <button class="icon-btn" @click="${() => {
                if (this.editingNavIndex >= 0) {
                  this.config!.navigation[this.editingNavIndex].icon = icon;
                  this.showIconPicker = false;
                  this.requestUpdate();
                }
              }}">${icon}</button>
            `)}
          </div>
        </div>
      ` : ''}

      <div style="display:flex;gap:8px;">
        <button class="add-btn" @click="${() => this.addNavItem('page')}">➕ Pagina</button>
        <button class="add-btn" @click="${() => this.addNavItem('header')}">📌 Seccion</button>
        <button class="add-btn" @click="${() => this.addNavItem('divider')}">— Separador</button>
      </div>
    `;
  }

  private addNavItem(kind: 'page' | 'header' | 'divider') {
    if (!this.config) return;
    if (kind === 'divider') {
      this.config.navigation.push({ kind: 'divider' });
    } else if (kind === 'header') {
      this.config.navigation.push({ kind: 'header', title: 'Nueva Seccion' });
    } else {
      const id = `page-${Date.now()}`;
      this.config.navigation.push({ segment: id, title: 'Nueva Pagina', icon: '📄' });
      // Auto-create page
      this.config.pages.push({ id, segment: id, title: 'Nueva Pagina', content: 'empty' });
    }
    this.requestUpdate();
  }

  private moveNav(index: number, dir: -1 | 1) {
    if (!this.config) return;
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= this.config.navigation.length) return;
    const items = this.config.navigation;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    this.requestUpdate();
  }

  // ─── Step 4: Data Sources ─────────────────────────

  private renderDataSourcesStep() {
    if (!this.config) return nothing;
    const sources = this.ensureDataSources();

    return html`
      ${sources.length === 0 ? html`
        <div style="text-align:center;padding:40px 20px;color:var(--zs-text-muted);">
          <div style="font-size:40px;margin-bottom:12px;">🔗</div>
          <div style="font-size:14px;">No hay fuentes de datos configuradas.</div>
          <div style="font-size:13px;margin-top:4px;">Agrega APIs REST para conectar tus paginas con datos reales.</div>
        </div>
      ` : nothing}

      ${sources.map((ds, i) => html`
        <div class="ds-card">
          <div class="ds-card-header">
            <span class="ds-card-title">${ds.name || `Fuente ${i + 1}`}</span>
            <div style="display:flex;gap:8px;align-items:center;">
              <span class="ds-method-badge ds-method-${ds.method ?? 'GET'}">${ds.method ?? 'GET'}</span>
              <button class="nav-item-btn nav-item-btn--danger" title="Eliminar"
                @click="${() => { sources.splice(i, 1); this.requestUpdate(); }}">✕</button>
            </div>
          </div>

          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">ID</label>
              <input class="zs-input" .value="${ds.id}" @input="${(e: Event) => {
                ds.id = (e.target as HTMLInputElement).value;
                this.requestUpdate();
              }}" placeholder="customers" />
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Nombre</label>
              <input class="zs-input" .value="${ds.name}" @input="${(e: Event) => {
                ds.name = (e.target as HTMLInputElement).value;
                this.requestUpdate();
              }}" placeholder="Clientes" />
            </div>
          </div>

          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group" style="margin-bottom:0;grid-column:span 1;">
              <label class="form-label">Metodo</label>
              <select class="zs-input" .value="${ds.method ?? 'GET'}" @change="${(e: Event) => {
                ds.method = (e.target as HTMLSelectElement).value as DataSourceConfig['method'];
                this.requestUpdate();
              }}">
                ${HTTP_METHODS.map(m => html`<option value="${m}" ?selected="${ds.method === m}">${m}</option>`)}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Intervalo de refresco (ms)</label>
              <input class="zs-input" type="number" .value="${String(ds.refreshInterval ?? '')}" placeholder="0 = sin polling"
                @input="${(e: Event) => {
                  const v = parseInt((e.target as HTMLInputElement).value);
                  ds.refreshInterval = isNaN(v) || v <= 0 ? undefined : v;
                  this.requestUpdate();
                }}" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom:12px;">
            <label class="form-label">URL</label>
            <input class="zs-input" .value="${ds.url ?? ''}" @input="${(e: Event) => {
              ds.url = (e.target as HTMLInputElement).value;
              this.requestUpdate();
            }}" placeholder="https://api.ejemplo.com/v1/resource" />
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Headers (JSON, opcional)</label>
            <textarea class="zs-input" rows="2" style="font-family:monospace;font-size:12px;resize:vertical;"
              .value="${ds.headers ? JSON.stringify(ds.headers, null, 2) : ''}"
              placeholder='{ "Authorization": "Bearer ..." }'
              @change="${(e: Event) => {
                const raw = (e.target as HTMLTextAreaElement).value.trim();
                if (!raw) { ds.headers = undefined; this.requestUpdate(); return; }
                try { ds.headers = JSON.parse(raw); } catch { /* ignore invalid JSON */ }
                this.requestUpdate();
              }}"
            ></textarea>
          </div>
        </div>
      `)}

      <button class="add-btn" @click="${() => {
        const id = `ds-${Date.now()}`;
        this.ensureDataSources().push({
          id,
          name: '',
          type: 'rest',
          url: '',
          method: 'GET',
          autoFetch: true,
        });
        this.requestUpdate();
      }}">🔗 Nueva Fuente de Datos</button>
    `;
  }

  // ─── Step 5: Pages ────────────────────────────────

  private renderPagesStep() {
    if (!this.config) return nothing;

    return html`
      <div class="nav-list">
        ${this.config.pages.map((page, i) => html`
          <div class="nav-item-row">
            <span class="nav-item-icon">${this.getContentIcon(page.content)}</span>
            <div style="flex:1;">
              <input class="zs-input" style="height:30px;font-size:13px;margin-bottom:4px;" .value="${page.title}" @input="${(e: Event) => { this.config!.pages[i].title = (e.target as HTMLInputElement).value; this.requestUpdate(); }}" />
              <div style="display:flex;gap:8px;align-items:center;">
                <span style="font-size:11px;color:var(--zs-text-muted);">/${page.segment}</span>
                <select style="font-size:11px;padding:2px 6px;border:1px solid var(--zs-border);border-radius:4px;" .value="${page.content}" @change="${(e: Event) => { this.config!.pages[i].content = (e.target as HTMLSelectElement).value as any; this.requestUpdate(); }}">
                  <option value="empty">Vacia</option>
                  <option value="cards">Cards/Dashboard</option>
                  <option value="datagrid">Grid de Datos</option>
                  <option value="schema">Formulario</option>
                  <option value="chart">Graficos</option>
                  <option value="html">HTML</option>
                  <option value="iframe">iFrame</option>
                  <option value="tabs">Tabs</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <button class="nav-item-btn nav-item-btn--danger" @click="${() => { this.config!.pages.splice(i, 1); this.requestUpdate(); }}">✕</button>
          </div>
        `)}
      </div>
      <button class="add-btn" @click="${() => {
        const id = `page-${Date.now()}`;
        this.config!.pages.push({ id, segment: id, title: 'Nueva Pagina', content: 'empty' });
        this.requestUpdate();
      }}">➕ Nueva Pagina</button>
    `;
  }

  private getContentIcon(type: string): string {
    const icons: Record<string, string> = {
      cards: '🏠', datagrid: '📊', schema: '📝', chart: '📈',
      html: '🌐', iframe: '🖼️', tabs: '📑', empty: '📄',
      custom: '🧩', split: '📐', report: '📋',
    };
    return icons[type] ?? '📄';
  }

  // ─── Step 6: Style & Theme ────────────────────────

  private renderThemeStep() {
    if (!this.config) return nothing;
    const theme = this.ensureTheme();

    return html`
      <!-- Theme mode -->
      <div class="form-group">
        <label class="form-label">Modo de Tema</label>
        <div class="style-grid">
          ${THEME_MODES.map(m => html`
            <div class="style-option ${theme.mode === m.value ? 'style-option--selected' : ''}"
              @click="${() => { theme.mode = m.value as ThemeConfig['mode']; this.requestUpdate(); }}">
              <div style="font-size:28px;margin-bottom:6px;">${m.icon}</div>
              <div style="font-size:13px;font-weight:500;">${m.label}</div>
            </div>
          `)}
        </div>
      </div>

      <!-- Primary color -->
      <div class="form-group">
        <label class="form-label">Color Primario (--zs-primary)</label>
        <div class="color-grid">
          ${COLOR_PALETTE.map(color => html`
            <div class="color-swatch ${theme.primaryColor === color ? 'color-swatch--selected' : ''}"
              style="background: ${color}"
              @click="${() => { theme.primaryColor = color; this.requestUpdate(); }}"
            ></div>
          `)}
        </div>
      </div>

      <!-- Font family -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tipografia (--zs-font)</label>
          <select class="zs-input" .value="${theme.fontFamily ?? 'Inter, sans-serif'}" @change="${(e: Event) => {
            theme.fontFamily = (e.target as HTMLSelectElement).value;
            this.requestUpdate();
          }}">
            ${FONT_OPTIONS.map(f => html`<option value="${f}" ?selected="${theme.fontFamily === f}">${f.split(',')[0]}</option>`)}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Border Radius (--zs-radius)</label>
          <select class="zs-input" .value="${String(theme.borderRadius ?? 8)}" @change="${(e: Event) => {
            theme.borderRadius = parseInt((e.target as HTMLSelectElement).value);
            this.requestUpdate();
          }}">
            ${RADIUS_OPTIONS.map(r => html`<option value="${r.value}" ?selected="${theme.borderRadius === r.value}">${r.label}</option>`)}
          </select>
        </div>
      </div>

      <!-- Accent color -->
      <div class="form-group">
        <label class="form-label">Color de Acento (--zs-accent, opcional)</label>
        <div class="color-grid">
          ${COLOR_PALETTE.map(color => html`
            <div class="color-swatch ${theme.accentColor === color ? 'color-swatch--selected' : ''}"
              style="background: ${color}"
              @click="${() => { theme.accentColor = color; this.requestUpdate(); }}"
            ></div>
          `)}
        </div>
      </div>

      <!-- Font size & spacing -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tamano de Fuente Base (px)</label>
          <input class="zs-input" type="number" min="10" max="22" .value="${String(theme.fontSize ?? 14)}" @input="${(e: Event) => {
            theme.fontSize = parseInt((e.target as HTMLInputElement).value) || 14;
            this.requestUpdate();
          }}" />
        </div>
        <div class="form-group">
          <label class="form-label">Espaciado Base (px)</label>
          <input class="zs-input" type="number" min="2" max="16" .value="${String(theme.spacing ?? 8)}" @input="${(e: Event) => {
            theme.spacing = parseInt((e.target as HTMLInputElement).value) || 8;
            this.requestUpdate();
          }}" />
        </div>
      </div>

      <!-- Mini preview -->
      <div class="theme-preview-card" style="
        background: ${theme.mode === 'dark' ? '#1e1e2d' : '#ffffff'};
        color: ${theme.mode === 'dark' ? '#e0e0e0' : '#333333'};
        font-family: ${theme.fontFamily ?? 'Inter, sans-serif'};
        font-size: ${theme.fontSize ?? 14}px;
        border-radius: ${theme.borderRadius ?? 8}px;
      ">
        <div class="theme-preview-header" style="color: ${theme.primaryColor ?? '#3498db'};">
          Vista previa del tema
        </div>
        <div class="theme-preview-text">
          Asi se vera tu aplicacion con estos ajustes de estilo.
        </div>
        <span class="theme-preview-btn" style="
          background: ${theme.primaryColor ?? '#3498db'};
          border-radius: ${theme.borderRadius ?? 8}px;
        ">Boton Primario</span>
        <input class="theme-preview-input" value="Campo de texto"
          style="
            border-color: ${theme.mode === 'dark' ? '#444' : '#ccc'};
            border-radius: ${theme.borderRadius ?? 8}px;
            background: ${theme.mode === 'dark' ? '#2a2a3d' : '#f9f9f9'};
            color: ${theme.mode === 'dark' ? '#e0e0e0' : '#333'};
            font-family: ${theme.fontFamily ?? 'Inter, sans-serif'};
          "
          readonly
        />
      </div>
    `;
  }

  // ─── Step 7: Preview ──────────────────────────────

  private renderPreviewStep() {
    if (!this.config) return nothing;

    const navPageCount = this.config.navigation.filter(
      n => n.kind !== 'divider' && n.kind !== 'header',
    ).length;
    const dsCount = this.config.dataSources?.length ?? 0;

    return html`
      <div style="display:flex;gap:16px;margin-bottom:16px;align-items:center;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-size:13px;color:var(--zs-text-secondary);margin-bottom:4px;">Resumen:</div>
          <div style="font-size:14px;">
            <strong>${this.config.branding.title}</strong> —
            ${this.config.pages.length} paginas,
            ${navPageCount} items en menu${dsCount > 0 ? `, ${dsCount} fuentes de datos` : ''}
          </div>
        </div>
      </div>

      <!-- Export buttons -->
      <div class="export-row" style="margin-bottom:16px;">
        <button class="btn btn--secondary" @click="${this.exportJson}">📋 Exportar JSON</button>
        <button class="btn btn--secondary" @click="${this.exportReactCode}">⚛️ Exportar Codigo React</button>
        <button class="btn btn--secondary" @click="${this.exportNextCode}">▲ Exportar Codigo Next.js</button>
        <button class="btn btn--secondary" @click="${() => {
          const json = JSON.stringify(this.config, null, 2);
          navigator.clipboard.writeText(json).then(() => {
            alert('JSON copiado al portapapeles');
          });
        }}">📎 Copiar JSON</button>
      </div>

      <div class="preview-container">
        <zentto-studio-app .config="${this.config}"></zentto-studio-app>
      </div>
    `;
  }

  // ─── Export Handlers ──────────────────────────────

  private exportJson() {
    if (!this.config) return;
    const json = JSON.stringify(this.config, null, 2);
    this.openCodeModal('Exportar JSON — AppConfig', json);
  }

  private exportReactCode() {
    if (!this.config) return;
    const code = generateAppPage(this.config, {
      framework: 'react',
      useClientDirective: false,
    });
    this.openCodeModal('Exportar Codigo React', code);
  }

  private exportNextCode() {
    if (!this.config) return;
    const code = generateAppPage(this.config, {
      framework: 'nextjs',
      useClientDirective: true,
    });
    this.openCodeModal('Exportar Codigo Next.js', code);
  }

  private openCodeModal(title: string, content: string) {
    this.codeModalTitle = title;
    this.codeModalContent = content;
    this.codeModalOpen = true;
  }

  private closeCodeModal() {
    this.codeModalOpen = false;
    this.codeModalTitle = '';
    this.codeModalContent = '';
  }

  private copyCodeToClipboard() {
    navigator.clipboard.writeText(this.codeModalContent).then(() => {
      // Briefly change button text via a subtle approach
      alert('Codigo copiado al portapapeles');
    });
  }

  private downloadCode() {
    const isJson = this.codeModalTitle.includes('JSON');
    const ext = isJson ? 'json' : 'tsx';
    const mime = isJson ? 'application/json' : 'text/typescript';
    const filename = isJson ? 'app-config.json' : 'StudioApp.tsx';

    const blob = new Blob([this.codeModalContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Code Modal ───────────────────────────────────

  private renderCodeModal() {
    return html`
      <div class="code-modal-overlay" @click="${(e: Event) => {
        if (e.target === e.currentTarget) this.closeCodeModal();
      }}">
        <div class="code-modal">
          <div class="code-modal-header">
            <h3>${this.codeModalTitle}</h3>
            <button class="nav-item-btn" @click="${this.closeCodeModal}" style="font-size:18px;">✕</button>
          </div>
          <div class="code-modal-body">
            <pre>${this.codeModalContent}</pre>
          </div>
          <div class="code-modal-footer">
            <button class="btn btn--secondary" @click="${this.downloadCode}">💾 Descargar</button>
            <button class="btn btn--primary" @click="${this.copyCodeToClipboard}">📋 Copiar</button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-app-wizard': ZsAppWizard;
  }
}
