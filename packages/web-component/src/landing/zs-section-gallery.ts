// @zentto/studio — Gallery section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { GallerySectionConfig } from '@zentto/studio-core';

@customElement('zs-section-gallery')
export class ZsSectionGallery extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* Grid variant */
    .gallery-grid {
      display: grid;
      gap: 16px;
    }

    .gallery-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .gallery-grid--3 { grid-template-columns: repeat(3, 1fr); }
    .gallery-grid--4 { grid-template-columns: repeat(4, 1fr); }

    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: var(--zl-radius);
      cursor: pointer;
      aspect-ratio: 4 / 3;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--zl-transition-slow);
    }

    .gallery-item:hover img { transform: scale(1.05); }

    .gallery-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 16px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: #fff;
      font-size: var(--zl-small-font-size);
      opacity: 0;
      transition: opacity var(--zl-transition);
    }

    .gallery-item:hover .gallery-caption { opacity: 1; }

    /* Masonry variant */
    .gallery-masonry {
      columns: 3;
      column-gap: 16px;
    }

    .gallery-masonry .gallery-item {
      break-inside: avoid;
      margin-bottom: 16px;
      aspect-ratio: auto;
    }

    /* Carousel variant */
    .gallery-carousel {
      position: relative;
      overflow: hidden;
    }

    .gallery-carousel-track {
      display: flex;
      transition: transform var(--zl-transition-slow);
    }

    .gallery-carousel-slide {
      min-width: 100%;
      padding: 0 4px;
      box-sizing: border-box;
    }

    .gallery-carousel-slide img {
      width: 100%;
      border-radius: var(--zl-radius-lg);
      aspect-ratio: 16 / 9;
      object-fit: cover;
      cursor: pointer;
    }

    .gallery-carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--zl-border);
      background: var(--zl-bg);
      color: var(--zl-text);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--zl-transition);
      z-index: 2;
    }

    .gallery-carousel-btn:hover {
      background: var(--zl-bg-alt);
      border-color: var(--zl-primary);
    }

    .gallery-carousel-btn--prev { left: 8px; }
    .gallery-carousel-btn--next { right: 8px; }

    /* Lightbox */
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      cursor: pointer;
    }

    .lightbox img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: var(--zl-radius);
      cursor: default;
    }

    .lightbox-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--zl-transition);
    }

    .lightbox-close:hover { background: rgba(255, 255, 255, 0.3); }

    .lightbox-caption {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: var(--zl-body-font-size);
      text-align: center;
    }

    @media (max-width: 768px) {
      .gallery-grid--3,
      .gallery-grid--4 { grid-template-columns: repeat(2, 1fr); }
      .gallery-masonry { columns: 2; }
    }

    @media (max-width: 480px) {
      .gallery-grid--2,
      .gallery-grid--3,
      .gallery-grid--4 { grid-template-columns: 1fr; }
      .gallery-masonry { columns: 1; }
    }
  `];

  @property({ type: Object }) config!: GallerySectionConfig;
  @state() private lightboxIndex: number | null = null;
  @state() private carouselIndex = 0;

  private openLightbox(index: number) {
    this.lightboxIndex = index;
  }

  private closeLightbox() {
    this.lightboxIndex = null;
  }

  private renderLightbox() {
    if (this.lightboxIndex === null) return nothing;
    const img = this.config.images[this.lightboxIndex];
    if (!img) return nothing;

    return html`
      <div class="lightbox" @click="${this.closeLightbox}">
        <button class="lightbox-close" @click="${this.closeLightbox}" aria-label="Close">&#x2715;</button>
        <img src="${img.src}" alt="${img.alt}" @click="${(e: Event) => e.stopPropagation()}" />
        ${img.caption ? html`<div class="lightbox-caption">${img.caption}</div>` : ''}
      </div>
    `;
  }

  private renderGrid() {
    const cols = this.config.columns ?? 3;
    return html`
      <div class="gallery-grid gallery-grid--${cols}">
        ${this.config.images.map((img, i) => html`
          <div class="gallery-item" @click="${() => this.openLightbox(i)}">
            <img src="${img.src}" alt="${img.alt}" loading="lazy" />
            ${img.caption ? html`<div class="gallery-caption">${img.caption}</div>` : ''}
          </div>
        `)}
      </div>
    `;
  }

  private renderMasonry() {
    return html`
      <div class="gallery-masonry">
        ${this.config.images.map((img, i) => html`
          <div class="gallery-item" @click="${() => this.openLightbox(i)}">
            <img src="${img.src}" alt="${img.alt}" loading="lazy" />
            ${img.caption ? html`<div class="gallery-caption">${img.caption}</div>` : ''}
          </div>
        `)}
      </div>
    `;
  }

  private renderCarousel() {
    const images = this.config.images;
    const idx = this.carouselIndex;
    return html`
      <div class="gallery-carousel">
        <button class="gallery-carousel-btn gallery-carousel-btn--prev"
                @click="${() => this.carouselIndex = (idx - 1 + images.length) % images.length}"
                aria-label="Previous">&#8249;</button>
        <div class="gallery-carousel-track" style="transform:translateX(-${idx * 100}%)">
          ${images.map((img, i) => html`
            <div class="gallery-carousel-slide">
              <img src="${img.src}" alt="${img.alt}" loading="lazy" @click="${() => this.openLightbox(i)}" />
            </div>
          `)}
        </div>
        <button class="gallery-carousel-btn gallery-carousel-btn--next"
                @click="${() => this.carouselIndex = (idx + 1) % images.length}"
                aria-label="Next">&#8250;</button>
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'grid';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline ? html`
            <div class="zl-section-header">
              <h2 class="zl-section-headline">${c.headline}</h2>
            </div>
          ` : ''}
          ${variant === 'masonry' ? this.renderMasonry() :
            variant === 'carousel' ? this.renderCarousel() :
            this.renderGrid()}
        </div>
      </section>
      ${this.renderLightbox()}
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-gallery': ZsSectionGallery; } }
