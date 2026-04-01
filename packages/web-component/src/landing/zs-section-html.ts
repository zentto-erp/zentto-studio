// @zentto/studio — Raw HTML section component (escape hatch)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';

@customElement('zs-section-html')
export class ZsSectionHtml extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }
  `];

  @property({ type: String }) content: string = '';

  render() {
    if (!this.content) return nothing;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${unsafeHTML(this.content)}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-html': ZsSectionHtml; } }
