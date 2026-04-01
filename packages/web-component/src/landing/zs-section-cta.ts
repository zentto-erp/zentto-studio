// @zentto/studio — Call-to-Action section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { CtaSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-cta')
export class ZsSectionCta extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    /* Banner variant */
    .cta-banner {
      background: var(--zl-primary);
      color: #fff;
      padding: 64px var(--zl-section-padding-x);
    }

    .cta-banner .zl-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }

    .cta-banner .cta-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(22px, 3vw, 32px);
      font-weight: 700;
      color: #fff;
    }

    .cta-banner .cta-desc {
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--zl-body-font-size);
      margin-top: 8px;
    }

    .cta-banner .zl-btn--primary {
      background: #fff;
      color: var(--zl-primary);
      border-color: #fff;
      flex-shrink: 0;
    }
    .cta-banner .zl-btn--primary:hover {
      background: rgba(255, 255, 255, 0.9);
      color: var(--zl-primary-hover);
    }

    .cta-banner .zl-btn--secondary {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.5);
    }
    .cta-banner .zl-btn--secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #fff;
    }

    /* Centered variant */
    .cta-centered {
      text-align: center;
      padding: 80px var(--zl-section-padding-x);
      background: var(--zl-bg-alt);
    }

    .cta-centered .cta-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(24px, 3.5vw, 40px);
      font-weight: 700;
      color: var(--zl-text);
      margin-bottom: 16px;
    }

    .cta-centered .cta-desc {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      max-width: 560px;
      margin: 0 auto 32px;
      line-height: var(--zl-line-height);
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .cta-centered .cta-actions { justify-content: center; }

    /* Split variant */
    .cta-split {
      padding: 80px var(--zl-section-padding-x);
    }

    .cta-split .zl-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
      background: var(--zl-primary);
      border-radius: var(--zl-radius-xl);
      padding: 48px 56px;
      color: #fff;
    }

    .cta-split .cta-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(22px, 3vw, 36px);
      font-weight: 700;
      color: #fff;
    }

    .cta-split .cta-desc {
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--zl-body-font-size);
      margin-top: 12px;
      line-height: var(--zl-line-height);
    }

    .cta-split .cta-actions { justify-content: flex-end; }

    .cta-split .zl-btn--primary {
      background: #fff;
      color: var(--zl-primary);
      border-color: #fff;
    }

    @media (max-width: 768px) {
      .cta-banner .zl-container { flex-direction: column; text-align: center; }
      .cta-split .zl-container {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 32px 24px;
      }
      .cta-split .cta-actions { justify-content: center; }
    }
  `];

  @property({ type: Object }) config!: CtaSectionConfig;

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

  private renderActions() {
    const c = this.config;
    return html`
      <div class="cta-actions">
        <a class="zl-btn zl-btn--primary" @click="${() => this.handleCtaClick(c.primaryCta.href)}">${c.primaryCta.label}</a>
        ${c.secondaryCta ? html`
          <a class="zl-btn zl-btn--secondary" @click="${() => this.handleCtaClick(c.secondaryCta!.href)}">${c.secondaryCta.label}</a>
        ` : ''}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'centered';

    if (variant === 'banner') {
      return html`
        <section class="cta-banner" role="region">
          <div class="zl-container">
            <div>
              <div class="cta-headline">${c.headline}</div>
              ${c.description ? html`<div class="cta-desc">${c.description}</div>` : ''}
            </div>
            ${this.renderActions()}
          </div>
        </section>
      `;
    }

    if (variant === 'split') {
      return html`
        <section class="cta-split" role="region">
          <div class="zl-container">
            <div>
              <div class="cta-headline">${c.headline}</div>
              ${c.description ? html`<div class="cta-desc">${c.description}</div>` : ''}
            </div>
            ${this.renderActions()}
          </div>
        </section>
      `;
    }

    // Default: centered
    return html`
      <section class="cta-centered" role="region">
        <div class="zl-container">
          <div class="cta-headline">${c.headline}</div>
          ${c.description ? html`<div class="cta-desc">${c.description}</div>` : ''}
          ${this.renderActions()}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-cta': ZsSectionCta; } }
