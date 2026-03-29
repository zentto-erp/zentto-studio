// @zentto/studio — Text field web component
// Handles: text, textarea, email, url, password, phone, color

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

@customElement('zs-field-text')
export class ZsFieldText extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property() helpText = '';
  @property() inputType: 'text' | 'email' | 'url' | 'password' | 'tel' | 'color' = 'text';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readOnly = false;
  @property({ type: Boolean }) multiline = false;
  @property({ type: Array }) errors: string[] = [];

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: input.value },
      bubbles: true, composed: true,
    }));
  }

  private handleBlur() {
    this.dispatchEvent(new CustomEvent('field-blur', {
      detail: { fieldId: this.fieldId },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const hasError = this.errors.length > 0;
    const inputClass = `zs-input ${hasError ? 'zs-input--error' : ''} ${this.multiline ? 'zs-textarea' : ''}`;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        ${this.multiline
          ? html`
            <textarea
              class="${inputClass}"
              .value="${this.value ?? ''}"
              placeholder="${this.placeholder}"
              ?disabled="${this.disabled}"
              ?readonly="${this.readOnly}"
              @input="${this.handleInput}"
              @blur="${this.handleBlur}"
            ></textarea>`
          : html`
            <input
              class="${inputClass}"
              type="${this.inputType}"
              .value="${this.value ?? ''}"
              placeholder="${this.placeholder}"
              ?disabled="${this.disabled}"
              ?readonly="${this.readOnly}"
              @input="${this.handleInput}"
              @blur="${this.handleBlur}"
            />`
        }
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-text': ZsFieldText;
  }
}
