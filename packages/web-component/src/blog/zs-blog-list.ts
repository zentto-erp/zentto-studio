// @zentto/studio — Blog list component

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles } from '../landing/zs-landing-styles.js';
import type { BlogListConfig, StudioProvider } from '@zentto/studio-core';
import './zs-blog-card.js';

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  contentFormat?: string;
  featuredImage?: string;
  author: { name: string; avatar?: string } | string;
  category: string;
  tags?: string[];
  publishedAt: string;
  status?: string;
}

@customElement('zs-blog-list')
export class ZsBlogList extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, css`
    :host { display: block; font-family: var(--zl-font-family); }

    .blog-list {
      max-width: var(--zl-max-width);
      margin: 0 auto;
      padding: var(--zl-section-padding-y) var(--zl-section-padding-x);
    }

    /* ── Toolbar (categories + search) ── */
    .blog-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .blog-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
    }

    .blog-category-btn {
      padding: 6px 16px;
      border: 1px solid var(--zl-border);
      border-radius: 20px;
      background: transparent;
      color: var(--zl-text-secondary);
      font-size: 14px;
      font-family: var(--zl-font-family);
      cursor: pointer;
      transition: all var(--zl-transition);
    }

    .blog-category-btn:hover {
      border-color: var(--zl-primary);
      color: var(--zl-primary);
    }

    .blog-category-btn--active {
      background: var(--zl-primary);
      color: white;
      border-color: var(--zl-primary);
    }

    .blog-search {
      position: relative;
    }

    .blog-search input {
      padding: 8px 16px 8px 36px;
      border: 1px solid var(--zl-border);
      border-radius: var(--zl-radius);
      font-size: 14px;
      font-family: var(--zl-font-family);
      background: var(--zl-bg);
      color: var(--zl-text);
      width: 240px;
      transition: border-color var(--zl-transition);
      outline: none;
    }

    .blog-search input:focus {
      border-color: var(--zl-primary);
    }

    .blog-search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--zl-text-muted);
      font-size: 14px;
      pointer-events: none;
    }

    /* ── Grid layout ── */
    .blog-grid {
      display: grid;
      gap: 28px;
    }

    .blog-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .blog-grid--3 { grid-template-columns: repeat(3, 1fr); }

    /* ── List layout ── */
    .blog-list-layout {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ── Magazine layout ── */
    .blog-magazine {
      display: grid;
      gap: 28px;
    }

    .blog-magazine-featured {
      grid-column: 1 / -1;
    }

    .blog-magazine-rest {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      grid-column: 1 / -1;
    }

    /* ── Pagination ── */
    .blog-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 40px;
    }

    .blog-page-btn {
      padding: 8px 14px;
      border: 1px solid var(--zl-border);
      border-radius: var(--zl-radius);
      background: var(--zl-bg);
      color: var(--zl-text);
      font-size: 14px;
      font-family: var(--zl-font-family);
      cursor: pointer;
      transition: all var(--zl-transition);
    }

    .blog-page-btn:hover:not(:disabled) {
      border-color: var(--zl-primary);
      color: var(--zl-primary);
    }

    .blog-page-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .blog-page-btn--active {
      background: var(--zl-primary);
      color: white;
      border-color: var(--zl-primary);
    }

    .blog-empty {
      text-align: center;
      padding: 60px 20px;
      color: var(--zl-text-muted);
      font-size: 16px;
    }

    @media (max-width: 900px) {
      .blog-grid--3 { grid-template-columns: repeat(2, 1fr); }
      .blog-magazine-rest { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .blog-grid--2,
      .blog-grid--3 { grid-template-columns: 1fr; }
      .blog-magazine-rest { grid-template-columns: 1fr; }
      .blog-toolbar { flex-direction: column; align-items: stretch; }
      .blog-search input { width: 100%; }
    }
  `];

  @property({ type: Object }) config?: BlogListConfig;
  @property({ type: Array }) posts: BlogPostData[] = [];
  @property({ type: Object }) provider?: StudioProvider;

  @state() private _activeCategory = '';
  @state() private _searchQuery = '';
  @state() private _currentPage = 1;

  private get _layout() { return this.config?.layout ?? 'grid'; }
  private get _columns() { return this.config?.columns ?? 3; }
  private get _pageSize() { return this.config?.pageSize ?? 9; }

  private get _categories(): string[] {
    const cats = new Set<string>();
    for (const post of this.posts ?? []) {
      if (post.category) cats.add(post.category);
    }
    return Array.from(cats).sort();
  }

  private get _filteredPosts(): BlogPostData[] {
    let result = this.posts ?? [];

    if (this._activeCategory) {
      result = result.filter((p) => p.category === this._activeCategory);
    }

    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    return result;
  }

  private get _pagedPosts(): BlogPostData[] {
    const start = (this._currentPage - 1) * this._pageSize;
    return this._filteredPosts.slice(start, start + this._pageSize);
  }

  private get _totalPages(): number {
    return Math.max(1, Math.ceil(this._filteredPosts.length / this._pageSize));
  }

  private _onCategoryClick(cat: string) {
    this._activeCategory = this._activeCategory === cat ? '' : cat;
    this._currentPage = 1;
  }

  private _onSearchInput(e: Event) {
    this._searchQuery = (e.target as HTMLInputElement).value;
    this._currentPage = 1;
  }

  private _onPageChange(page: number) {
    this._currentPage = Math.max(1, Math.min(page, this._totalPages));
  }

  private _getAuthorName(author: BlogPostData['author']): string {
    if (typeof author === 'string') return author;
    return author?.name ?? '';
  }

  private _getAuthorAvatar(author: BlogPostData['author']): string {
    if (typeof author === 'string') return '';
    return author?.avatar ?? '';
  }

  private _renderCard(post: BlogPostData): TemplateResult {
    return html`
      <zs-blog-card
        .title="${post.title}"
        .excerpt="${post.excerpt}"
        .image="${post.featuredImage ?? ''}"
        .date="${post.publishedAt ?? ''}"
        .author="${this._getAuthorName(post.author)}"
        .authorAvatar="${this._getAuthorAvatar(post.author)}"
        .category="${post.category ?? ''}"
        .slug="${post.slug}"
      ></zs-blog-card>
    `;
  }

  private _renderToolbar(): TemplateResult | typeof nothing {
    const showCats = this.config?.showCategories !== false && this._categories.length > 0;
    const showSearch = this.config?.showSearch !== false;

    if (!showCats && !showSearch) return nothing;

    return html`
      <div class="blog-toolbar">
        ${showCats ? html`
          <div class="blog-categories">
            <button
              class="blog-category-btn ${this._activeCategory === '' ? 'blog-category-btn--active' : ''}"
              @click="${() => this._onCategoryClick('')}"
            >Todos</button>
            ${this._categories.map((cat) => html`
              <button
                class="blog-category-btn ${this._activeCategory === cat ? 'blog-category-btn--active' : ''}"
                @click="${() => this._onCategoryClick(cat)}"
              >${cat}</button>
            `)}
          </div>
        ` : nothing}
        ${showSearch ? html`
          <div class="blog-search">
            <span class="blog-search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="Buscar..."
              .value="${this._searchQuery}"
              @input="${this._onSearchInput}"
            />
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderPagination(): TemplateResult | typeof nothing {
    if (this.config?.showPagination === false || this._totalPages <= 1) return nothing;

    const pages: number[] = [];
    for (let i = 1; i <= this._totalPages; i++) pages.push(i);

    return html`
      <div class="blog-pagination">
        <button
          class="blog-page-btn"
          ?disabled="${this._currentPage <= 1}"
          @click="${() => this._onPageChange(this._currentPage - 1)}"
        >&larr;</button>
        ${pages.map((p) => html`
          <button
            class="blog-page-btn ${p === this._currentPage ? 'blog-page-btn--active' : ''}"
            @click="${() => this._onPageChange(p)}"
          >${p}</button>
        `)}
        <button
          class="blog-page-btn"
          ?disabled="${this._currentPage >= this._totalPages}"
          @click="${() => this._onPageChange(this._currentPage + 1)}"
        >&rarr;</button>
      </div>
    `;
  }

  private _renderPosts(): TemplateResult {
    const posts = this._pagedPosts;

    if (posts.length === 0) {
      return html`<div class="blog-empty">No hay publicaciones que mostrar.</div>`;
    }

    switch (this._layout) {
      case 'list':
        return html`
          <div class="blog-list-layout">
            ${posts.map((p) => html`
              <zs-blog-card
                layout="horizontal"
                .title="${p.title}"
                .excerpt="${p.excerpt}"
                .image="${p.featuredImage ?? ''}"
                .date="${p.publishedAt ?? ''}"
                .author="${this._getAuthorName(p.author)}"
                .authorAvatar="${this._getAuthorAvatar(p.author)}"
                .category="${p.category ?? ''}"
                .slug="${p.slug}"
              ></zs-blog-card>
            `)}
          </div>
        `;

      case 'magazine': {
        const [featured, ...rest] = posts;
        return html`
          <div class="blog-magazine">
            ${featured ? html`
              <div class="blog-magazine-featured">
                <zs-blog-card
                  .title="${featured.title}"
                  .excerpt="${featured.excerpt}"
                  .image="${featured.featuredImage ?? ''}"
                  .date="${featured.publishedAt ?? ''}"
                  .author="${this._getAuthorName(featured.author)}"
                  .authorAvatar="${this._getAuthorAvatar(featured.author)}"
                  .category="${featured.category ?? ''}"
                  .slug="${featured.slug}"
                ></zs-blog-card>
              </div>
            ` : nothing}
            ${rest.length > 0 ? html`
              <div class="blog-magazine-rest">
                ${rest.map((p) => this._renderCard(p))}
              </div>
            ` : nothing}
          </div>
        `;
      }

      case 'grid':
      default:
        return html`
          <div class="blog-grid blog-grid--${this._columns}">
            ${posts.map((p) => this._renderCard(p))}
          </div>
        `;
    }
  }

  render() {
    return html`
      <div class="blog-list">
        ${this._renderToolbar()}
        ${this._renderPosts()}
        ${this._renderPagination()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-blog-list': ZsBlogList;
  }
}
