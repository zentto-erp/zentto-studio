// @zentto/studio — Heading/label display field

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('zs-field-heading')
export class ZsFieldHeading extends LitElement {
  static styles = css`
    :host { display: block; }
    .zs-heading {
      font-family: var(--zs-font-family, sans-serif);
      color: var(--zs-text, #212529);
      margin: 0;
      line-height: 1.3;
    }
    .zs-heading--h1 { font-size: 28px; font-weight: 700; }
    .zs-heading--h2 { font-size: 22px; font-weight: 600; }
    .zs-heading--h3 { font-size: 18px; font-weight: 600; }
    .zs-heading--h4 { font-size: 16px; font-weight: 500; }
    .zs-subtitle {
      font-size: 14px; color: var(--zs-text-secondary, #6c757d);
      margin: 4px 0 0;
    }
  `;

  @property() label = '';
  @property() helpText = '';
  @property() level: 'h1' | 'h2' | 'h3' | 'h4' = 'h2';

  render() {
    return html`
      <div class="zs-heading zs-heading--${this.level}">${this.label}</div>
      ${this.helpText ? html`<p class="zs-subtitle">${this.helpText}</p>` : ''}
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-heading': ZsFieldHeading; } }
