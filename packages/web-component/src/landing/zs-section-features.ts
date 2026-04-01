// @zentto/studio — Features section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { FeaturesSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-features')
export class ZsSectionFeatures extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .features-grid {
      display: grid;
      gap: 32px;
    }

    .features-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .features-grid--3 { grid-template-columns: repeat(3, 1fr); }
    .features-grid--4 { grid-template-columns: repeat(4, 1fr); }

    /* Cards variant */
    .feature-card {
      padding: 32px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      transition: all var(--zl-transition);
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--zl-shadow-lg);
      border-color: var(--zl-primary-light);
    }

    /* Icons variant */
    .feature-icon-item {
      text-align: center;
      padding: 16px;
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      font-size: 28px;
    }

    .feature-card .feature-icon {
      margin: 0 0 20px;
    }

    .feature-title {
      font-family: var(--zl-heading-font-family);
      font-size: 18px;
      font-weight: 600;
      color: var(--zl-text);
      margin-bottom: 8px;
    }

    .feature-desc {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
    }

    .feature-link {
      display: inline-block;
      margin-top: 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--zl-primary);
      transition: color var(--zl-transition);
      cursor: pointer;
    }

    .feature-link:hover { color: var(--zl-primary-hover); }

    /* List variant */
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 720px;
      margin: 0 auto;
    }

    .feature-list-item {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .feature-list-item .feature-icon {
      flex-shrink: 0;
      margin: 0;
    }

    /* Alternating variant */
    .features-alternating {
      display: flex;
      flex-direction: column;
      gap: 64px;
    }

    .feature-alt-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    .feature-alt-row--reverse .feature-alt-content { order: 2; }
    .feature-alt-row--reverse .feature-alt-image { order: 1; }

    .feature-alt-image {
      font-size: 80px;
      text-align: center;
      background: var(--zl-bg-alt);
      border-radius: var(--zl-radius-lg);
      padding: 48px;
    }

    @media (max-width: 768px) {
      .features-grid--2,
      .features-grid--3,
      .features-grid--4 {
        grid-template-columns: 1fr;
      }
      .feature-alt-row {
        grid-template-columns: 1fr;
      }
      .feature-alt-row--reverse .feature-alt-content { order: 1; }
      .feature-alt-row--reverse .feature-alt-image { order: 2; }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .features-grid--3,
      .features-grid--4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `];

  @property({ type: Object }) config!: FeaturesSectionConfig;

  private renderIcon(icon: string) {
    if (icon.startsWith('<')) return unsafeHTML(icon);
    return icon;
  }

  private renderCards() {
    const c = this.config;
    const cols = c.columns ?? 3;
    return html`
      <div class="features-grid features-grid--${cols}">
        ${c.items.map(item => html`
          <div class="feature-card">
            <div class="feature-icon">${this.renderIcon(item.icon)}</div>
            <div class="feature-title">${item.title}</div>
            <div class="feature-desc">${item.description}</div>
            ${item.link ? html`<a class="feature-link" href="${item.link}">Saber mas &rarr;</a>` : ''}
          </div>
        `)}
      </div>
    `;
  }

  private renderIcons() {
    const c = this.config;
    const cols = c.columns ?? 3;
    return html`
      <div class="features-grid features-grid--${cols}">
        ${c.items.map(item => html`
          <div class="feature-icon-item">
            <div class="feature-icon">${this.renderIcon(item.icon)}</div>
            <div class="feature-title">${item.title}</div>
            <div class="feature-desc">${item.description}</div>
          </div>
        `)}
      </div>
    `;
  }

  private renderList() {
    return html`
      <div class="features-list">
        ${this.config.items.map(item => html`
          <div class="feature-list-item">
            <div class="feature-icon">${this.renderIcon(item.icon)}</div>
            <div>
              <div class="feature-title">${item.title}</div>
              <div class="feature-desc">${item.description}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  private renderAlternating() {
    return html`
      <div class="features-alternating">
        ${this.config.items.map((item, i) => html`
          <div class="feature-alt-row ${i % 2 === 1 ? 'feature-alt-row--reverse' : ''}">
            <div class="feature-alt-content">
              <div class="feature-title" style="font-size:24px;margin-bottom:12px;">${item.title}</div>
              <div class="feature-desc" style="font-size:16px;">${item.description}</div>
              ${item.link ? html`<a class="feature-link" href="${item.link}">Saber mas &rarr;</a>` : ''}
            </div>
            <div class="feature-alt-image">${this.renderIcon(item.icon)}</div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'cards';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          ${variant === 'cards' ? this.renderCards() :
            variant === 'icons' ? this.renderIcons() :
            variant === 'list' ? this.renderList() :
            variant === 'alternating' ? this.renderAlternating() :
            this.renderCards()}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-features': ZsSectionFeatures; } }
