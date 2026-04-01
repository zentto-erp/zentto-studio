// @zentto/studio — Blog card component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles } from '../landing/zs-landing-styles.js';

@customElement('zs-blog-card')
export class ZsBlogCard extends LitElement {
  static styles = [landingTokens, landingResetStyles, css`
    :host { display: block; }

    .card {
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--zl-transition);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--zl-shadow-lg);
      border-color: var(--zl-primary-light);
    }

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .card-image-placeholder {
      width: 100%;
      height: 200px;
      background: var(--zl-bg-alt);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: var(--zl-text-muted);
    }

    .card-body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-category {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      margin-bottom: 10px;
      width: fit-content;
    }

    .card-title {
      font-family: var(--zl-heading-font-family);
      font-size: 18px;
      font-weight: 700;
      color: var(--zl-text);
      line-height: 1.3;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-excerpt {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 12px;
      border-top: 1px solid var(--zl-border);
    }

    .card-author {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-author-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      object-fit: cover;
    }

    .card-author-avatar-placeholder {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--zl-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .card-author-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--zl-text);
    }

    .card-date {
      font-size: 12px;
      color: var(--zl-text-muted);
      white-space: nowrap;
    }

    /* Horizontal layout variant */
    :host([layout="horizontal"]) .card {
      flex-direction: row;
      height: auto;
    }

    :host([layout="horizontal"]) .card-image,
    :host([layout="horizontal"]) .card-image-placeholder {
      width: 280px;
      min-width: 280px;
      height: auto;
      min-height: 180px;
    }

    @media (max-width: 600px) {
      :host([layout="horizontal"]) .card {
        flex-direction: column;
      }
      :host([layout="horizontal"]) .card-image,
      :host([layout="horizontal"]) .card-image-placeholder {
        width: 100%;
        min-width: auto;
        height: 200px;
      }
    }
  `];

  @property() title = '';
  @property() excerpt = '';
  @property() image = '';
  @property() date = '';
  @property() author = '';
  @property({ attribute: 'author-avatar' }) authorAvatar = '';
  @property() category = '';
  @property() slug = '';

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('blog-navigate', {
      detail: { slug: this.slug },
      bubbles: true,
      composed: true,
    }));
  }

  private _formatDate(iso: string): string {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  private _authorInitial(): string {
    return this.author ? this.author.charAt(0).toUpperCase() : '?';
  }

  render() {
    return html`
      <article class="card" @click="${this._handleClick}">
        ${this.image
          ? html`<img class="card-image" src="${this.image}" alt="${this.title}" loading="lazy" />`
          : html`<div class="card-image-placeholder">&#128221;</div>`
        }
        <div class="card-body">
          ${this.category ? html`<span class="card-category">${this.category}</span>` : nothing}
          <h3 class="card-title">${this.title}</h3>
          <p class="card-excerpt">${this.excerpt}</p>
          <div class="card-footer">
            <div class="card-author">
              ${this.authorAvatar
                ? html`<img class="card-author-avatar" src="${this.authorAvatar}" alt="${this.author}" />`
                : html`<span class="card-author-avatar-placeholder">${this._authorInitial()}</span>`
              }
              <span class="card-author-name">${this.author}</span>
            </div>
            ${this.date ? html`<span class="card-date">${this._formatDate(this.date)}</span>` : nothing}
          </div>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-blog-card': ZsBlogCard;
  }
}
