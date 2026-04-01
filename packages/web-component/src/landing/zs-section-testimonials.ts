// @zentto/studio — Testimonials section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { TestimonialsSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-testimonials')
export class ZsSectionTestimonials extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* Grid variant */
    .testimonials-grid {
      display: grid;
      gap: 24px;
    }

    .testimonials-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .testimonials-grid--3 { grid-template-columns: repeat(3, 1fr); }

    .testimonial-card {
      padding: 32px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      transition: all var(--zl-transition);
      display: flex;
      flex-direction: column;
    }

    .testimonial-card:hover {
      box-shadow: var(--zl-shadow-md);
      border-color: var(--zl-primary-light);
    }

    .testimonial-stars {
      display: flex;
      gap: 2px;
      margin-bottom: 16px;
    }

    .testimonial-star {
      color: #f5a623;
      font-size: 16px;
    }

    .testimonial-star--empty { color: var(--zl-border); }

    .testimonial-quote {
      position: relative;
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      line-height: var(--zl-line-height);
      flex: 1;
      margin-bottom: 20px;
      font-style: italic;
      padding-left: 1.5rem;
    }

    .testimonial-quote::before {
      content: '\\201C';
      position: absolute;
      left: 0;
      top: -0.25em;
      font-size: 3rem;
      color: var(--zl-primary);
      line-height: 1;
    }
    .testimonial-quote::after { content: '\\201D'; }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .testimonial-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--zl-bg-alt);
      flex-shrink: 0;
    }

    .testimonial-avatar-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }

    .testimonial-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--zl-text);
    }

    .testimonial-title {
      font-size: 13px;
      color: var(--zl-text-secondary);
    }

    /* Carousel variant */
    .testimonials-carousel {
      position: relative;
      overflow: hidden;
    }

    .testimonials-carousel-track {
      display: flex;
      transition: transform var(--zl-transition-slow);
    }

    .testimonials-carousel-slide {
      min-width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
    }

    .testimonials-carousel-slide .testimonial-card {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
      border: none;
      background: transparent;
    }

    .testimonials-carousel-slide .testimonial-author {
      justify-content: center;
    }

    .testimonials-carousel-slide .testimonial-stars {
      justify-content: center;
    }

    .carousel-btn {
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

    .carousel-btn:hover {
      background: var(--zl-bg-alt);
      border-color: var(--zl-primary);
      color: var(--zl-primary);
    }

    .carousel-btn--prev { left: 0; }
    .carousel-btn--next { right: 0; }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
    }

    .carousel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--zl-border);
      border: none;
      cursor: pointer;
      transition: all var(--zl-transition);
      padding: 0;
    }

    .carousel-dot--active {
      background: var(--zl-primary);
      transform: scale(1.3);
    }

    /* Masonry variant */
    .testimonials-masonry {
      columns: 3;
      column-gap: 24px;
    }

    .testimonials-masonry .testimonial-card {
      break-inside: avoid;
      margin-bottom: 24px;
    }

    /* Scroll-snap carousel variant */
    .testimonials--scroll-carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: var(--zl-space-4, 16px);
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .testimonials--scroll-carousel::-webkit-scrollbar { display: none; }
    .testimonials--scroll-carousel .testimonial-card {
      flex: 0 0 min(90vw, 400px);
      scroll-snap-align: start;
    }

    @media (max-width: 768px) {
      .testimonials-grid--2,
      .testimonials-grid--3 {
        grid-template-columns: 1fr;
      }
      .testimonials-masonry { columns: 1; }
      .testimonials-carousel-slide { padding: 0 16px; }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .testimonials-masonry { columns: 2; }
    }
  `];

  @property({ type: Object }) config!: TestimonialsSectionConfig;
  @state() private carouselIndex = 0;

  private renderStars(rating?: number) {
    if (!rating) return nothing;
    const full = Math.round(rating);
    return html`
      <div class="testimonial-stars">
        ${[1, 2, 3, 4, 5].map(i => html`
          <span class="testimonial-star ${i <= full ? '' : 'testimonial-star--empty'}">&#9733;</span>
        `)}
      </div>
    `;
  }

  private renderAvatar(name: string, avatar?: string) {
    if (avatar) {
      return html`<img class="testimonial-avatar" src="${avatar}" alt="${name}" loading="lazy" />`;
    }
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return html`<div class="testimonial-avatar-placeholder">${initials}</div>`;
  }

  private renderCard(item: TestimonialsSectionConfig['items'][0]) {
    return html`
      <div class="testimonial-card">
        ${this.renderStars(item.rating)}
        <div class="testimonial-quote">${item.quote}</div>
        <div class="testimonial-author">
          ${this.renderAvatar(item.name, item.avatar)}
          <div>
            <div class="testimonial-name">${item.name}</div>
            <div class="testimonial-title">
              ${[item.title, item.company].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderGrid() {
    const items = this.config.items;
    const cols = items.length <= 2 ? 2 : 3;
    return html`
      <div class="testimonials-grid testimonials-grid--${cols}">
        ${items.map(item => this.renderCard(item))}
      </div>
    `;
  }

  private renderCarousel() {
    const items = this.config.items;
    const idx = this.carouselIndex;
    return html`
      <div class="testimonials-carousel">
        <button class="carousel-btn carousel-btn--prev"
                @click="${() => this.carouselIndex = (idx - 1 + items.length) % items.length}"
                aria-label="Previous">&#8249;</button>
        <div class="testimonials-carousel-track" style="transform:translateX(-${idx * 100}%)">
          ${items.map(item => html`
            <div class="testimonials-carousel-slide">${this.renderCard(item)}</div>
          `)}
        </div>
        <button class="carousel-btn carousel-btn--next"
                @click="${() => this.carouselIndex = (idx + 1) % items.length}"
                aria-label="Next">&#8250;</button>
        <div class="carousel-dots">
          ${items.map((_, i) => html`
            <button class="carousel-dot ${i === idx ? 'carousel-dot--active' : ''}"
                    @click="${() => this.carouselIndex = i}"
                    aria-label="Go to slide ${i + 1}"></button>
          `)}
        </div>
      </div>
    `;
  }

  private renderMasonry() {
    return html`
      <div class="testimonials-masonry">
        ${this.config.items.map(item => this.renderCard(item))}
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
          ${variant === 'carousel' ? this.renderCarousel() :
            variant === 'masonry' ? this.renderMasonry() :
            this.renderGrid()}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-testimonials': ZsSectionTestimonials; } }
