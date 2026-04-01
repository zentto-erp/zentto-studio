// @zentto/studio — Landing Page Creation Wizard
// Step-by-step wizard to create a Landing Page or Blog from templates
// Steps: 1) Purpose → 2) Template → 3) Branding → 4) Theme → 5) Sections → 6) Preview

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens, fieldBaseStyles } from '../styles/tokens.js';
import type { AppConfig, LandingSection, LandingSectionType } from '@zentto/studio-core';
import { listLandingTemplates, getLandingTemplate, listLandingTemplatesByCategory } from '@zentto/studio-core';
import { THEME_PRESETS, getThemePreset, applyThemePresetToConfig } from '@zentto/studio-core';
import type { LandingTemplateMeta, ThemePreset, LandingTemplateCategory } from '@zentto/studio-core';
import '../landing/zs-landing-page.js';

// ─── Constants ──────────────────────────────────────────────────────

interface WizardStep {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const STEPS: WizardStep[] = [
  { id: 'purpose',   title: 'Proposito',    icon: '🎯', description: 'Que quieres crear?' },
  { id: 'template',  title: 'Plantilla',    icon: '📋', description: 'Elige una plantilla' },
  { id: 'branding',  title: 'Marca',        icon: '🎨', description: 'Personaliza tu marca' },
  { id: 'theme',     title: 'Tema',         icon: '🎭', description: 'Elige un tema' },
  { id: 'sections',  title: 'Secciones',    icon: '📑', description: 'Revisa tus secciones' },
  { id: 'preview',   title: 'Vista Previa', icon: '👁️', description: 'Vista previa y lanzar' },
];

const COLOR_PALETTE = [
  '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6',
  '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b',
  '#f97316', '#ef4444', '#f43f5e', '#ec4899', '#d946ef',
  '#a855f7', '#8b5cf6', '#6d28d9', '#475569', '#1e293b',
];

const SECTION_ICONS: Record<string, string> = {
  hero: '🎯', features: '⭐', pricing: '💰', testimonials: '💬',
  cta: '📢', stats: '📊', faq: '❓', team: '👥',
  gallery: '🖼️', logos: '🏢', content: '📝', video: '🎬',
  contact: '📬', html: '🔧',
};

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero', features: 'Features', pricing: 'Precios', testimonials: 'Testimonios',
  cta: 'Llamada a la accion', stats: 'Estadisticas', faq: 'Preguntas frecuentes', team: 'Equipo',
  gallery: 'Galeria', logos: 'Logos', content: 'Contenido', video: 'Video',
  contact: 'Contacto', html: 'HTML personalizado',
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: 'Seccion principal con titulo, descripcion y botones',
  features: 'Lista de caracteristicas o beneficios',
  pricing: 'Tabla de planes y precios',
  testimonials: 'Opiniones de clientes',
  cta: 'Bloque de llamada a la accion',
  stats: 'Metricas y estadisticas clave',
  faq: 'Preguntas y respuestas frecuentes',
  team: 'Miembros del equipo',
  gallery: 'Galeria de imagenes',
  logos: 'Logos de clientes o partners',
  content: 'Bloque de texto con formato libre',
  video: 'Video embebido o demo',
  contact: 'Formulario de contacto',
  html: 'Bloque HTML personalizado',
};

const ALL_SECTION_TYPES: LandingSectionType[] = [
  'hero', 'features', 'pricing', 'testimonials', 'cta', 'stats',
  'faq', 'team', 'gallery', 'logos', 'content', 'video', 'contact', 'html',
];

const LANDING_CATEGORIES: { value: LandingTemplateCategory; label: string }[] = [
  { value: 'saas',         label: 'SaaS' },
  { value: 'portfolio',    label: 'Portfolio' },
  { value: 'agency',       label: 'Agencia' },
  { value: 'professional', label: 'Profesional' },
  { value: 'ecommerce',    label: 'Comercio' },
  { value: 'restaurant',   label: 'Restaurante' },
  { value: 'event',        label: 'Evento' },
  { value: 'nonprofit',    label: 'ONG' },
  { value: 'fitness',      label: 'Fitness' },
  { value: 'realestate',   label: 'Inmobiliaria' },
  { value: 'education',    label: 'Educacion' },
  { value: 'mobile-app',   label: 'App Movil' },
];

