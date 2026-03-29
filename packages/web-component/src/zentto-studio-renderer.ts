// @zentto/studio — Main renderer web component
// <zentto-studio-renderer> takes a StudioSchema + data and renders a full form

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens, fieldBaseStyles } from './styles/tokens.js';
import {
  type StudioSchema, type FieldConfig, type Section, type StudioBindingContext,
  DataModel, EventBus,
  evaluateRules, applyRulesToModel,
  validateField,
  solveGridLayout,
  getFieldTag, getFieldMeta,
  isActionEnabled, executeAction,
  evaluateExpression,
} from '@zentto/studio-core';

// Import field components (side-effect: registers custom elements)
import './fields/zs-field-text.js';
import './fields/zs-field-number.js';
import './fields/zs-field-select.js';
import './fields/zs-field-date.js';
import './fields/zs-field-checkbox.js';
import './fields/zs-field-switch.js';
import './fields/zs-field-file.js';
import './fields/zs-field-lookup.js';
import './fields/zs-field-separator.js';
import './fields/zs-field-button.js';
import './fields/zs-field-heading.js';
import './fields/zs-field-html.js';
import './fields/zs-field-signature.js';
import './fields/zs-field-address.js';
import './fields/zs-field-chart.js';
import './fields/zs-field-media.js';
import './fields/zs-field-treeview.js';
import './fields/zs-field-chips.js';
import './fields/zs-field-datagrid.js';
import './fields/zs-field-report.js';

@customElement('zentto-studio-renderer')
export class ZenttoStudioRenderer extends LitElement {
  static styles = [studioTokens, fieldBaseStyles, css`
    :host {
      display: block;
      font-family: var(--zs-font-family);
      color: var(--zs-text);
    }
    .zs-renderer { background: var(--zs-bg); border-radius: var(--zs-radius-lg); }
    .zs-header {
      padding: var(--zs-spacing-md);
      border-bottom: 1px solid var(--zs-border);
    }
    .zs-title {
      margin: 0; font-size: var(--zs-font-size-xl); font-weight: 600;
      color: var(--zs-text);
    }
    .zs-description {
      margin: 4px 0 0; font-size: var(--zs-font-size); color: var(--zs-text-secondary);
    }
    .zs-body { padding: var(--zs-spacing-md); }
    .zs-section {
      margin-bottom: var(--zs-spacing-lg);
    }
    .zs-section-title {
      font-size: var(--zs-font-size-lg); font-weight: 600;
      margin: 0 0 var(--zs-spacing-sm) 0; color: var(--zs-text);
      padding-bottom: var(--zs-spacing-xs);
      border-bottom: 2px solid var(--zs-primary-light);
    }
    .zs-section-description {
      font-size: var(--zs-font-size-sm); color: var(--zs-text-secondary);
      margin: 0 0 var(--zs-spacing-sm) 0;
    }
    .zs-section-grid {
      display: grid;
      gap: var(--zs-spacing-md);
    }
    .zs-actions {
      display: flex; gap: var(--zs-spacing-sm);
      padding: var(--zs-spacing-md);
      border-top: 1px solid var(--zs-border);
      justify-content: flex-end;
    }
    .zs-btn {
      padding: 8px 20px; border-radius: var(--zs-radius);
      font-family: var(--zs-font-family); font-size: var(--zs-font-size);
      font-weight: 500; cursor: pointer; border: 1px solid transparent;
      transition: all var(--zs-transition);
    }
    .zs-btn--primary {
      background: var(--zs-primary); color: white; border-color: var(--zs-primary);
    }
    .zs-btn--primary:hover { background: var(--zs-primary-hover); }
    .zs-btn--secondary {
      background: var(--zs-bg); color: var(--zs-text); border-color: var(--zs-border);
    }
    .zs-btn--secondary:hover { background: var(--zs-bg-hover); }
    .zs-btn--danger {
      background: var(--zs-danger); color: white; border-color: var(--zs-danger);
    }
    .zs-btn--ghost {
      background: transparent; color: var(--zs-text-secondary); border-color: transparent;
    }
    .zs-btn--ghost:hover { color: var(--zs-text); background: var(--zs-bg-hover); }
    .zs-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .zs-field-hidden { display: none; }

    /* Tabs */
    .zs-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--zs-border); margin-bottom: var(--zs-spacing-md); }
    .zs-tab {
      padding: 8px 16px; cursor: pointer; border: none; background: none;
      font-family: var(--zs-font-family); font-size: var(--zs-font-size);
      color: var(--zs-text-secondary); border-bottom: 2px solid transparent;
      margin-bottom: -2px; transition: all var(--zs-transition);
    }
    .zs-tab:hover { color: var(--zs-text); }
    .zs-tab--active { color: var(--zs-primary); border-bottom-color: var(--zs-primary); font-weight: 500; }

    /* Wizard */
    .zs-wizard-steps {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: var(--zs-spacing-lg); padding: 0 var(--zs-spacing-md);
    }
    .zs-wizard-step {
      display: flex; align-items: center; gap: 8px;
    }
    .zs-wizard-circle {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: var(--zs-font-size-sm); font-weight: 600;
      background: var(--zs-bg-secondary); color: var(--zs-text-secondary);
      border: 2px solid var(--zs-border);
    }
    .zs-wizard-circle--active { background: var(--zs-primary); color: white; border-color: var(--zs-primary); }
    .zs-wizard-circle--done { background: var(--zs-success); color: white; border-color: var(--zs-success); }
    .zs-wizard-label { font-size: var(--zs-font-size-sm); color: var(--zs-text-secondary); }
    .zs-wizard-label--active { color: var(--zs-text); font-weight: 500; }
    .zs-wizard-line { flex: 1; height: 2px; background: var(--zs-border); }
    .zs-wizard-line--done { background: var(--zs-success); }
    .zs-wizard-nav { display: flex; justify-content: space-between; padding: var(--zs-spacing-md); }
  `];

