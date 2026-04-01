// @zentto/studio — Logos section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { LogosSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-logos')
export class ZsSectionLogos extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .logos-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 32px 48px;
    }

    .logo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--zl-transition);
    }

    .logo-item img {
      max-height: 40px;
      max-width: 140px;
      object-fit: contain;
      transition: filter var(--zl-transition), opacity var(--zl-transition);
    }

    /* Grayscale mode */
    :host([grayscale]) .logo-item img {
      filter: grayscale(100%);
      opacity: 0.6;
    }

    :host([grayscale]) .logo-item:hover img {
      filter: grayscale(0%);
      opacity: 1;
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    /* Auto-scroll animation */
    .logos-scroll-container {
      overflow: hidden;
      position: relative;
    }

    .logos-scroll-track {
      display: flex;
      align-items: center;
      gap: 48px;
      animation: logos-scroll 30s linear infinite;
      width: max-content;
    }

    .logos-scroll-track:hover { animation-play-state: paused; }

    @keyframes logos-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @media (max-width: 768px) {
      .logos-strip { gap: 24px 32px; }
      .logo-item img { max-height: 32px; max-width: 100px; }
    }
  `];

  @property({ type: Object }) config!: LogosSectionConfig;
  @property({ type: Boolean, reflect: true }) grayscale = false;
  @property({ type: Boolean }) autoScroll = false;

  updated(changed: Map<string, unknown>) {
    if (changed.has('config') && this.config?.grayscale !== undefined) {
      this.grayscale = this.config.grayscale;
    }
  }

  private renderLogo(logo: LogosSectionConfig['logos'][0]) {
    const img = html`<img src="${logo.src}" alt="${logo.alt}" loading="lazy" />`;
    if (logo.url) {
      return html`
        <a class="logo-link" href="${logo.url}" target="_blank" rel="noopener noreferrer">
          ${img}
        </a>
      `;
    }
    return img;
  }

  private renderStrip() {
    return html`
      <div class="logos-strip">
        ${this.config.logos.map(logo => html`
          <div class="logo-item">${this.renderLogo(logo)}</div>
        `)}
      </div>
    `;
  }

  private renderScrolling() {
    // Duplicate logos for seamless scrolling
    const logos = this.config.logos;
    return html`
      <div class="logos-scroll-container">
        <div class="logos-scroll-track">
          ${logos.map(logo => html`<div class="logo-item">${this.renderLogo(logo)}</div>`)}
          ${logos.map(logo => html`<div class="logo-item">${this.renderLogo(logo)}</div>`)}
        </div>
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline ? html`
            <div class="zl-section-header">
              <h2 class="zl-section-headline">${c.headline}</h2>
            </div>
          ` : ''}
          ${this.autoScroll ? this.renderScrolling() : this.renderStrip()}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-logos': ZsSectionLogos; } }
