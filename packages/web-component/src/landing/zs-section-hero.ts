// @zentto/studio — Hero section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { HeroSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-hero')
export class ZsSectionHero extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    .hero {
      position: relative;
      display: flex;
      align-items: center;
      min-height: var(--hero-min-height, 80vh);
      padding: var(--zl-section-padding-y) var(--zl-section-padding-x);
      overflow: hidden;
    }

    .hero--center { justify-content: center; text-align: center; }
    .hero--left { text-align: left; }
    .hero--right { text-align: right; }

    .hero-bg-image {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      z-index: 0;
    }

    .hero-bg-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(to top,
        rgba(0,0,0,0.85) 0%,
        rgba(0,0,0,0.4) 50%,
        rgba(0,0,0,0.1) 100%);
    }

    .hero-bg-video {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .hero-bg-video video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-container {
      position: relative;
      z-index: 2;
      max-width: var(--zl-max-width);
      margin: 0 auto;
      width: 100%;
    }

    /* Split layout */
    .hero-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    /* Grid stacking for image backgrounds (modern approach) */
    .hero--grid-stack {
      display: grid;
    }
    .hero--grid-stack > * {
      grid-area: 1 / -1;
    }

    .hero-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 800;
      line-height: var(--zl-heading-line-height);
      color: var(--zl-text);
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .hero--has-bg .hero-headline,
    .hero--has-bg .hero-subheadline,
    .hero--has-bg .hero-description { color: #fff; }

    .hero-subheadline {
      font-size: var(--zl-subheading-font-size);
      font-weight: 500;
      color: var(--zl-text-secondary);
      margin-bottom: 12px;
      line-height: var(--zl-line-height);
    }

    .hero-description {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      max-width: 600px;
      line-height: var(--zl-line-height);
      margin-bottom: 32px;
    }

    .hero--center .hero-description { margin-left: auto; margin-right: auto; }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .hero--center .hero-actions { justify-content: center; }
    .hero--right .hero-actions { justify-content: flex-end; }

    .hero-image {
      width: 100%;
      max-width: 560px;
      border-radius: var(--zl-radius-lg);
      box-shadow: var(--zl-shadow-xl);
    }

    .hero--center .hero-image {
      margin: 40px auto 0;
      max-width: 720px;
    }

    @media (max-width: 768px) {
      .hero { min-height: 60vh; }
      .hero-split {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .hero-actions { justify-content: center; }
      .hero-description { margin-left: auto; margin-right: auto; }
      .hero-image { margin: 32px auto 0; }
    }
  `];

  @property({ type: Object }) config!: HeroSectionConfig;
  @property() variant: string = 'centered';
  @property() backgroundCss: string = '';
  @property() overlayCss: string = '';

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
    if (!c) return nothing;

    const isSplit = this.variant === 'split' && c.image;
    const hasBg = !!this.backgroundCss || !!c.video;
    const align = c.alignment ?? (isSplit ? 'left' : 'center');

    const content = html`
      <div class="hero-content">
        ${c.subheadline ? html`<div class="hero-subheadline">${c.subheadline}</div>` : ''}
        <h1 class="hero-headline">${c.headline}</h1>
        ${c.description ? html`<p class="hero-description">${c.description}</p>` : ''}
        <div class="hero-actions">
          ${c.primaryCta ? html`
            <a class="zl-btn zl-btn--primary" @click="${() => this.handleCtaClick(c.primaryCta!.href)}">${c.primaryCta.label}</a>
          ` : ''}
          ${c.secondaryCta ? html`
            <a class="zl-btn zl-btn--secondary" @click="${() => this.handleCtaClick(c.secondaryCta!.href)}">${c.secondaryCta.label}</a>
          ` : ''}
        </div>
        ${!isSplit && c.image ? html`<img class="hero-image" src="${c.image}" alt="" loading="lazy" />` : ''}
      </div>
    `;

    return html`
      <section class="hero hero--${align} ${hasBg ? 'hero--has-bg' : ''}"
               style="${c.minHeight ? `--hero-min-height:${c.minHeight}` : ''}"
               role="banner">
        ${this.backgroundCss ? html`<div class="hero-bg-image" style="background-image:url(${this.backgroundCss})"></div>` : ''}
        ${c.video ? html`<div class="hero-bg-video"><video src="${c.video}" autoplay muted loop playsinline></video></div>` : ''}
        ${this.overlayCss ? html`<div class="hero-bg-overlay" style="background:${this.overlayCss}"></div>` : ''}

        <div class="hero-container">
          ${isSplit ? html`
            <div class="hero-split">
              ${content}
              <div><img class="hero-image" src="${c.image}" alt="" loading="lazy" /></div>
            </div>
          ` : content}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-hero': ZsSectionHero; } }