  // ─── Properties ──────────────────────────────────────────────

  @property({ type: Object }) schema: StudioSchema | null = null;
  @property({ type: Object }) data: Record<string, unknown> = {};
  @property({ attribute: 'theme' }) themeMode: 'light' | 'dark' = 'light';

  // ─── Internal State ──────────────────────────────────────────

  @state() private model: DataModel | null = null;
  @state() private eventBus = new EventBus();
  @state() private activeSection = 0;
  @state() private renderCounter = 0; // force re-renders

  // ─── Lifecycle ───────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    if (this.themeMode === 'dark') {
      this.setAttribute('theme', 'dark');
    }
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('schema') || changed.has('data')) {
      this.initializeModel();
    }
  }

  private initializeModel() {
    if (!this.schema) return;

    this.eventBus = new EventBus();
    this.model = new DataModel(this.data, this.eventBus);
    this.model.initializeFromSchema(this.schema);
    this.activeSection = 0;

    // Run initial rules
    this.runRules();
  }

  // ─── Event Handlers ──────────────────────────────────────────

  private handleFieldChange(e: CustomEvent) {
    if (!this.model || !this.schema) return;

    const { fieldId, value } = e.detail;
    const field = this.findField(fieldId);
    if (!field) return;

    // Update model
    this.model.setValue(fieldId, field.field, value);

    // Run validation
    const ctx = this.buildContext();
    const result = validateField(field, value, ctx);
    this.model.setFieldErrors(fieldId, result.errors);

    // Re-evaluate rules
    this.runRules();

    // Emit event to host app
    this.dispatchEvent(new CustomEvent('studio-change', {
      detail: { fieldId, field: field.field, value, data: this.model.getData() },
      bubbles: true, composed: true,
    }));

    this.renderCounter++;
  }

  private async handleAction(actionId: string) {
    if (!this.model || !this.schema) return;

    const action = this.schema.actions?.find(a => a.id === actionId);
    if (!action) return;

    const ctx = this.buildContext();
    if (!isActionEnabled(action, ctx)) return;

    // Confirm if needed
    if (action.confirmMessage) {
      const confirmed = confirm(action.confirmMessage);
      if (!confirmed) return;
    }

    const formData = this.model.getData();

    if (action.type === 'submit') {
      // Validate all fields first
      let hasErrors = false;
      for (const section of this.schema.sections) {
        for (const field of section.fields) {
          const value = this.model.getValue(field.field);
          const result = validateField(field, value, ctx);
          this.model.setFieldErrors(field.id, result.errors);
          if (!result.valid) hasErrors = true;
        }
      }
      if (hasErrors) {
        this.renderCounter++;
        return;
      }

      this.dispatchEvent(new CustomEvent('studio-submit', {
        detail: { actionId, data: formData },
        bubbles: true, composed: true,
      }));
    }

    if (action.type === 'reset') {
      this.model.reset();
      this.runRules();
      this.renderCounter++;
      return;
    }

    const result = await executeAction(action, formData, ctx, this.eventBus);

    this.dispatchEvent(new CustomEvent('studio-action', {
      detail: { actionId, type: action.type, result, data: formData },
      bubbles: true, composed: true,
    }));

    this.renderCounter++;
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private buildContext(): StudioBindingContext {
    return {
      formData: this.model?.getRawData() ?? {},
      dataSources: {},
    };
  }

  private findField(fieldId: string): FieldConfig | undefined {
    if (!this.schema) return undefined;
    for (const section of this.schema.sections) {
      const f = section.fields.find(f => f.id === fieldId);
      if (f) return f;
    }
    return undefined;
  }

  private runRules() {
    if (!this.schema?.rules || !this.model) return;

    const ctx = this.buildContext();
    const result = evaluateRules(this.schema.rules, ctx);

    // Build field map for applyRulesToModel
    const fieldMap = new Map<string, { id: string; field: string }>();
    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        fieldMap.set(field.id, { id: field.id, field: field.field });
      }
    }

    applyRulesToModel(result, this.model, fieldMap);
  }

  // ─── Render ──────────────────────────────────────────────────

  render() {
    if (!this.schema || !this.model) {
      return html`<div class="zs-renderer" style="padding:24px;color:var(--zs-text-muted)">No schema loaded</div>`;
    }

    const layoutType = this.schema.layout.type;

    return html`
      <div class="zs-renderer">
        ${this.schema.title ? html`
          <div class="zs-header">
            <h2 class="zs-title">${this.schema.title}</h2>
            ${this.schema.description ? html`<p class="zs-description">${this.schema.description}</p>` : ''}
          </div>
        ` : ''}

        ${layoutType === 'tabs' ? this.renderTabs() :
          layoutType === 'wizard' ? this.renderWizard() :
          this.renderSections()}

        ${this.renderActions('bottom')}
      </div>
    `;
  }

  private renderSections() {
    if (!this.schema || !this.model) return nothing;

    return html`
      <div class="zs-body">
        ${this.schema.sections.map(section => this.renderSection(section))}
      </div>
    `;
  }

  private renderTabs() {
    if (!this.schema || !this.model) return nothing;
    const sections = this.schema.sections;

    return html`
      <div class="zs-tabs">
        ${sections.map((s, i) => html`
          <button
            class="zs-tab ${i === this.activeSection ? 'zs-tab--active' : ''}"
            @click="${() => { this.activeSection = i; }}"
          >${s.title ?? `Tab ${i + 1}`}</button>
        `)}
      </div>
      <div class="zs-body">
        ${this.renderSection(sections[this.activeSection])}
      </div>
    `;
  }

  private renderWizard() {
    if (!this.schema || !this.model) return nothing;
    const sections = this.schema.sections;
    const total = sections.length;

    return html`
      <div class="zs-wizard-steps">
        ${sections.map((s, i) => html`
          ${i > 0 ? html`<div class="zs-wizard-line ${i <= this.activeSection ? 'zs-wizard-line--done' : ''}"></div>` : ''}
          <div class="zs-wizard-step">
            <div class="zs-wizard-circle ${i === this.activeSection ? 'zs-wizard-circle--active' : i < this.activeSection ? 'zs-wizard-circle--done' : ''}">
              ${i < this.activeSection ? '✓' : i + 1}
            </div>
            <span class="zs-wizard-label ${i === this.activeSection ? 'zs-wizard-label--active' : ''}">${s.title ?? `Paso ${i + 1}`}</span>
          </div>
        `)}
      </div>
      <div class="zs-body">
        ${this.renderSection(sections[this.activeSection])}
      </div>
      <div class="zs-wizard-nav">
        <button
          class="zs-btn zs-btn--secondary"
          ?disabled="${this.activeSection === 0}"
          @click="${() => { this.activeSection = Math.max(0, this.activeSection - 1); }}"
        >Anterior</button>
        ${this.activeSection < total - 1
          ? html`<button class="zs-btn zs-btn--primary" @click="${() => { this.activeSection = Math.min(total - 1, this.activeSection + 1); }}">Siguiente</button>`
          : html`<button class="zs-btn zs-btn--primary" @click="${() => this.handleAction('__wizard_finish__')}">Finalizar</button>`
        }
      </div>
    `;
  }

  private renderSection(section: Section): TemplateResult {
    if (!this.model) return html``;

    // Check section visibility
    if (section.visibilityRule) {
      const ctx = this.buildContext();
      const visible = evaluateExpression(section.visibilityRule, ctx);
      if (!visible) return html``;
    }

    const columns = section.columns ?? this.schema?.layout.columns ?? 1;
    const gap = this.schema?.layout.gap ?? 16;

    return html`
      <div class="zs-section">
        <div class="zs-section-grid" style="grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px;">
          ${section.fields.map(field => this.renderField(field))}
        </div>
      </div>
    `;
  }

  private renderField(field: FieldConfig): TemplateResult {
    if (!this.model) return html``;

    const fieldState = this.model.getFieldState(field.id);

    // Visibility
    if (field.hidden || !fieldState.visible) {
      return html`<div class="zs-field-hidden"></div>`;
    }

    // Computed value
    if (field.computedValue) {
      try {
        const ctx = this.buildContext();
        const computed = evaluateExpression(field.computedValue, ctx);
        if (computed !== undefined) {
          this.model.setValue(field.id, field.field, computed);
        }
      } catch { /* ignore */ }
    }

    const value = this.model.getValue(field.field);
    const errors = fieldState.errors;
    const disabled = field.disabled || !fieldState.enabled;
    const readOnly = field.readOnly || fieldState.readOnly;
    const required = field.required || fieldState.required;
    const meta = getFieldMeta(field.type);
    const mergedProps = { ...meta?.defaultProps, ...field.props };

    // Column span
    const colSpan = field.colSpan ?? 1;
    const fullWidth = ['separator', 'heading', 'html', 'datagrid', 'report'].includes(field.type);
    const gridStyle = fullWidth ? 'grid-column: 1 / -1' : colSpan > 1 ? `grid-column: span ${colSpan}` : '';

    // Render based on tag name
    const tag = getFieldTag(field.type);

    return html`
      <div style="${gridStyle}" @field-change="${this.handleFieldChange}">
        ${this.renderFieldByTag(tag, field, value, errors, disabled, readOnly, required, mergedProps)}
      </div>
    `;
  }

  private renderFieldByTag(
    tag: string,
    field: FieldConfig,
    value: unknown,
    errors: string[],
    disabled: boolean,
    readOnly: boolean,
    required: boolean,
    props: Record<string, unknown>,
  ): TemplateResult {
    const baseAttrs = {
      fieldId: field.id,
      label: field.label ?? '',
      placeholder: field.placeholder ?? '',
      helpText: field.helpText ?? '',
      required, disabled, readOnly, errors,
    };

    switch (tag) {
      case 'zs-field-text':
        return html`<zs-field-text
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value != null ? String(value) : ''}"
          .placeholder="${baseAttrs.placeholder}" .helpText="${baseAttrs.helpText}"
          .inputType="${(props.inputType as string) ?? 'text'}"
          .multiline="${field.type === 'textarea'}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}" ?readOnly="${baseAttrs.readOnly}"
        ></zs-field-text>`;

      case 'zs-field-number':
        return html`<zs-field-number
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value != null ? Number(value) : null}"
          .placeholder="${baseAttrs.placeholder}" .helpText="${baseAttrs.helpText}"
          .isCurrency="${!!props.isCurrency}" .isPercentage="${!!props.isPercentage}"
          .currencySymbol="${(props.currencySymbol as string) ?? '$'}"
          .mode="${(props.mode as string) ?? 'input'}"
          .min="${(props.min as number) ?? 0}" .max="${(props.max as number) ?? 100}"
          .step="${(props.step as number) ?? 1}"
          .maxRating="${(props.maxRating as number) ?? 5}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}" ?readOnly="${baseAttrs.readOnly}"
        ></zs-field-number>`;

      case 'zs-field-select':
        return html`<zs-field-select
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value ?? ''}"
          .placeholder="${baseAttrs.placeholder}" .helpText="${baseAttrs.helpText}"
          .options="${(props.options as unknown[]) ?? []}"
          .multiple="${!!props.multiple}"
          .mode="${(props.mode as string) ?? 'select'}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-select>`;

      case 'zs-field-date':
        return html`<zs-field-date
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value != null ? String(value) : ''}"
          .helpText="${baseAttrs.helpText}"
          .mode="${(props.mode as string) ?? 'date'}"
          .min="${(props.min as string) ?? ''}" .max="${(props.max as string) ?? ''}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}" ?readOnly="${baseAttrs.readOnly}"
        ></zs-field-date>`;

      case 'zs-field-checkbox':
        return html`<zs-field-checkbox
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value ?? false}"
          .helpText="${baseAttrs.helpText}"
          .mode="${(props.mode as string) ?? 'checkbox'}"
          .options="${(props.options as unknown[]) ?? []}"
          .horizontal="${!!props.horizontal}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-checkbox>`;

      case 'zs-field-switch':
        return html`<zs-field-switch
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${!!value}"
          .helpText="${baseAttrs.helpText}"
          .errors="${baseAttrs.errors}"
          ?disabled="${baseAttrs.disabled}"
        ></zs-field-switch>`;

      case 'zs-field-file':
        return html`<zs-field-file
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .helpText="${baseAttrs.helpText}"
          .accept="${(props.accept as string) ?? ''}"
          .multiple="${!!props.multiple}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-file>`;

      case 'zs-field-lookup':
        return html`<zs-field-lookup
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value ?? ''}" .displayValue="${(props.displayValue as string) ?? ''}"
          .placeholder="${baseAttrs.placeholder}" .helpText="${baseAttrs.helpText}"
          .options="${(props.lookupOptions as unknown[]) ?? []}"
          .minChars="${(props.minChars as number) ?? 2}"
          .debounceMs="${(props.debounceMs as number) ?? 300}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-lookup>`;

      case 'zs-field-separator':
        return html`<zs-field-separator
          .variant="${(props.variant as string) ?? 'thin'}"
        ></zs-field-separator>`;

      case 'zs-field-heading':
        return html`<zs-field-heading
          .label="${baseAttrs.label}" .helpText="${baseAttrs.helpText}"
          .level="${(props.level as string) ?? 'h2'}"
        ></zs-field-heading>`;

      case 'zs-field-button':
        return html`<zs-field-button .config="${field}"></zs-field-button>`;

      case 'zs-field-html':
        return html`<zs-field-html
          .content="${(props.content as string) ?? String(value ?? '')}"
        ></zs-field-html>`;

      case 'zs-field-signature':
        return html`<zs-field-signature
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value != null ? String(value) : ''}"
          .helpText="${baseAttrs.helpText}"
          .penWidth="${(props.penWidth as number) ?? 2}"
          .penColor="${(props.penColor as string) ?? '#000000'}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-signature>`;

      case 'zs-field-address':
        return html`<zs-field-address
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value ?? {}}" .helpText="${baseAttrs.helpText}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}" ?readOnly="${baseAttrs.readOnly}"
        ></zs-field-address>`;

      case 'zs-field-chart':
        return html`<zs-field-chart
          .label="${baseAttrs.label}"
          .chartType="${(props.chartType as string) ?? 'bar'}"
          .data="${(props.chartData as unknown[]) ?? []}"
          .width="${(props.width as number) ?? 400}"
          .height="${(props.height as number) ?? 250}"
        ></zs-field-chart>`;

      case 'zs-field-media':
        return html`<zs-field-media
          .label="${baseAttrs.label}"
          .src="${value != null ? String(value) : (props.src as string) ?? ''}"
          .mediaType="${(props.mediaType as string) ?? 'image'}"
          .alt="${(props.alt as string) ?? ''}"
        ></zs-field-media>`;

      case 'zs-field-treeview':
        return html`<zs-field-treeview
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${Array.isArray(value) ? value : (value ? [value] : [])}"
          .helpText="${baseAttrs.helpText}"
          .nodes="${(props.nodes as unknown[]) ?? []}"
          .multiSelect="${!!props.multiSelect}"
          .showCheckboxes="${!!props.showCheckboxes}"
          .searchable="${!!props.searchable}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-treeview>`;

      case 'zs-field-chips':
        return html`<zs-field-chips
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${Array.isArray(value) ? value : []}"
          .placeholder="${baseAttrs.placeholder}" .helpText="${baseAttrs.helpText}"
          .options="${(props.options as unknown[]) ?? []}"
          .allowCustom="${props.allowCustom !== false}"
          .maxChips="${(props.maxChips as number) ?? 0}"
          .colorMode="${(props.colorMode as string) ?? 'default'}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-chips>`;

      case 'zs-field-datagrid':
        return html`<zs-field-datagrid
          .config="${field}"
          .rows="${Array.isArray(value) ? value : (props.rows as unknown[]) ?? []}"
          .endpoint="${(props.endpoint as string) ?? ''}"
          .authHeaders="${(props.authHeaders as Record<string, string>) ?? {}}"
          .authToken="${(props.authToken as string) ?? ''}"
          .theme="${this.themeMode}"
        ></zs-field-datagrid>`;

      case 'zs-field-report':
        return html`<zs-field-report
          .config="${field}"
          .template="${props.template ?? null}"
          .data="${value ?? props.data ?? null}"
          .theme="${this.themeMode}"
        ></zs-field-report>`;

      default:
        return html`<zs-field-text
          .fieldId="${baseAttrs.fieldId}" .label="${baseAttrs.label}"
          .value="${value != null ? String(value) : ''}"
          .placeholder="${baseAttrs.placeholder}"
          .errors="${baseAttrs.errors}"
          ?required="${baseAttrs.required}" ?disabled="${baseAttrs.disabled}"
        ></zs-field-text>`;
    }
  }

  private renderActions(position: 'top' | 'bottom') {
    if (!this.schema?.actions) return nothing;

    const actions = this.schema.actions.filter(a => (a.position ?? 'bottom') === position);
    if (actions.length === 0) return nothing;

    const ctx = this.buildContext();

    return html`
      <div class="zs-actions">
        ${actions.map(action => {
          const enabled = isActionEnabled(action, ctx);
          const variant = action.variant ?? 'secondary';
          return html`
            <button
              class="zs-btn zs-btn--${variant}"
              ?disabled="${!enabled}"
              @click="${() => this.handleAction(action.id)}"
            >${action.label}</button>
          `;
        })}
      </div>
    `;
  }
}

// Import modal/dialog/toast components
import './fields/zs-modal.js';
import './fields/zs-toast.js';
import './fields/zs-confirm-dialog.js';

// Re-export all components so a single import registers everything
export { ZenttoStudioApp } from './zentto-studio-app.js';
export { ZenttoStudioDesigner } from './zentto-studio-designer.js';
export { ZsAppWizard } from './designer/zs-app-wizard.js';
export { ZsPageDesigner } from './designer/zs-page-designer.js';
export { ZsModal } from './fields/zs-modal.js';
export { ZsToast } from './fields/zs-toast.js';
export { ZsConfirmDialog } from './fields/zs-confirm-dialog.js';

declare global {
  interface HTMLElementTagNameMap {
    'zentto-studio-renderer': ZenttoStudioRenderer;
  }
}
