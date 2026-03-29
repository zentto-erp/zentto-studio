// @zentto/studio — Date field web component
// Handles: date, time, datetime

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

@customElement('zs-field-date')
export class ZsFieldDate extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() value = '';
  @property() helpText = '';
  @property() mode: 'date' | 'time' | 'datetime' = 'date';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readOnly = false;
  @property() min = '';
  @property() max = '';
  @property({ type: Array }) errors: string[] = [];

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: input.value },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const hasError = this.errors.length > 0;
    const inputClass = `zs-input ${hasError ? 'zs-input--error' : ''}`;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;

    const inputType = this.mode === 'datetime' ? 'datetime-local' : this.mode;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <input
          class="${inputClass}"
          type="${inputType}"
          .value="${this.value ?? ''}"
          min="${this.min}"
          max="${this.max}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readOnly}"
          @input="${this.handleInput}"
        />
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-date': ZsFieldDate;
  }
}
