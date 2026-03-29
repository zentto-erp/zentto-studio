// @zentto/studio — Separator/divider field

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('zs-field-separator')
export class ZsFieldSeparator extends LitElement {
  static styles = css`
    :host { display: block; }
    .zs-separator {
      border: none;
      border-top: 1px solid var(--zs-border, #dee2e6);
      margin: 8px 0;
    }
    .zs-separator--thick { border-top-width: 2px; }
    .zs-separator--dashed { border-top-style: dashed; }
  `;

  @property() variant: 'thin' | 'thick' | 'dashed' = 'thin';

  render() {
    const cls = `zs-separator ${this.variant === 'thick' ? 'zs-separator--thick' : this.variant === 'dashed' ? 'zs-separator--dashed' : ''}`;
    return html`<hr class="${cls}" />`;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-separator': ZsFieldSeparator; } }