const BLOG_CATEGORIES: { value: LandingTemplateCategory; label: string }[] = [
  { value: 'blog', label: 'Todos los blogs' },
];

// ─── Component ──────────────────────────────────────────────────────

@customElement('zs-landing-wizard')
export class ZsLandingWizard extends LitElement {
  static styles = [studioTokens, fieldBaseStyles, css`
    :host { display: block; font-family: var(--zs-font-family); }

    .wizard {
      max-width: 960px; margin: 0 auto;
      background: var(--zs-bg); border-radius: 12px;
      border: 1px solid var(--zs-border);
      overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }

    /* ── Stepper bar ────────────────────────────────── */
    .wizard-steps {
      display: flex; background: var(--zs-bg-secondary);
      border-bottom: 1px solid var(--zs-border); padding: 0;
      overflow-x: auto;
    }
    .wizard-step {
      flex: 1; display: flex; align-items: center; gap: 6px;
      padding: 14px 12px; cursor: default;
      color: var(--zs-text-muted); font-size: 12px;
      border-bottom: 3px solid transparent;
      transition: all 150ms; min-width: 0; white-space: nowrap;
      user-select: none;
    }
    .wizard-step--clickable { cursor: pointer; }
    .wizard-step--clickable:hover { color: var(--zs-text-secondary); }
    .wizard-step--active {
      color: var(--zs-primary); border-bottom-color: var(--zs-primary);
      font-weight: 600;
    }
    .wizard-step--done { color: var(--zs-success); }
    .wizard-step-icon { font-size: 16px; flex-shrink: 0; }
    .wizard-step-num {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
      background: var(--zs-border); color: var(--zs-text-muted);
      transition: all 150ms;
    }
    .wizard-step--active .wizard-step-num {
      background: var(--zs-primary); color: white;
    }
    .wizard-step--done .wizard-step-num {
      background: var(--zs-success); color: white;
    }
    .wizard-step-title {
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* ── Body ───────────────────────────────────────── */
    .wizard-body {
      padding: 32px; min-height: 440px;
      animation: fadeIn 250ms ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

    .wizard-title {
      font-size: 24px; font-weight: 700; margin: 0 0 4px;
      color: var(--zs-text);
    }
    .wizard-desc {
      font-size: 14px; color: var(--zs-text-secondary);
      margin: 0 0 28px; line-height: 1.5;
    }

    /* ── Footer ─────────────────────────────────────── */
    .wizard-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 32px; border-top: 1px solid var(--zs-border);
      background: var(--zs-bg-secondary);
    }

    /* ── Buttons ────────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 8px;
      font-family: var(--zs-font-family); font-size: 14px; font-weight: 500;
      cursor: pointer; border: 1px solid var(--zs-border);
      background: var(--zs-bg); color: var(--zs-text);
      transition: all 150ms;
    }
    .btn:hover { background: var(--zs-bg-hover); }
    .btn--primary {
      background: var(--zs-primary); color: white; border-color: var(--zs-primary);
    }
    .btn--primary:hover { background: var(--zs-primary-hover); border-color: var(--zs-primary-hover); }
    .btn--ghost {
      background: none; border-color: transparent; color: var(--zs-text-secondary);
    }
    .btn--ghost:hover { color: var(--zs-text); background: var(--zs-bg-hover); }
    .btn--success {
      background: var(--zs-success); color: white; border-color: var(--zs-success);
    }
    .btn--success:hover { filter: brightness(0.9); }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
    .btn--sm { padding: 6px 12px; font-size: 13px; }

    /* ── Purpose cards (Step 1) ─────────────────────── */
    .purpose-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
      max-width: 640px; margin: 0 auto;
    }
    .purpose-card {
      padding: 40px 32px; border: 2px solid var(--zs-border);
      border-radius: 16px; cursor: pointer; text-align: center;
      transition: all 250ms ease; background: var(--zs-bg);
    }
    .purpose-card:hover {
      border-color: var(--zs-primary); transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .purpose-card--selected {
      border-color: var(--zs-primary); background: var(--zs-primary-light);
    }
    .purpose-icon { font-size: 56px; margin-bottom: 16px; display: block; }
    .purpose-title { font-size: 20px; font-weight: 700; color: var(--zs-text); margin-bottom: 8px; }
    .purpose-desc { font-size: 14px; color: var(--zs-text-secondary); line-height: 1.5; }

    /* ── Category chips ─────────────────────────────── */
    .category-chips {
      display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
    }
    .chip {
      padding: 6px 14px; border-radius: 20px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      border: 1px solid var(--zs-border); background: var(--zs-bg);
      color: var(--zs-text-secondary); transition: all 150ms;
      user-select: none;
    }
    .chip:hover { border-color: var(--zs-primary); color: var(--zs-primary); }
    .chip--active {
      background: var(--zs-primary); color: white; border-color: var(--zs-primary);
    }

    /* ── Template grid (Step 2) ─────────────────────── */
    .template-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;
    }
    .template-card {
      padding: 20px; border: 2px solid var(--zs-border);
      border-radius: 12px; cursor: pointer;
      transition: all 200ms; background: var(--zs-bg);
    }
    .template-card:hover {
      border-color: var(--zs-primary); transform: translateY(-2px);
      box-shadow: 0 4px 16px var(--zs-shadow);
    }
    .template-card--selected {
      border-color: var(--zs-primary); background: var(--zs-primary-light);
    }
    .template-icon { font-size: 32px; margin-bottom: 8px; }
    .template-title { font-size: 15px; font-weight: 600; color: var(--zs-text); margin-bottom: 4px; }
    .template-desc { font-size: 12px; color: var(--zs-text-secondary); line-height: 1.4; margin-bottom: 8px; }
    .template-meta { display: flex; align-items: center; gap: 8px; }
    .template-badge {
      display: inline-block; padding: 2px 8px; border-radius: 10px;
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      background: var(--zs-bg-secondary); color: var(--zs-text-secondary);
      border: 1px solid var(--zs-border);
    }
    .template-sections {
      font-size: 11px; color: var(--zs-text-muted);
    }
    .template-empty {
      grid-column: 1 / -1; text-align: center; padding: 40px;
      color: var(--zs-text-muted); font-size: 14px;
    }

    /* ── Form fields (Step 3) ───────────────────────── */
    .form-group { margin-bottom: 20px; }
    .form-label {
      font-size: 13px; font-weight: 600; color: var(--zs-text);
      margin-bottom: 6px; display: block;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* Color swatches */
    .color-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .color-swatch {
      width: 36px; height: 36px; border-radius: 50%;
      cursor: pointer; border: 3px solid transparent;
      transition: all 150ms; flex-shrink: 0;
    }
    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch--selected {
      border-color: var(--zs-text);
      box-shadow: 0 0 0 2px white, 0 0 0 4px var(--zs-text);
    }
    .color-custom {
      display: flex; align-items: center; gap: 8px; margin-top: 12px;
    }
    .color-input-native {
      width: 40px; height: 36px; border: none; padding: 0;
      cursor: pointer; background: none; border-radius: 6px;
    }

    /* ── Theme grid (Step 4) ────────────────────────── */
    .theme-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;
    }
    .theme-card {
      padding: 16px; border: 2px solid var(--zs-border);
      border-radius: 12px; cursor: pointer;
      transition: all 200ms; background: var(--zs-bg);
    }
    .theme-card:hover {
      border-color: var(--zs-primary); transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--zs-shadow);
    }
    .theme-card--selected {
      border-color: var(--zs-primary); background: var(--zs-primary-light);
    }
    .theme-name {
      font-size: 14px; font-weight: 600; color: var(--zs-text); margin-bottom: 10px;
    }
    .theme-swatches {
      display: flex; gap: 6px; margin-bottom: 10px;
    }
    .theme-swatch {
      width: 28px; height: 28px; border-radius: 50%;
      border: 2px solid rgba(0,0,0,0.08);
    }
    .theme-preview-strip {
      height: 32px; border-radius: 6px; overflow: hidden;
      display: flex; border: 1px solid var(--zs-border);
    }
    .theme-preview-strip div { flex: 1; }

    /* ── Sections list (Step 5) ─────────────────────── */
    .sections-list {
      border: 1px solid var(--zs-border); border-radius: 10px;
      overflow: hidden;
    }
    .section-row {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border-bottom: 1px solid var(--zs-border);
      transition: background 100ms;
    }
    .section-row:last-child { border-bottom: none; }
    .section-row:hover { background: var(--zs-bg-hover); }
    .section-row-icon { font-size: 20px; flex-shrink: 0; }
    .section-row-info { flex: 1; min-width: 0; }
    .section-row-name { font-size: 14px; font-weight: 500; color: var(--zs-text); }
    .section-row-desc { font-size: 12px; color: var(--zs-text-muted); }
    .section-row-actions { display: flex; align-items: center; gap: 4px; }
    .section-btn {
      border: none; background: none; cursor: pointer;
      font-size: 14px; padding: 4px 6px; border-radius: 4px;
      color: var(--zs-text-muted); transition: all 100ms;
    }
    .section-btn:hover { background: var(--zs-bg-hover); color: var(--zs-text); }
    .section-btn--danger:hover { color: var(--zs-danger); }

    /* Toggle switch */
    .toggle {
      position: relative; width: 40px; height: 22px;
      border-radius: 11px; background: var(--zs-border);
      cursor: pointer; transition: background 200ms; flex-shrink: 0;
    }
    .toggle--on { background: var(--zs-success); }
    .toggle-knob {
      position: absolute; top: 2px; left: 2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: white; transition: transform 200ms;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle--on .toggle-knob { transform: translateX(18px); }

    /* Add section palette */
    .add-section-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 16px; margin-top: 16px;
      border: 2px dashed var(--zs-border); border-radius: 10px;
      background: none; cursor: pointer; width: 100%;
      font-family: var(--zs-font-family); font-size: 14px;
      color: var(--zs-text-secondary); transition: all 150ms;
    }
    .add-section-btn:hover { border-color: var(--zs-primary); color: var(--zs-primary); }

    .section-palette {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;
      margin-top: 16px; padding: 16px;
      border: 1px solid var(--zs-border); border-radius: 10px;
      background: var(--zs-bg-secondary);
    }
    .section-palette-item {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--zs-border); background: var(--zs-bg);
      transition: all 150ms; font-size: 13px; color: var(--zs-text);
    }
    .section-palette-item:hover {
      border-color: var(--zs-primary); background: var(--zs-primary-light);
      color: var(--zs-primary);
    }
    .section-palette-icon { font-size: 18px; }

    /* ── Preview (Step 6) ───────────────────────────── */
    .preview-container {
      border: 1px solid var(--zs-border); border-radius: 10px;
      overflow-y: auto; background: white;
      min-height: 400px; max-height: 70vh;
    }
    .preview-container zs-landing-page {
      display: block; min-height: 400px;
    }
    .preview-actions {
      display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;
    }

    /* ── Responsive ─────────────────────────────────── */
    @media (max-width: 640px) {
      .wizard-body { padding: 20px; }
      .wizard-footer { padding: 12px 20px; }
      .purpose-grid { grid-template-columns: 1fr; }
      .template-grid { grid-template-columns: 1fr; }
      .theme-grid { grid-template-columns: 1fr 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .wizard-steps { gap: 0; }
      .wizard-step-title { display: none; }
      .section-palette { grid-template-columns: 1fr 1fr; }
    }
  `];

