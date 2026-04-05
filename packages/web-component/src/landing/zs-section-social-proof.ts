// @zentto/studio — Social Proof section component (reviews/ratings)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { SocialProofSectionConfig } from '@zentto/studio-core';

/** Known source icons (inline SVG fragments) */
const SOURCE_ICONS: Record<string, string> = {
  google: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>',
  trustpilot: '<svg viewBox="0 0 24 24" fill="#00B67A"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>',
  yelp: '<svg viewBox="0 0 24 24" fill="#FF1A1A"><path d="M12.74 16.69l2.63 3.96a.69.69 0 0 0 .81.28l3.02-1.09a.69.69 0 0 0 .37-.93l-1.86-3.57a.69.69 0 0 0-.83-.34l-3.79 1.06a.69.69 0 0 0-.35.63zM11.34 14.3a.69.69 0 0 0-.65-.41l-3.93-.13a.69.69 0 0 0-.66.48l-.96 3.06a.69.69 0 0 0 .54.89l3.93.56a.69.69 0 0 0 .77-.52l.96-3.06v-.02l-.01-.85zM12.5 12.7a.69.69 0 0 0 .57.03l3.73-1.33a.69.69 0 0 0 .42-.72l-.41-3.16a.69.69 0 0 0-.83-.56l-3.73 1.09a.69.69 0 0 0-.49.71l.18 3.39a.69.69 0 0 0 .56.55zM10.6 11.6a.69.69 0 0 0 .2-.62L9.58 4.66a.69.69 0 0 0-.52-.53L5.63 3.3a.69.69 0 0 0-.85.76l1.77 7.09a.69.69 0 0 0 .84.5l3.21-.05z"/></svg>',
};

@customElement('zs-section-social-proof')
export class ZsSectionSocialProof extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* ── Star rating ── */
    .sp-stars {
      display: flex;
      gap: 2px;
      margin-bottom: 12px;
    }

    .sp-star {
      width: 18px;
      height: 18px;
      color: #f5a623;
    }

    .sp-star--empty { color: var(--zl-border); }

    /* ── Card ── */
    .sp-card {
      padding: 28px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      transition: all var(--zl-transition);
      display: flex;
      flex-direction: column;
    }

    .sp-card:hover {
      box-shadow: var(--zl-shadow-md);
      border-color: var(--zl-primary-light);
    }

    .sp-quote {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      line-height: var(--zl-line-height);
      flex: 1;
      margin-bottom: 20px;
      font-style: italic;
      position: relative;
      padding-left: 1.5rem;
    }

    .sp-quote::before {
      content: '\\201C';
      position: absolute;
      left: 0;
      top: -0.25em;
      font-size: 3rem;
      color: var(--zl-primary);
      line-height: 1;
    }

    .sp-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .sp-author-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sp-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .sp-avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .sp-author-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--zl-text);
    }

    .sp-date {
      font-size: 12px;
      color: var(--zl-text-secondary);
    }

    .sp-source-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--zl-bg-alt);
      font-size: 12px;
      font-weight: 600;
      color: var(--zl-text-secondary);
    }

    .sp-source-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    /* ── Grid variant ── */
    .sp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    /* ── Carousel variant ── */
    .sp-carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 20px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 4px;
    }

    .sp-carousel::-webkit-scrollbar { display: none; }

    .sp-carousel .sp-card {
      flex: 0 0 min(90vw, 380px);
      scroll-snap-align: start;
    }

    /* ── Masonry variant ── */
    .sp-masonry {
      columns: 3;
      column-gap: 24px;
    }

    .sp-masonry .sp-card {
      break-inside: avoid;
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .sp-grid { grid-template-columns: 1fr; }
      .sp-masonry { columns: 1; }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .sp-masonry { columns: 2; }
    }
  `];

  @property({ type: Object }) config!: SocialProofSectionConfig;

  private renderStars(rating: number) {
    if (this.config.showRating === false) return nothing;
    const full = Math.round(Math.min(5, Math.max(0, rating)));
    return html`
      <div class="sp-stars" aria-label="Rating: ${rating} out of 5">
        ${[1, 2, 3, 4, 5].map(i => html`
          <svg class="sp-star ${i <= full ? '' : 'sp-star--empty'}" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        `)}
      </div>
    `;
  }

  private renderAvatar(author: string, avatar?: string) {
    if (avatar) {
      return html`<img class="sp-avatar" src="${avatar}" alt="${author}" loading="lazy" />`;
    }
    const initials = author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return html`<div class="sp-avatar-placeholder">${initials}</div>`;
  }

  private renderSourceBadge(source: string) {
    const iconSvg = SOURCE_ICONS[source.toLowerCase()];
    return html`
      <span class="sp-source-badge">
        ${iconSvg
          ? html`<span class="sp-source-icon" .innerHTML="${iconSvg}"></span>`
          : ''}
        ${source}
      </span>
    `;
  }

  private renderCard(item: SocialProofSectionConfig['items'][0]) {
    return html`
      <div class="sp-card">
        ${this.renderStars(item.rating)}
        <div class="sp-quote">${item.text}</div>
        <div class="sp-footer">
          <div class="sp-author-row">
            ${this.renderAvatar(item.author, item.avatar)}
            <div>
              <div class="sp-author-name">${item.author}</div>
              ${item.date ? html`<div class="sp-date">${item.date}</div>` : ''}
            </div>
          </div>
          ${this.renderSourceBadge(item.source)}
        </div>
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c?.items?.length) return nothing;

    const variant = c.variant ?? 'grid';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          <div class="sp-${variant}">
            ${c.items.map(item => this.renderCard(item))}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-social-proof': ZsSectionSocialProof; } }
