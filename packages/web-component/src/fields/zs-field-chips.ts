// @zentto/studio — Chips/pills input field
// Modern chip input with autocomplete, colors, removable, draggable

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

interface ChipOption {
  value: string;
  label: string;
  color?: string;
  icon?: string;
}

@customElement('zs-field-chips')
export class ZsFieldChips extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-chips-wrapper {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 6px 8px; min-height: var(--zs-input-height, 38px);
      border: var(--zs-input-border, 1px solid #dee2e6);
      border-radius: var(--zs-radius, 6px);
      background: var(--zs-input-bg, white);
      align-items: center; cursor: text;
      transition: border-color var(--zs-transition, 150ms);
    }
    .zs-chips-wrapper:focus-within {
      border-color: var(--zs-primary, #e67e22);
      box-shadow: 0 0 0 3px var(--zs-primary-light, #fdebd0);
    }
    .zs-chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 16px;
      font-size: 13px; font-weight: 500;
      background: var(--zs-bg-secondary, #f8f9fa);
      color: var(--zs-text, #212529);
      border: 1px solid var(--zs-border, #dee2e6);
      transition: all var(--zs-transition, 150ms);
      max-width: 200px;
    }
    .zs-chip:hover { background: var(--zs-bg-hover, #f1f3f5); }
    .zs-chip--primary {
      background: var(--zs-primary-light, #fdebd0);
      color: var(--zs-primary, #e67e22);
      border-color: transparent;
    }
    .zs-chip--success {
      background: #d4edda; color: #155724; border-color: transparent;
    }
    .zs-chip--danger {
      background: #f8d7da; color: #721c24; border-color: transparent;
    }
    .zs-chip--info {
      background: #d1ecf1; color: #0c5460; border-color: transparent;
    }
    .zs-chip-icon { font-size: 14px; }
    .zs-chip-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .zs-chip-remove {
      cursor: pointer; font-size: 14px; line-height: 1;
      opacity: 0.6; transition: opacity 100ms;
      border: none; background: none; padding: 0;
      color: inherit;
    }
    .zs-chip-remove:hover { opacity: 1; }
    .zs-chips-input {
      border: none; outline: none; flex: 1; min-width: 80px;
      font-family: var(--zs-font-family, sans-serif);
      font-size: var(--zs-font-size, 14px);
      background: transparent; color: var(--zs-text, #212529);
      padding: 2px 4px;
    }
    .zs-chips-suggestions {
      position: relative;
    }
    .zs-chips-dropdown {
      position: absolute; top: 100%; left: 0; right: 0;
      background: var(--zs-bg, white); border: 1px solid var(--zs-border, #dee2e6);
      border-radius: var(--zs-radius, 6px);
      box-shadow: 0 4px 12px var(--zs-shadow, rgba(0,0,0,0.08));
      max-height: 200px; overflow-y: auto; z-index: 100;
      margin-top: 2px;
    }
    .zs-chips-option {
      padding: 8px 12px; cursor: pointer;
      font-size: 13px; transition: background 100ms;
    }
    .zs-chips-option:hover { background: var(--zs-bg-hover, #f1f3f5); }
    .zs-chips-option--disabled { opacity: 0.5; cursor: not-allowed; }
    .zs-chip-count {
      font-size: 11px; color: var(--zs-text-muted, #adb5bd);
      margin-top: 4px;
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() placeholder = 'Escriba y presione Enter...';
  @property() helpText = '';
  @property({ type: Array }) value: string[] = [];
  @property({ type: Array }) options: ChipOption[] = [];
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) allowCustom = true;
  @property({ type: Number }) maxChips = 0; // 0 = unlimited
  @property() colorMode: 'default' | 'primary' | 'success' | 'danger' | 'info' | 'auto' = 'default';
  @property({ type: Array }) errors: string[] = [];

  @state() private inputValue = '';
  @state() private showSuggestions = false;

  private get filteredOptions(): ChipOption[] {
    if (!this.inputValue) return this.options.filter(o => !this.value.includes(o.value));
    const q = this.inputValue.toLowerCase();
    return this.options
      .filter(o => !this.value.includes(o.value) && o.label.toLowerCase().includes(q));
  }

  private addChip(chipValue: string) {
    if (!chipValue.trim()) return;
    if (this.maxChips > 0 && this.value.length >= this.maxChips) return;
    if (this.value.includes(chipValue)) return;

    const newValue = [...this.value, chipValue];
    this.inputValue = '';
    this.showSuggestions = false;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: newValue },
      bubbles: true, composed: true,
    }));
  }

  private removeChip(chipValue: string) {
    if (this.disabled) return;
    const newValue = this.value.filter(v => v !== chipValue);
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: newValue },
      bubbles: true, composed: true,
    }));
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (this.filteredOptions.length > 0) {
        this.addChip(this.filteredOptions[0].value);
      } else if (this.allowCustom && this.inputValue.trim()) {
        this.addChip(this.inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !this.inputValue && this.value.length > 0) {
      this.removeChip(this.value[this.value.length - 1]);
    }
  }

  private getChipClass(chipValue: string): string {
    if (this.colorMode === 'default') return 'zs-chip';
    if (this.colorMode !== 'auto') return `zs-chip zs-chip--${this.colorMode}`;
    // Auto: cycle through colors
    const colors = ['primary', 'success', 'info', 'danger'];
    const idx = this.value.indexOf(chipValue) % colors.length;
    return `zs-chip zs-chip--${colors[idx]}`;
  }

  private getChipLabel(chipValue: string): string {
    return this.options.find(o => o.value === chipValue)?.label ?? chipValue;
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <div class="zs-chips-suggestions">
          <div class="zs-chips-wrapper" @click="${() => (this.shadowRoot?.querySelector('.zs-chips-input') as HTMLInputElement)?.focus()}">
            ${this.value.map(v => html`
              <span class="${this.getChipClass(v)}">
                <span class="zs-chip-label">${this.getChipLabel(v)}</span>
                ${!this.disabled ? html`
                  <button class="zs-chip-remove" @click="${(e: Event) => { e.stopPropagation(); this.removeChip(v); }}">×</button>
                ` : ''}
              </span>
            `)}
            <input class="zs-chips-input"
              .value="${this.inputValue}"
              placeholder="${this.value.length === 0 ? this.placeholder : ''}"
              ?disabled="${this.disabled}"
              @input="${(e: Event) => { this.inputValue = (e.target as HTMLInputElement).value; this.showSuggestions = true; }}"
              @keydown="${this.handleKeydown}"
              @focus="${() => { this.showSuggestions = true; }}"
              @blur="${() => { setTimeout(() => { this.showSuggestions = false; }, 200); }}"
            />
          </div>
          ${this.showSuggestions && this.filteredOptions.length > 0 ? html`
            <div class="zs-chips-dropdown">
              ${this.filteredOptions.slice(0, 20).map(opt => html`
                <div class="zs-chips-option" @mousedown="${() => this.addChip(opt.value)}">
                  ${opt.icon ? html`<span>${opt.icon} </span>` : ''}${opt.label}
                </div>
              `)}
            </div>
          ` : ''}
        </div>
        ${this.maxChips > 0 ? html`
          <div class="zs-chip-count">${this.value.length} / ${this.maxChips}</div>
        ` : ''}
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-chips': ZsFieldChips; } }