  // ─── Public properties ────────────────────────────

  @property({ type: Object }) initialConfig?: AppConfig;

  // ─── Internal state ───────────────────────────────

  @state() private _step = 0;
  @state() private _appMode: 'landing' | 'blog' = 'landing';
  @state() private _config!: AppConfig;
  @state() private _selectedCategory: LandingTemplateCategory | 'all' = 'all';
  @state() private _selectedTemplateId = '';
  @state() private _selectedThemeId = '';
  @state() private _showSectionPalette = false;
  @state() private _templates: LandingTemplateMeta[] = [];
  @state() private _customColor = '';

  // ─── Lifecycle ────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    if (this.initialConfig) {
      this._config = structuredClone(this.initialConfig);
      this._appMode = this._config.appMode === 'blog' ? 'blog' : 'landing';
    } else {
      this._config = this._createDefaultConfig();
    }
    this._loadTemplates();
  }

  // ─── Helpers ──────────────────────────────────────

  private _createDefaultConfig(): AppConfig {
    return {
      id: `landing-${Date.now()}`,
      version: '1.0.0',
      appMode: 'landing',
      branding: {
        title: 'Mi Sitio',
        subtitle: '',
        primaryColor: '#6366f1',
        homeSegment: 'home',
      },
      navigation: [],
      pages: [{
        id: 'home',
        segment: 'home',
        title: 'Home',
        content: 'landing',
        landingSections: [],
      }],
      landingConfig: {
        navbar: { title: 'Mi Sitio', links: [], sticky: true },
        footer: { columns: [], copyright: '' },
      },
    };
  }

  private _loadTemplates() {
    if (this._appMode === 'blog') {
      this._templates = listLandingTemplatesByCategory('blog');
    } else if (this._selectedCategory === 'all') {
      this._templates = listLandingTemplates().filter(t => t.category !== 'blog');
    } else {
      this._templates = listLandingTemplatesByCategory(this._selectedCategory as LandingTemplateCategory);
    }
  }

  private get _sections(): LandingSection[] {
    return this._config.pages?.[0]?.landingSections ?? [];
  }

  private _setSections(sections: LandingSection[]) {
    const config = structuredClone(this._config);
    if (config.pages?.[0]) {
      config.pages[0].landingSections = sections;
    }
    this._config = config;
    this._emitChange();
  }

  private _emitChange() {
    this.dispatchEvent(new CustomEvent('config-change', {
      detail: { config: structuredClone(this._config) },
      bubbles: true, composed: true,
    }));
  }

  private _emitComplete() {
    this.dispatchEvent(new CustomEvent('wizard-complete', {
      detail: { config: structuredClone(this._config) },
      bubbles: true, composed: true,
    }));
  }

  private _emitOpenDesigner() {
    this.dispatchEvent(new CustomEvent('wizard-open-designer', {
      detail: { config: structuredClone(this._config) },
      bubbles: true, composed: true,
    }));
  }

  private _canGoNext(): boolean {
    switch (this._step) {
      case 0: return true; // purpose always ok, selecting a card auto-advances
      case 1: return this._selectedTemplateId !== '';
      case 2: return (this._config.branding.title ?? '').trim().length > 0;
      case 3: return true; // theme is optional
      case 4: return this._sections.length > 0;
      case 5: return true;
      default: return false;
    }
  }

  private _goTo(step: number) {
    if (step >= 0 && step < STEPS.length && step <= this._step) {
      this._step = step;
    }
  }

  private _next() {
    if (this._step < STEPS.length - 1 && this._canGoNext()) {
      this._step++;
    }
  }

  private _back() {
    if (this._step > 0) this._step--;
  }

  private _getSectionCount(templateId: string): number {
    try {
      const cfg = getLandingTemplate(templateId);
      return cfg.pages?.[0]?.landingSections?.length ?? 0;
    } catch { return 0; }
  }

  // ─── Render ───────────────────────────────────────

  render() {
    return html`
      <div class="wizard">
        ${this._renderStepper()}
        <div class="wizard-body" .key=${this._step}>
          ${this._renderStep()}
        </div>
        ${this._renderFooter()}
      </div>
    `;
  }

  private _renderStepper() {
    return html`
      <div class="wizard-steps">
        ${STEPS.map((s, i) => {
          const done = i < this._step;
          const active = i === this._step;
          const clickable = i < this._step;
          return html`
            <div
              class="wizard-step
                ${active ? 'wizard-step--active' : ''}
                ${done ? 'wizard-step--done' : ''}
                ${clickable ? 'wizard-step--clickable' : ''}"
              @click=${() => clickable ? this._goTo(i) : null}
            >
              <span class="wizard-step-num">${done ? '✓' : i + 1}</span>
              <span class="wizard-step-title">${s.title}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderFooter() {
    const isFirst = this._step === 0;
    const isLast = this._step === STEPS.length - 1;

    return html`
      <div class="wizard-footer">
        <button class="btn btn--ghost" ?disabled=${isFirst} @click=${this._back}>
          ← Atras
        </button>
        <div style="display:flex; gap:8px;">
          ${isLast ? html`
            <button class="btn btn--primary" @click=${this._emitOpenDesigner}>
              ✏️ Editar en Designer
            </button>
            <button class="btn btn--success" @click=${this._emitComplete}>
              🚀 Finalizar
            </button>
          ` : html`
            <button class="btn btn--primary" ?disabled=${!this._canGoNext()} @click=${this._next}>
              Siguiente →
            </button>
          `}
        </div>
      </div>
    `;
  }

  private _renderStep() {
    switch (this._step) {
      case 0: return this._renderPurpose();
      case 1: return this._renderTemplate();
      case 2: return this._renderBranding();
      case 3: return this._renderTheme();
      case 4: return this._renderSections();
      case 5: return this._renderPreview();
      default: return nothing;
    }
  }

  // ─── Step 1: Purpose ──────────────────────────────

  private _renderPurpose() {
    return html`
      <h2 class="wizard-title">Que quieres crear?</h2>
      <p class="wizard-desc">Elige el tipo de sitio que quieres construir. Podras personalizarlo completamente en los siguientes pasos.</p>
      <div class="purpose-grid">
        <div
          class="purpose-card ${this._appMode === 'landing' ? 'purpose-card--selected' : ''}"
          @click=${() => this._selectPurpose('landing')}
        >
          <span class="purpose-icon">🚀</span>
          <div class="purpose-title">Landing Page</div>
          <div class="purpose-desc">Sitio web de una pagina con secciones (hero, features, pricing...)</div>
        </div>
        <div
          class="purpose-card ${this._appMode === 'blog' ? 'purpose-card--selected' : ''}"
          @click=${() => this._selectPurpose('blog')}
        >
          <span class="purpose-icon">📝</span>
          <div class="purpose-title">Blog</div>
          <div class="purpose-desc">Blog con articulos, categorias y tags</div>
        </div>
      </div>
    `;
  }

  private _selectPurpose(mode: 'landing' | 'blog') {
    this._appMode = mode;
    this._config = { ...this._config, appMode: mode };
    this._selectedCategory = mode === 'blog' ? 'blog' : 'all';
    this._selectedTemplateId = '';
    this._loadTemplates();
    this._emitChange();
    this._next();
  }

  // ─── Step 2: Template ─────────────────────────────

  private _renderTemplate() {
    const categories = this._appMode === 'blog' ? BLOG_CATEGORIES : LANDING_CATEGORIES;
    const showAll = this._appMode !== 'blog';

    return html`
      <h2 class="wizard-title">Elige una plantilla</h2>
      <p class="wizard-desc">Selecciona una plantilla base. Podras modificar las secciones, colores y contenido despues.</p>

      ${showAll ? html`
        <div class="category-chips">
          <div
            class="chip ${this._selectedCategory === 'all' ? 'chip--active' : ''}"
            @click=${() => this._filterCategory('all')}
          >Todas</div>
          ${categories.map(c => html`
            <div
              class="chip ${this._selectedCategory === c.value ? 'chip--active' : ''}"
              @click=${() => this._filterCategory(c.value)}
            >${c.label}</div>
          `)}
        </div>
      ` : nothing}

      <div class="template-grid">
        ${this._templates.length === 0 ? html`
          <div class="template-empty">No se encontraron plantillas para esta categoria.</div>
        ` : this._templates.map(t => html`
          <div
            class="template-card ${this._selectedTemplateId === t.id ? 'template-card--selected' : ''}"
            @click=${() => this._selectTemplate(t.id)}
          >
            <div class="template-icon">${t.icon}</div>
            <div class="template-title">${t.title}</div>
            <div class="template-desc">${t.description}</div>
            <div class="template-meta">
              <span class="template-badge">${t.category}</span>
              <span class="template-sections">${this._getSectionCount(t.id)} secciones</span>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  private _filterCategory(category: LandingTemplateCategory | 'all') {
    this._selectedCategory = category;
    this._loadTemplates();
  }

  private _selectTemplate(id: string) {
    this._selectedTemplateId = id;
    try {
      const templateConfig = getLandingTemplate(id);
      // Merge template into config, preserving user's branding edits if any
      this._config = {
        ...templateConfig,
        id: this._config.id,
        appMode: this._appMode,
      };
      this._emitChange();
      this._next();
    } catch (e) {
      console.error('Error loading template:', e);
    }
  }

  // ─── Step 3: Branding ─────────────────────────────

  private _renderBranding() {
    const branding = this._config.branding;

    return html`
      <h2 class="wizard-title">Personaliza tu marca</h2>
      <p class="wizard-desc">Dale identidad a tu sitio con tu nombre, eslogan y colores.</p>

      <div class="form-row" style="margin-bottom: 20px;">
        <div class="form-group">
          <label class="form-label">Nombre del sitio *</label>
          <input
            class="zs-input"
            type="text"
            .value=${branding.title ?? ''}
            placeholder="Ej: Mi Startup"
            @input=${(e: Event) => this._updateBranding('title', (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="form-group">
          <label class="form-label">Tagline / Subtitulo</label>
          <input
            class="zs-input"
            type="text"
            .value=${branding.subtitle ?? ''}
            placeholder="Ej: La mejor solucion para tu negocio"
            @input=${(e: Event) => this._updateBranding('subtitle', (e.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Color principal</label>
        <div class="color-grid">
          ${COLOR_PALETTE.map(c => html`
            <div
              class="color-swatch ${branding.primaryColor === c ? 'color-swatch--selected' : ''}"
              style="background: ${c}"
              title="${c}"
              @click=${() => this._updateBranding('primaryColor', c)}
            ></div>
          `)}
        </div>
        <div class="color-custom">
          <input
            type="color"
            class="color-input-native"
            .value=${branding.primaryColor ?? '#6366f1'}
            @input=${(e: Event) => this._updateBranding('primaryColor', (e.target as HTMLInputElement).value)}
          />
          <input
            class="zs-input"
            style="max-width: 120px;"
            type="text"
            placeholder="#hex"
            .value=${branding.primaryColor ?? ''}
            @input=${(e: Event) => {
              const val = (e.target as HTMLInputElement).value;
              if (/^#[0-9a-fA-F]{6}$/.test(val)) this._updateBranding('primaryColor', val);
            }}
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">URL del logo (opcional)</label>
        <input
          class="zs-input"
          type="text"
          .value=${branding.logo ?? ''}
          placeholder="https://ejemplo.com/logo.svg"
          @input=${(e: Event) => this._updateBranding('logo', (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  private _updateBranding(key: keyof AppConfig['branding'], value: string) {
    const config = structuredClone(this._config);
    (config.branding as Record<string, unknown>)[key] = value;
    // Also update navbar title when site name changes
    if (key === 'title' && config.landingConfig?.navbar) {
      config.landingConfig.navbar.title = value;
    }
    this._config = config;
    this._emitChange();
  }

  // ─── Step 4: Theme ────────────────────────────────

  private _renderTheme() {
    return html`
      <h2 class="wizard-title">Elige un tema</h2>
      <p class="wizard-desc">Selecciona un esquema de colores predefinido. Podras ajustarlo despues en el designer.</p>

      <div class="theme-grid">
        ${THEME_PRESETS.map(preset => html`
          <div
            class="theme-card ${this._selectedThemeId === preset.id ? 'theme-card--selected' : ''}"
            @click=${() => this._selectTheme(preset)}
          >
            <div class="theme-name">${preset.name}</div>
            <div class="theme-swatches">
              <div class="theme-swatch" style="background: ${preset.primary}" title="Primary"></div>
              <div class="theme-swatch" style="background: ${preset.accent}" title="Accent"></div>
              <div class="theme-swatch" style="background: ${preset.bg}; border: 1px solid ${preset.primary}22;" title="Background"></div>
              <div class="theme-swatch" style="background: ${preset.text}" title="Text"></div>
            </div>
            <div class="theme-preview-strip">
              <div style="background: ${preset.bg}"></div>
              <div style="background: ${preset.primary}"></div>
              <div style="background: ${preset.accent}"></div>
              <div style="background: ${preset.bgAlt}"></div>
              <div style="background: ${preset.text}"></div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  private _selectTheme(preset: ThemePreset) {
    this._selectedThemeId = preset.id;
    this._config = applyThemePresetToConfig(this._config, preset);
    this._emitChange();
  }

  // ─── Step 5: Sections ─────────────────────────────

  private _renderSections() {
    const sections = this._sections;

    return html`
      <h2 class="wizard-title">Revisa tus secciones</h2>
      <p class="wizard-desc">Activa, desactiva o reordena las secciones de tu sitio. Puedes agregar nuevas al final.</p>

      ${sections.length > 0 ? html`
        <div class="sections-list">
          ${sections.map((s, i) => html`
            <div class="section-row">
              <span class="section-row-icon">${SECTION_ICONS[s.type] ?? '📄'}</span>
              <div class="section-row-info">
                <div class="section-row-name">${SECTION_LABELS[s.type] ?? s.type}</div>
                <div class="section-row-desc">${SECTION_DESCRIPTIONS[s.type] ?? ''}</div>
              </div>
              <div class="section-row-actions">
                <button
                  class="section-btn"
                  title="Subir"
                  ?disabled=${i === 0}
                  @click=${() => this._moveSection(i, -1)}
                >▲</button>
                <button
                  class="section-btn"
                  title="Bajar"
                  ?disabled=${i === sections.length - 1}
                  @click=${() => this._moveSection(i, 1)}
                >▼</button>
                <button
                  class="section-btn section-btn--danger"
                  title="Eliminar"
                  @click=${() => this._removeSection(i)}
                >✕</button>
              </div>
            </div>
          `)}
        </div>
      ` : html`
        <div style="text-align:center; padding:32px; color: var(--zs-text-muted);">
          No hay secciones. Agrega al menos una para continuar.
        </div>
      `}

      <button class="add-section-btn" @click=${() => { this._showSectionPalette = !this._showSectionPalette; }}>
        ${this._showSectionPalette ? '✕ Cerrar paleta' : '+ Agregar seccion'}
      </button>

      ${this._showSectionPalette ? html`
        <div class="section-palette">
          ${ALL_SECTION_TYPES.map(type => html`
            <div class="section-palette-item" @click=${() => this._addSection(type)}>
              <span class="section-palette-icon">${SECTION_ICONS[type]}</span>
              ${SECTION_LABELS[type]}
            </div>
          `)}
        </div>
      ` : nothing}
    `;
  }

  private _moveSection(index: number, direction: -1 | 1) {
    const sections = [...this._sections];
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    this._setSections(sections);
  }

  private _removeSection(index: number) {
    const sections = [...this._sections];
    sections.splice(index, 1);
    this._setSections(sections);
  }

  private _addSection(type: LandingSectionType) {
    const sections = [...this._sections];
    sections.push({
      id: `${type}-${Date.now()}`,
      type,
    });
    this._setSections(sections);
    this._showSectionPalette = false;
  }

  // ─── Step 6: Preview ──────────────────────────────

  private _renderPreview() {
    const sections = this._sections;
    const page = this._config.pages?.[0] ?? {
      id: 'home', segment: 'home', title: 'Home',
      content: 'landing' as const, landingSections: sections,
    };
    const lc = this._config.landingConfig;

    return html`
      <h2 class="wizard-title">Vista previa</h2>
      <p class="wizard-desc">
        Asi se ve tu sitio (${sections.length} secciones).
        Puedes finalizar, abrir el designer completo o exportar la configuracion.
      </p>

      ${sections.length === 0 ? html`
        <div style="padding:40px;text-align:center;color:#888;border:1px dashed #ccc;border-radius:10px;">
          No hay secciones. Vuelve al paso anterior para agregar secciones.
        </div>
      ` : html`
        <div class="preview-container">
          <zs-landing-page
            .page=${page}
            .landingConfig=${lc}
          ></zs-landing-page>
        </div>
      `}

      <div class="preview-actions">
        <button class="btn btn--primary" @click=${this._emitOpenDesigner}>
          ✏️ Editar en Designer
        </button>
        <button class="btn" @click=${this._exportJSON}>
          📥 Exportar JSON
        </button>
        <button class="btn" @click=${this._copyJSON}>
          📋 Copiar JSON
        </button>
      </div>
    `;
  }

  private _exportJSON() {
    const json = JSON.stringify(this._config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this._config.branding.title ?? 'landing'}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private async _copyJSON() {
    const json = JSON.stringify(this._config, null, 2);
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // Fallback: create a textarea
      const ta = document.createElement('textarea');
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-landing-wizard': ZsLandingWizard;
  }
}
