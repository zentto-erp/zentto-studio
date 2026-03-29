// @zentto/studio — Switch/toggle field web component

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

@customElement('zs-field-switch')
export class ZsFieldSwitch extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-switch-wrapper {
      display: flex; align-items: center; gap: 10px;
    }
    .zs-switch {
      position: relative; width: 44px; height: 24px;
      background: var(--zs-border); border-radius: 12px;
      cursor: pointer; transition: background var(--zs-transition);
      border: none; padding: 0;
    }
    .zs-switch::after {
      content: ''; position: absolute;
      top: 2px; left: 2px; width: 20px; height: 20px;
      background: white; border-radius: 50%;
      transition: transform var(--zs-transition);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .zs-switch--on { background: var(--zs-primary); }
    .zs-switch--on::after { transform: translateX(20px); }
    .zs-switch:disabled { opacity: 0.5; cursor: not-allowed; }
    .zs-switch-label {
      font-size: var(--zs-font-size); color: var(--zs-text); cursor: pointer;
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() helpText = '';
  @property({ type: Boolean }) value = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Array }) errors: string[] = [];

  private toggle() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: !this.value },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const hasError = this.errors.length > 0;

    return html`
      <div class="zs-field">
        <div class="zs-switch-wrapper" @click="${this.toggle}">
          <button
            type="button"
            class="zs-switch ${this.value ? 'zs-switch--on' : ''}"
            ?disabled="${this.disabled}"
            role="switch"
            aria-checked="${this.value}"
          ></button>
          ${this.label ? html`<span class="zs-switch-label">${this.label}</span>` : ''}
        </div>
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-switch': ZsFieldSwitch;
  }
}
