// @zentto/studio — Raw HTML display field

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('zs-field-html')
export class ZsFieldHtml extends LitElement {
  static styles = css`
    :host { display: block; }
    .zs-html-wrapper {
      font-family: var(--zs-font-family, sans-serif);
      color: var(--zs-text, #212529);
      font-size: var(--zs-font-size, 14px);
      line-height: var(--zs-line-height, 1.5);
    }
    .zs-html-wrapper img { max-width: 100%; height: auto; }
    .zs-html-wrapper a { color: var(--zs-primary, #e67e22); }
  `;

  @property() content = '';

  render() {
    return html`<div class="zs-html-wrapper">${unsafeHTML(this.content)}</div>`;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-html': ZsFieldHtml; } }
