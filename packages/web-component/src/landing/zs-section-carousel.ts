// @zentto/studio — Carousel section component (full-width image/content slider)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { CarouselSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-carousel')
export class ZsSectionCarousel extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    .carousel {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .carousel-track {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .carousel-track::-webkit-scrollbar { display: none; }

    .carousel-slide {
      flex: 0 0 100%;
      scroll-snap-align: start;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-slide-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      z-index: 0;
    }

    .carousel-slide-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1;
    }

    .carousel-slide-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 720px;
      padding: 48px 24px;
      color: #fff;
    }

    .carousel-slide--no-image .carousel-slide-content {
      color: var(--zl-text);
    }

    .carousel-title {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(24px, 4vw, 48px);
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .carousel-description {
      font-size: var(--zl-body-font-size);
      line-height: var(--zl-line-height);
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .carousel-cta {
      display: inline-block;
    }

    /* Arrows */
    .carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.5);
      background: rgba(0, 0, 0, 0.35);
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--zl-transition);
      backdrop-filter: blur(4px);
    }

    .carousel-arrow:hover {
      background: rgba(0, 0, 0, 0.6);
      border-color: #fff;
    }

    .carousel-arrow--prev { left: 16px; }
    .carousel-arrow--next { right: 16px; }

    /* Dots */
    .carousel-dots {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      display: flex;
      gap: 8px;
    }

    .carousel-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.7);
      background: transparent;
      cursor: pointer;
      padding: 0;
      transition: all var(--zl-transition);
    }

    .carousel-dot--active {
      background: #fff;
      border-color: #fff;
    }

    @media (max-width: 768px) {
      .carousel-arrow { width: 36px; height: 36px; font-size: 16px; }
      .carousel-arrow--prev { left: 8px; }
      .carousel-arrow--next { right: 8px; }
      .carousel-slide-content { padding: 32px 16px; }
    }
  `];

  @property({ type: Object }) config!: CarouselSectionConfig;
  @state() private currentIndex = 0;
  private autoPlayTimer?: ReturnType<typeof setInterval>;
  private isPaused = false;

  connectedCallback() {
    super.connectedCallback();
    this.startAutoPlay();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoPlay();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config')) {
      this.stopAutoPlay();
      this.currentIndex = 0;
      this.startAutoPlay();
    }
  }

  private startAutoPlay() {
    if (!this.config?.autoPlay) return;
    const interval = this.config.interval ?? 5000;
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused) this.goToNext();
    }, interval);
  }

  private stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = undefined;
    }
  }

  private goTo(index: number) {
    const items = this.config?.items ?? [];
    if (!items.length) return;
    this.currentIndex = ((index % items.length) + items.length) % items.length;
    const track = this.shadowRoot?.querySelector('.carousel-track') as HTMLElement | null;
    if (track) {
      track.scrollTo({ left: this.currentIndex * track.offsetWidth, behavior: 'smooth' });
    }
  }

  private goToPrev() { this.goTo(this.currentIndex - 1); }
  private goToNext() { this.goTo(this.currentIndex + 1); }

  private onScroll() {
    const track = this.shadowRoot?.querySelector('.carousel-track') as HTMLElement | null;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.offsetWidth);
    if (idx !== this.currentIndex) this.currentIndex = idx;
  }

  private onMouseEnter() { this.isPaused = true; }
  private onMouseLeave() { this.isPaused = false; }

  private handleCtaClick(href: string) {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.dispatchEvent(new CustomEvent('landing-navigate', {
      detail: { segment: href.replace(/^\//, '') },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const c = this.config;
    if (!c || !c.items?.length) return nothing;

    const height = c.height ?? '60vh';
    const showArrows = c.showArrows !== false;
    const showDots = c.showDots !== false;

    return html`
      <section class="carousel" role="region" aria-label="Carousel"
        @mouseenter="${this.onMouseEnter}"
        @mouseleave="${this.onMouseLeave}"
      >
        <div class="carousel-track" style="height:${height}" @scroll="${this.onScroll}">
          ${c.items.map((item, i) => html`
            <div class="carousel-slide ${!item.image ? 'carousel-slide--no-image' : ''}" style="height:${height}">
              ${item.image ? html`
                <div class="carousel-slide-bg" style="background-image:url('${item.image}')"></div>
                <div class="carousel-slide-overlay"></div>
              ` : ''}
              <div class="carousel-slide-content">
                ${item.title ? html`<div class="carousel-title">${item.title}</div>` : ''}
                ${item.description ? html`<div class="carousel-description">${item.description}</div>` : ''}
                ${item.cta ? html`
                  <a class="zl-btn zl-btn--primary carousel-cta"
                     @click="${() => this.handleCtaClick(item.cta!.href)}"
                  >${item.cta.label}</a>
                ` : ''}
              </div>
            </div>
          `)}
        </div>

        ${showArrows && c.items.length > 1 ? html`
          <button class="carousel-arrow carousel-arrow--prev" @click="${this.goToPrev}" aria-label="Previous">&#8249;</button>
          <button class="carousel-arrow carousel-arrow--next" @click="${this.goToNext}" aria-label="Next">&#8250;</button>
        ` : ''}

        ${showDots && c.items.length > 1 ? html`
          <div class="carousel-dots">
            ${c.items.map((_, i) => html`
              <button class="carousel-dot ${i === this.currentIndex ? 'carousel-dot--active' : ''}"
                @click="${() => this.goTo(i)}"
                aria-label="Slide ${i + 1}"
              ></button>
            `)}
          </div>
        ` : ''}
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-carousel': ZsSectionCarousel; } }
