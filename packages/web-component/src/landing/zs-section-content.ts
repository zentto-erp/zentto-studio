// @zentto/studio — Content section component (text + image two-column)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { ContentSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-content')
export class ZsSectionContent extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    .content-layout--image-left .content-text { order: 2; }
    .content-layout--image-left .content-image { order: 1; }

    .content-layout--no-image {
      grid-template-columns: 1fr;
      max-width: 800px;
      margin: 0 auto;
    }

    .content-headline {
      font-family: var(--zl-heading-font-family);
      font-size: var(--zl-subheading-font-size);
      font-weight: 700;
      color: var(--zl-text);
      line-height: var(--zl-heading-line-height);
      margin-bottom: 20px;
    }

    .content-body {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
    }

    .content-body p { margin-bottom: 16px; }
    .content-body ul, .content-body ol { margin-bottom: 16px; padding-left: 24px; }
    .content-body li { margin-bottom: 8px; list-style: disc; }
    .content-body ol li { list-style: decimal; }
    .content-body h3 { font-size: 20px; font-weight: 600; color: var(--zl-text); margin: 24px 0 12px; }
    .content-body a { color: var(--zl-primary); text-decoration: underline; }
    .content-body a:hover { color: var(--zl-primary-hover); }
    .content-body blockquote {
      border-left: 3px solid var(--zl-primary);
      padding: 12px 20px;
      margin: 16px 0;
      background: var(--zl-bg-alt);
      border-radius: 0 var(--zl-radius) var(--zl-radius) 0;
      font-style: italic;
    }

    .content-image img {
      width: 100%;
      border-radius: var(--zl-radius-lg);
      box-shadow: var(--zl-shadow-md);
    }

    @media (max-width: 768px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
      .content-layout--image-left .content-text { order: 1; }
      .content-layout--image-left .content-image { order: 2; }
    }
  `];

  @property({ type: Object }) config!: ContentSectionConfig;

  render() {
    const c = this.config;
    if (!c) return nothing;

    const imagePos = c.imagePosition ?? 'right';
    const hasImage = !!c.image;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          <div class="content-layout ${imagePos === 'left' ? 'content-layout--image-left' : ''} ${!hasImage ? 'content-layout--no-image' : ''}">
            <div class="content-text">
              ${c.headline ? html`<h2 class="content-headline">${c.headline}</h2>` : ''}
              <div class="content-body">${unsafeHTML(c.body)}</div>
            </div>
            ${hasImage ? html`
              <div class="content-image">
                <img src="${c.image}" alt="${c.headline ?? ''}" loading="lazy" />
              </div>
            ` : ''}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-content': ZsSectionContent; } }
