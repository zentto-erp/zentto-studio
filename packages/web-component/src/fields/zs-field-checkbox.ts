// @zentto/studio — Checkbox/Radio field web component
// Handles: checkbox (single + group), radio

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@customElement('zs-field-checkbox')
export class ZsFieldCheckbox extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-check-group { display: flex; flex-direction: column; gap: 6px; }
    .zs-check-group--horizontal { flex-direction: row; flex-wrap: wrap; gap: 12px; }
    .zs-check-item {
      display: flex; align-items: center; gap: 8px; cursor: pointer;
      font-size: var(--zs-font-size); color: var(--zs-text);
    }
    .zs-check-item input {
      accent-color: var(--zs-primary); width: 16px; height: 16px; cursor: pointer;
    }
    .zs-check-item--disabled { opacity: 0.6; cursor: not-allowed; }
    .zs-check-single {
      display: flex; align-items: center; gap: 8px; cursor: pointer;
      font-size: var(--zs-font-size);
    }
    .zs-check-single input {
      accent-color: var(--zs-primary); width: 18px; height: 18px; cursor: pointer;
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() value: boolean | string | number | (string | number)[] = false;
  @property() helpText = '';
  @property() mode: 'checkbox' | 'radio' = 'checkbox';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) horizontal = false;
  @property({ type: Array }) options: CheckboxOption[] = [];
  @property({ type: Array }) errors: string[] = [];

  private handleSingleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: input.checked },
      bubbles: true, composed: true,
    }));
  }

  private handleRadioChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: input.value },
      bubbles: true, composed: true,
    }));
  }

  private handleCheckboxGroupChange(optValue: string | number, checked: boolean) {
    const currentValues = Array.isArray(this.value) ? [...this.value] : [];
    const newValues = checked
      ? [...currentValues, optValue]
      : currentValues.filter(v => v !== optValue);
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: newValues },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;
    const isSingle = this.options.length === 0 && this.mode === 'checkbox';

    return html`
      <div class="zs-field">
        ${this.label && !isSingle ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        ${isSingle ? this.renderSingle() :
          this.mode === 'radio' ? this.renderRadioGroup() :
          this.renderCheckboxGroup()}
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }

  private renderSingle() {
    return html`
      <label class="zs-check-single ${this.disabled ? 'zs-check-item--disabled' : ''}">
        <input
          type="checkbox"
          .checked="${this.value === true}"
          ?disabled="${this.disabled}"
          @change="${this.handleSingleChange}"
        />
        ${this.label}
      </label>
    `;
  }

  private renderRadioGroup() {
    const groupClass = `zs-check-group ${this.horizontal ? 'zs-check-group--horizontal' : ''}`;
    return html`
      <div class="${groupClass}">
        ${this.options.map(opt => html`
          <label class="zs-check-item ${opt.disabled || this.disabled ? 'zs-check-item--disabled' : ''}">
            <input
              type="radio"
              name="${this.fieldId}"
              value="${opt.value}"
              .checked="${String(this.value) === String(opt.value)}"
              ?disabled="${opt.disabled || this.disabled}"
              @change="${this.handleRadioChange}"
            />
            ${opt.label}
          </label>
        `)}
      </div>
    `;
  }

  private renderCheckboxGroup() {
    const selectedValues = Array.isArray(this.value) ? this.value.map(String) : [];
    const groupClass = `zs-check-group ${this.horizontal ? 'zs-check-group--horizontal' : ''}`;
    return html`
      <div class="${groupClass}">
        ${this.options.map(opt => html`
          <label class="zs-check-item ${opt.disabled || this.disabled ? 'zs-check-item--disabled' : ''}">
            <input
              type="checkbox"
              .checked="${selectedValues.includes(String(opt.value))}"
              ?disabled="${opt.disabled || this.disabled}"
              @change="${(e: Event) => this.handleCheckboxGroupChange(opt.value, (e.target as HTMLInputElement).checked)}"
            />
            ${opt.label}
          </label>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-checkbox': ZsFieldCheckbox;
  }
}
