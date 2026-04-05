// @zentto/studio — Social Feed section component (unified social media display)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import { getSocialIcon } from '@zentto/studio-core';
import type { SocialFeedSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-social-feed')
export class ZsSectionSocialFeed extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* ── Grid variant ── */
    .sf-grid {
      display: grid;
      gap: 24px;
    }

    .sf-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .sf-grid--3 { grid-template-columns: repeat(3, 1fr); }
    .sf-grid--4 { grid-template-columns: repeat(4, 1fr); }

    /* ── Masonry variant ── */
    .sf-masonry {
      column-gap: 24px;
    }

    .sf-masonry--2 { columns: 2; }
    .sf-masonry--3 { columns: 3; }
    .sf-masonry--4 { columns: 4; }

    .sf-masonry .sf-card {
      break-inside: avoid;
      margin-bottom: 24px;
    }

    /* ── Card ── */
    .sf-card {
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

    .sf-card:hover {
      box-shadow: var(--zl-shadow-md);
      border-color: var(--zl-primary-light);
    }

    .sf-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
    }

    .sf-network-badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sf-network-icon {
      width: 20px;
      height: 20px;
      fill: #fff;
    }

    .sf-author-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .sf-author-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--zl-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sf-post-date {
      font-size: 12px;
      color: var(--zl-text-secondary);
    }

    .sf-card-image {
      width: 100%;
      object-fit: cover;
      display: block;
    }

    .sf-card-content {
      padding: 16px 20px;
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      line-height: var(--zl-line-height);
      flex: 1;
    }

    .sf-card-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--zl-border);
      font-size: 12px;
    }

    .sf-view-link {
      color: var(--zl-primary);
      text-decoration: none;
      font-weight: 600;
      transition: color var(--zl-transition);
    }

    .sf-view-link:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .sf-grid--3,
      .sf-grid--4 { grid-template-columns: repeat(2, 1fr); }
      .sf-masonry--3,
      .sf-masonry--4 { columns: 2; }
    }

    @media (max-width: 480px) {
      .sf-grid--2,
      .sf-grid--3,
      .sf-grid--4 { grid-template-columns: 1fr; }
      .sf-masonry--2,
      .sf-masonry--3,
      .sf-masonry--4 { columns: 1; }
    }
  `];

  @property({ type: Object }) config!: SocialFeedSectionConfig;

  private renderNetworkIcon(network: string) {
    const icon = getSocialIcon(network);
    if (!icon) {
      return html`<span style="font-size:18px;color:#fff">${network.charAt(0).toUpperCase()}</span>`;
    }
    return html`
      <svg class="sf-network-icon" viewBox="${icon.viewBox}">
        ${icon.paths.map(p => html`<path d="${p}" />`)}
      </svg>
    `;
  }

  private getNetworkColor(network: string): string {
    const icon = getSocialIcon(network);
    return icon?.brandColor ?? 'var(--zl-primary)';
  }

  private renderCard(post: SocialFeedSectionConfig['posts'][0]) {
    const brandColor = this.getNetworkColor(post.network);
    const tag = post.url ? 'a' : 'div';
    const wrapper = (content: unknown) =>
      post.url
        ? html`<a class="sf-card" href="${post.url}" target="_blank" rel="noopener noreferrer">${content}</a>`
        : html`<div class="sf-card">${content}</div>`;

    return wrapper(html`
      <div class="sf-card-header">
        <div class="sf-network-badge" style="background:${brandColor}">
          ${this.renderNetworkIcon(post.network)}
        </div>
        <div class="sf-author-info">
          ${post.author ? html`<span class="sf-author-name">${post.author}</span>` : html`<span class="sf-author-name" style="text-transform:capitalize">${post.network}</span>`}
          ${post.date ? html`<span class="sf-post-date">${post.date}</span>` : ''}
        </div>
      </div>
      ${post.image ? html`<img class="sf-card-image" src="${post.image}" alt="" loading="lazy" />` : ''}
      ${post.content ? html`<div class="sf-card-content">${post.content}</div>` : ''}
      ${post.url ? html`
        <div class="sf-card-footer">
          <span class="sf-view-link">View on ${post.network} &rarr;</span>
        </div>
      ` : ''}
    `);
  }

  render() {
    const c = this.config;
    if (!c?.posts?.length) return nothing;

    const variant = c.variant ?? 'grid';
    const cols = c.columns ?? 3;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          <div class="sf-${variant} sf-${variant}--${cols}">
            ${c.posts.map(post => this.renderCard(post))}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-social-feed': ZsSectionSocialFeed; } }
