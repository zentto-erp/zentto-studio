// @zentto/studio — App Creation Wizard
// Step-by-step wizard to create an AppConfig from a template
// Steps: 1) Template → 2) Branding → 3) Navigation → 4) Pages → 5) Preview

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens, fieldBaseStyles } from '../styles/tokens.js';
import type { AppConfig, NavItem, PageConfig, BrandingConfig, CardItem } from '@zentto/studio-core';
import { listAppTemplates, getAppTemplate } from '@zentto/studio-core';
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
  { id: 'pages', title: 'Paginas', icon: '📄', description: 'Agrega paginas y contenido' },
  { id: 'preview', title: 'Vista Previa', icon: '👁️', description: 'Revisa y finaliza' },
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
    }
    .wizard-step {
      flex: 1; display: flex; align-items: center; gap: 8px;
      padding: 16px 20px; cursor: pointer;
      color: var(--zs-text-muted); font-size: 13px;
      border-bottom: 3px solid transparent;
      transition: all 150ms;
    }
    .wizard-step:hover { color: var(--zs-text-secondary); }
    .wizard-step--active {
      color: var(--zs-primary); border-bottom-color: var(--zs-primary);
      font-weight: 500;
    }
    .wizard-step--done { color: var(--zs-success); }
    .wizard-step-icon { font-size: 18px; }
    .wizard-step-title { white-space: nowrap; }

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
  `];

  @property({ type: Object }) initialConfig: AppConfig | null = null;

  @state() private currentStep = 0;
  @state() private selectedTemplate: AppTemplateId | null = null;
  @state() private config: AppConfig | null = null;
  @state() private editingNavIndex = -1;
  @state() private showIconPicker = false;
  @state() private iconPickerTarget: 'nav' | 'branding' = 'nav';

  connectedCallback() {
    super.connectedCallback();
    if (this.initialConfig) {
      this.config = structuredClone(this.initialConfig);
      this.currentStep = 1; // skip template selection
    }
  }

  // ─── Navigation ───────────────────────────────────

  private canNext(): boolean {
    if (this.currentStep === 0) return this.selectedTemplate != null || this.config != null;
    return this.config != null;
  }

  private next() {
    if (this.currentStep === 0 && !this.config && this.selectedTemplate) {
      this.config = getAppTemplate(this.selectedTemplate);
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
            this.currentStep === 3 ? this.renderPagesStep() :
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
    `;
  }

  // ─── Step 1: Template Selection ──────────────────

  private renderTemplateStep() {
    const templates = listAppTemplates();

    return html`
      <div class="template-grid">
        ${templates.map(t => html`
          <div class="template-card ${this.selectedTemplate === t.id ? 'template-card--selected' : ''}"
            @click="${() => { this.selectedTemplate = t.id as AppTemplateId; }}">
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

  // ─── Step 4: Pages ────────────────────────────────

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

  // ─── Step 5: Preview ──────────────────────────────

  private renderPreviewStep() {
    if (!this.config) return nothing;

    return html`
      <div style="display:flex;gap:16px;margin-bottom:16px;">
        <div style="flex:1;">
          <div style="font-size:13px;color:var(--zs-text-secondary);margin-bottom:4px;">Resumen:</div>
          <div style="font-size:14px;"><strong>${this.config.branding.title}</strong> — ${this.config.pages.length} paginas, ${this.config.navigation.filter(n => n.kind !== 'divider' && n.kind !== 'header').length} items en menu</div>
        </div>
        <button class="btn btn--secondary" @click="${() => {
          const json = JSON.stringify(this.config, null, 2);
          navigator.clipboard.writeText(json).then(() => {
            alert('JSON copiado al portapapeles');
          });
        }}">📋 Copiar JSON</button>
      </div>
      <div class="preview-container">
        <zentto-studio-app .config="${this.config}"></zentto-studio-app>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-app-wizard': ZsAppWizard;
  }
}
