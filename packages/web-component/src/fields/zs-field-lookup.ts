// @zentto/studio — Lookup field (async search with debounce)

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

interface LookupOption {
  value: string | number;
  label: string;
  subtitle?: string;
}

@customElement('zs-field-lookup')
export class ZsFieldLookup extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; position: relative; }
    .zs-lookup-wrapper { position: relative; }
    .zs-lookup-results {
      position: absolute; top: 100%; left: 0; right: 0;
      background: var(--zs-bg); border: 1px solid var(--zs-border);
      border-radius: var(--zs-radius); box-shadow: 0 4px 12px var(--zs-shadow);
      max-height: 240px; overflow-y: auto; z-index: 100;
      margin-top: 2px;
    }
    .zs-lookup-item {
      padding: 8px 12px; cursor: pointer;
      transition: background var(--zs-transition);
    }
    .zs-lookup-item:hover { background: var(--zs-bg-hover); }
    .zs-lookup-item--selected { background: var(--zs-primary-light); }
    .zs-lookup-label { font-size: var(--zs-font-size); color: var(--zs-text); }
    .zs-lookup-subtitle { font-size: var(--zs-font-size-sm); color: var(--zs-text-muted); }
    .zs-lookup-empty {
      padding: 12px; text-align: center;
      color: var(--zs-text-muted); font-size: var(--zs-font-size-sm);
    }
    .zs-lookup-loading { padding: 12px; text-align: center; color: var(--zs-text-muted); }
    .zs-lookup-clear {
      position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
      border: none; background: none; cursor: pointer; font-size: 16px;
      color: var(--zs-text-muted); padding: 2px 4px;
    }
    .zs-lookup-clear:hover { color: var(--zs-text); }
    .zs-selected-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 12px; margin-top: 4px;
      background: var(--zs-primary-light); color: var(--zs-primary);
      font-size: var(--zs-font-size-sm);
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() placeholder = 'Buscar...';
  @property() helpText = '';
  @property() value: string | number = '';
  @property() displayValue = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) minChars = 2;
  @property({ type: Number }) debounceMs = 300;
  @property({ type: Array }) options: LookupOption[] = [];
  @property({ type: Array }) errors: string[] = [];

  @state() private query = '';
  @state() private showResults = false;
  @state() private loading = false;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.query = input.value;

    if (this.query.length < this.minChars) {
      this.showResults = false;
      return;
    }

    // Debounce search
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.loading = true;
      this.showResults = true;
      this.dispatchEvent(new CustomEvent('lookup-search', {
        detail: { fieldId: this.fieldId, query: this.query },
        bubbles: true, composed: true,
      }));
      // Loading will be set to false when options are updated externally
      setTimeout(() => { this.loading = false; }, 100);
    }, this.debounceMs);
  }

  private selectOption(opt: LookupOption) {
    this.showResults = false;
    this.query = '';
    this.displayValue = opt.label;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: opt.value },
      bubbles: true, composed: true,
    }));
  }

  private clearSelection() {
    this.displayValue = '';
    this.query = '';
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: null },
      bubbles: true, composed: true,
    }));
  }

  private handleBlur() {
    // Delay to allow click on results
    setTimeout(() => { this.showResults = false; }, 200);
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;
    const inputClass = `zs-input ${hasError ? 'zs-input--error' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <div class="zs-lookup-wrapper">
          <input
            class="${inputClass}"
            type="text"
            .value="${this.displayValue || this.query}"
            placeholder="${this.placeholder}"
            ?disabled="${this.disabled}"
            @input="${this.handleInput}"
            @focus="${() => { if (this.query.length >= this.minChars) this.showResults = true; }}"
            @blur="${this.handleBlur}"
          />
          ${this.value ? html`
            <button class="zs-lookup-clear" @click="${this.clearSelection}" title="Limpiar">×</button>
          ` : ''}
          ${this.showResults ? html`
            <div class="zs-lookup-results">
              ${this.loading
                ? html`<div class="zs-lookup-loading">Buscando...</div>`
                : this.options.length === 0
                  ? html`<div class="zs-lookup-empty">Sin resultados</div>`
                  : this.options.map(opt => html`
                    <div
                      class="zs-lookup-item ${String(opt.value) === String(this.value) ? 'zs-lookup-item--selected' : ''}"
                      @mousedown="${() => this.selectOption(opt)}"
                    >
                      <div class="zs-lookup-label">${opt.label}</div>
                      ${opt.subtitle ? html`<div class="zs-lookup-subtitle">${opt.subtitle}</div>` : ''}
                    </div>
                  `)
              }
            </div>
          ` : ''}
        </div>
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-lookup': ZsFieldLookup; } }
