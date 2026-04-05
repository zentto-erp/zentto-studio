// @zentto/studio — Blog Preview section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { BlogPreviewSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-blog-preview')
export class ZsSectionBlogPreview extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* ── Cards variant (grid) ── */
    .bp-grid {
      display: grid;
      gap: 24px;
    }

    .bp-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .bp-grid--3 { grid-template-columns: repeat(3, 1fr); }
    .bp-grid--4 { grid-template-columns: repeat(4, 1fr); }

    .bp-card {
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      overflow: hidden;
      transition: all var(--zl-transition);
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
    }

    .bp-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--zl-shadow-md);
      border-color: var(--zl-primary-light);
    }

    .bp-card-image {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      display: block;
    }

    .bp-card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .bp-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--zl-text);
      margin: 0 0 8px;
      line-height: 1.3;
    }

    .bp-card-excerpt {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
      flex: 1;
      margin-bottom: 12px;
    }

    .bp-card-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 12px;
      color: var(--zl-text-secondary);
    }

    .bp-category {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── List variant ── */
    .bp-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .bp-list-item {
      display: flex;
      gap: 20px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      overflow: hidden;
      transition: all var(--zl-transition);
      text-decoration: none;
      color: inherit;
    }

    .bp-list-item:hover {
      transform: translateY(-4px);
      box-shadow: var(--zl-shadow-md);
      border-color: var(--zl-primary-light);
    }

    .bp-list-image {
      width: 260px;
      min-height: 160px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .bp-list-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    /* ── Minimal variant ── */
    .bp-minimal {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bp-minimal-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--zl-border);
      text-decoration: none;
      color: inherit;
      transition: color var(--zl-transition);
    }

    .bp-minimal-item:last-child { border-bottom: none; }

    .bp-minimal-item:hover .bp-minimal-title {
      color: var(--zl-primary);
    }

    .bp-minimal-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--zl-text);
      transition: color var(--zl-transition);
    }

    .bp-minimal-date {
      font-size: 13px;
      color: var(--zl-text-secondary);
      flex-shrink: 0;
    }

    /* ── CTA link ── */
    .bp-cta {
      text-align: center;
      margin-top: 32px;
    }

    .bp-cta a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--zl-primary);
      font-weight: 600;
      font-size: var(--zl-body-font-size);
      text-decoration: none;
      transition: color var(--zl-transition);
    }

    .bp-cta a:hover { text-decoration: underline; }

    .bp-cta-arrow { font-size: 1.2em; }

    @media (max-width: 768px) {
      .bp-grid--3,
      .bp-grid--4 { grid-template-columns: repeat(2, 1fr); }

      .bp-list-item { flex-direction: column; }
      .bp-list-image { width: 100%; min-height: 180px; }
    }

    @media (max-width: 480px) {
      .bp-grid--2,
      .bp-grid--3,
      .bp-grid--4 { grid-template-columns: 1fr; }
    }
  `];

  @property({ type: Object }) config!: BlogPreviewSectionConfig;

  private renderCardVariant() {
    const c = this.config;
    const cols = c.columns ?? 3;
    return html`
      <div class="bp-grid bp-grid--${cols}">
        ${c.posts.map(post => html`
          <a class="bp-card" href="${post.url ?? '#'}" target="${post.url?.startsWith('http') ? '_blank' : '_self'}">
            ${post.image ? html`<img class="bp-card-image" src="${post.image}" alt="${post.title}" loading="lazy" />` : ''}
            <div class="bp-card-body">
              ${c.showCategory !== false && post.category ? html`<span class="bp-category">${post.category}</span>` : ''}
              <h3 class="bp-card-title">${post.title}</h3>
              ${post.excerpt ? html`<p class="bp-card-excerpt">${post.excerpt}</p>` : ''}
              <div class="bp-card-meta">
                ${c.showAuthor !== false && post.author ? html`<span>${post.author}</span>` : ''}
                ${c.showDate !== false && post.date ? html`<span>${post.date}</span>` : ''}
              </div>
            </div>
          </a>
        `)}
      </div>
    `;
  }

  private renderListVariant() {
    const c = this.config;
    return html`
      <div class="bp-list">
        ${c.posts.map(post => html`
          <a class="bp-list-item" href="${post.url ?? '#'}" target="${post.url?.startsWith('http') ? '_blank' : '_self'}">
            ${post.image ? html`<img class="bp-list-image" src="${post.image}" alt="${post.title}" loading="lazy" />` : ''}
            <div class="bp-list-body">
              ${c.showCategory !== false && post.category ? html`<span class="bp-category">${post.category}</span>` : ''}
              <h3 class="bp-card-title">${post.title}</h3>
              ${post.excerpt ? html`<p class="bp-card-excerpt">${post.excerpt}</p>` : ''}
              <div class="bp-card-meta">
                ${c.showAuthor !== false && post.author ? html`<span>${post.author}</span>` : ''}
                ${c.showDate !== false && post.date ? html`<span>${post.date}</span>` : ''}
              </div>
            </div>
          </a>
        `)}
      </div>
    `;
  }

  private renderMinimalVariant() {
    const c = this.config;
    return html`
      <div class="bp-minimal">
        ${c.posts.map(post => html`
          <a class="bp-minimal-item" href="${post.url ?? '#'}" target="${post.url?.startsWith('http') ? '_blank' : '_self'}">
            <span class="bp-minimal-title">${post.title}</span>
            ${c.showDate !== false && post.date ? html`<span class="bp-minimal-date">${post.date}</span>` : ''}
          </a>
        `)}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c?.posts?.length) return nothing;

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
          ${variant === 'list' ? this.renderListVariant() :
            variant === 'minimal' ? this.renderMinimalVariant() :
            this.renderCardVariant()}
          ${c.ctaLabel && c.ctaUrl ? html`
            <div class="bp-cta">
              <a href="${c.ctaUrl}">${c.ctaLabel} <span class="bp-cta-arrow">&rarr;</span></a>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-blog-preview': ZsSectionBlogPreview; } }
