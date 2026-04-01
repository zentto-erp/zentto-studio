// @zentto/studio — Blog post renderer component

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles } from '../landing/zs-landing-styles.js';
import type { BlogPostConfig } from '@zentto/studio-core';
import './zs-blog-card.js';

interface BlogPostData {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  contentFormat?: 'html' | 'markdown';
  featuredImage?: string;
  author?: { name: string; avatar?: string } | string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  status?: string;
}

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  author: { name: string; avatar?: string } | string;
  category: string;
  publishedAt: string;
}

/* ── Simple inline Markdown parser ── */

function parseMarkdown(md: string): string {
  let result = md;

  // Code blocks (```...```)
  result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
    `<pre><code>${escapeHtml(code.trim())}</code></pre>`,
  );

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Images: ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');

  // Links: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Headers (process line by line later)
  const lines = result.split('\n');
  const output: string[] = [];
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip lines inside pre blocks
    if (line.startsWith('<pre>')) {
      output.push(line);
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      if (inList) { output.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; }
      const level = headerMatch[1].length;
      output.push(`<h${level}>${headerMatch[2]}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^(---|\*\*\*|___)$/.test(line.trim())) {
      if (inList) { output.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; }
      output.push('<hr />');
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');
        output.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      output.push(`<li>${applyInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');
        output.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      output.push(`<li>${applyInline(olMatch[1])}</li>`);
      continue;
    }

    // Close list if needed
    if (inList && line.trim() === '') {
      output.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s*(.*)$/);
    if (bqMatch) {
      output.push(`<blockquote>${applyInline(bqMatch[1])}</blockquote>`);
      continue;
    }

    // Paragraph
    line = line.trim();
    if (line === '') {
      output.push('');
      continue;
    }

    // Apply inline formatting
    output.push(`<p>${applyInline(line)}</p>`);
  }

  if (inList) output.push(listType === 'ul' ? '</ul>' : '</ol>');

  return output.join('\n');
}

function applyInline(text: string): string {
  // Bold **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  return text;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@customElement('zs-blog-post')
export class ZsBlogPost extends LitElement {
  static styles = [landingTokens, landingResetStyles, css`
    :host { display: block; font-family: var(--zl-font-family); }

    .post {
      max-width: var(--zl-max-width);
      margin: 0 auto;
      padding: var(--zl-section-padding-y) var(--zl-section-padding-x);
    }

    /* ── Featured image ── */
    .post-hero {
      width: 100%;
      max-height: 480px;
      object-fit: cover;
      border-radius: var(--zl-radius-lg);
      margin-bottom: 32px;
      display: block;
    }

    /* ── Header ── */
    .post-header {
      margin-bottom: 32px;
    }

    .post-category {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      margin-bottom: 16px;
    }

    .post-title {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 800;
      color: var(--zl-text);
      line-height: 1.15;
      margin-bottom: 16px;
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      color: var(--zl-text-secondary);
      font-size: 14px;
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .post-author-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .post-author-avatar-placeholder {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--zl-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }

    .post-author-name {
      font-weight: 600;
      color: var(--zl-text);
    }

    .post-date {
      color: var(--zl-text-muted);
    }

    .post-dot {
      color: var(--zl-text-muted);
    }

    .post-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .post-tag {
      padding: 3px 10px;
      border-radius: 14px;
      font-size: 12px;
      background: var(--zl-bg-alt);
      color: var(--zl-text-secondary);
      border: 1px solid var(--zl-border);
    }

    /* ── Content body ── */
    .post-content {
      max-width: 720px;
      margin: 0 auto;
      font-size: var(--zl-body-font-size);
      line-height: 1.8;
      color: var(--zl-text);
    }

    .post-content h1,
    .post-content h2,
    .post-content h3,
    .post-content h4,
    .post-content h5,
    .post-content h6 {
      font-family: var(--zl-heading-font-family);
      font-weight: 700;
      color: var(--zl-text);
      margin: 1.8em 0 0.6em;
      line-height: 1.3;
    }

    .post-content h1 { font-size: 2em; }
    .post-content h2 { font-size: 1.6em; }
    .post-content h3 { font-size: 1.3em; }

    .post-content p {
      margin: 0 0 1.2em;
    }

    .post-content a {
      color: var(--zl-primary);
      text-decoration: underline;
    }

    .post-content a:hover {
      color: var(--zl-primary-hover);
    }

    .post-content img {
      max-width: 100%;
      height: auto;
      border-radius: var(--zl-radius);
      margin: 1.5em 0;
    }

    .post-content blockquote {
      border-left: 4px solid var(--zl-primary);
      padding: 12px 20px;
      margin: 1.5em 0;
      background: var(--zl-bg-alt);
      border-radius: 0 var(--zl-radius) var(--zl-radius) 0;
      color: var(--zl-text-secondary);
      font-style: italic;
    }

    .post-content pre {
      background: #1e1e2d;
      color: #e0e0e0;
      padding: 20px;
      border-radius: var(--zl-radius);
      overflow-x: auto;
      margin: 1.5em 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .post-content code {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9em;
    }

    .post-content :not(pre) > code {
      background: var(--zl-bg-alt);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--zl-primary);
    }

    .post-content ul,
    .post-content ol {
      margin: 0 0 1.2em;
      padding-left: 1.5em;
    }

    .post-content ul { list-style: disc; }
    .post-content ol { list-style: decimal; }

    .post-content li {
      margin-bottom: 0.4em;
    }

    .post-content hr {
      border: none;
      border-top: 1px solid var(--zl-border);
      margin: 2em 0;
    }

    /* ── Related posts ── */
    .post-related {
      margin-top: 64px;
      padding-top: 40px;
      border-top: 1px solid var(--zl-border);
    }

    .post-related-title {
      font-family: var(--zl-heading-font-family);
      font-size: var(--zl-subheading-font-size);
      font-weight: 700;
      margin-bottom: 24px;
      color: var(--zl-text);
    }

    .post-related-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    @media (max-width: 900px) {
      .post-related-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .post-related-grid { grid-template-columns: 1fr; }
    }
  `];

  @property({ type: Object }) post?: BlogPostData;
  @property({ type: Object }) config?: BlogPostConfig;
  @property({ type: Array }) relatedPosts?: RelatedPost[];

  connectedCallback() {
    super.connectedCallback();
    this.emitStructuredData();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('post')) {
      this.emitStructuredData();
    }
  }

  private emitStructuredData() {
    const post = this.post;
    if (!post) return;

    const authorName = this._getAuthorName(post.author);

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: document.title || 'Blog',
      },
    };

    this.dispatchEvent(new CustomEvent('landing-seo', {
      detail: {
        title: post.title,
        description: post.excerpt,
        ogImage: post.featuredImage,
        ogType: 'article',
        jsonLd,
      },
      bubbles: true,
      composed: true,
    }));
  }

  private _formatDate(iso: string): string {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  private _getAuthorName(author?: BlogPostData['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    return author.name ?? '';
  }

  private _getAuthorAvatar(author?: BlogPostData['author']): string {
    if (!author || typeof author === 'string') return '';
    return author.avatar ?? '';
  }

  private _renderContent(): TemplateResult | typeof nothing {
    if (!this.post?.content) return nothing;

    const format = this.post.contentFormat ?? this.config?.contentFormat ?? 'html';
    const rendered = format === 'markdown' ? parseMarkdown(this.post.content) : this.post.content;

    return html`<div class="post-content">${unsafeHTML(rendered)}</div>`;
  }

  render() {
    if (!this.post) {
      return html`<div style="text-align:center;padding:60px;color:var(--zl-text-muted);">No se encontro la publicacion.</div>`;
    }

    const showAuthor = this.config?.showAuthor !== false;
    const showDate = this.config?.showDate !== false;
    const showTags = this.config?.showTags !== false;
    const showRelated = this.config?.showRelated !== false && this.relatedPosts && this.relatedPosts.length > 0;

    const authorName = this._getAuthorName(this.post.author);
    const authorAvatar = this._getAuthorAvatar(this.post.author);
    const authorInitial = authorName ? authorName.charAt(0).toUpperCase() : '?';

    return html`
      <article class="post">
        ${this.post.featuredImage
          ? html`<img class="post-hero" src="${this.post.featuredImage}" alt="${this.post.title}" loading="lazy" />`
          : nothing
        }

        <header class="post-header">
          ${this.post.category ? html`<span class="post-category">${this.post.category}</span>` : nothing}
          <h1 class="post-title">${this.post.title}</h1>
          <div class="post-meta">
            ${showAuthor && authorName ? html`
              <div class="post-author">
                ${authorAvatar
                  ? html`<img class="post-author-avatar" src="${authorAvatar}" alt="${authorName}" />`
                  : html`<span class="post-author-avatar-placeholder">${authorInitial}</span>`
                }
                <span class="post-author-name">${authorName}</span>
              </div>
            ` : nothing}
            ${showAuthor && authorName && showDate && this.post.publishedAt ? html`<span class="post-dot">&bull;</span>` : nothing}
            ${showDate && this.post.publishedAt ? html`<span class="post-date">${this._formatDate(this.post.publishedAt)}</span>` : nothing}
          </div>
          ${showTags && this.post.tags && this.post.tags.length > 0 ? html`
            <div class="post-tags">
              ${this.post.tags.map((tag) => html`<span class="post-tag">${tag}</span>`)}
            </div>
          ` : nothing}
        </header>

        ${this._renderContent()}

        ${showRelated ? html`
          <section class="post-related">
            <h2 class="post-related-title">Publicaciones relacionadas</h2>
            <div class="post-related-grid">
              ${this.relatedPosts!.map((p) => html`
                <zs-blog-card
                  .title="${p.title}"
                  .excerpt="${p.excerpt}"
                  .image="${p.featuredImage ?? ''}"
                  .date="${p.publishedAt}"
                  .author="${this._getAuthorName(p.author)}"
                  .authorAvatar="${this._getAuthorAvatar(p.author)}"
                  .category="${p.category}"
                  .slug="${p.slug}"
                ></zs-blog-card>
              `)}
            </div>
          </section>
        ` : nothing}
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-blog-post': ZsBlogPost;
  }
}
