// @zentto/studio — Pricing section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { PricingSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-pricing')
export class ZsSectionPricing extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    .pricing-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 40px;
    }

    .pricing-toggle-label {
      font-size: var(--zl-small-font-size);
      font-weight: 500;
      color: var(--zl-text-secondary);
      cursor: pointer;
      transition: color var(--zl-transition);
    }

    .pricing-toggle-label--active {
      color: var(--zl-text);
      font-weight: 600;
    }

    .pricing-toggle-switch {
      position: relative;
      width: 48px;
      height: 26px;
      background: var(--zl-border);
      border-radius: 13px;
      cursor: pointer;
      transition: background var(--zl-transition);
    }

    .pricing-toggle-switch--active { background: var(--zl-primary); }

    .pricing-toggle-switch::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: transform var(--zl-transition);
      box-shadow: var(--zl-shadow-sm);
    }

    .pricing-toggle-switch--active::after { transform: translateX(22px); }

    .pricing-grid {
      display: grid;
      gap: 24px;
      align-items: stretch;
    }

    .pricing-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .pricing-grid--3 { grid-template-columns: repeat(3, 1fr); }

    .pricing-card {
      display: flex;
      flex-direction: column;
      padding: 36px 32px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      transition: all var(--zl-transition);
      position: relative;
    }

    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--zl-shadow-lg);
    }

    .pricing-card--highlighted {
      border-color: var(--zl-primary);
      box-shadow: var(--zl-shadow-lg);
      transform: scale(1.05);
    }

    .pricing-card--highlighted:hover {
      transform: scale(1.05) translateY(-4px);
      box-shadow: var(--zl-shadow-xl);
    }

    .pricing-badge {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--zl-primary);
      color: #fff;
      padding: 4px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .pricing-name {
      font-family: var(--zl-heading-font-family);
      font-size: 20px;
      font-weight: 700;
      color: var(--zl-text);
      margin-bottom: 8px;
    }

    .pricing-desc {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      margin-bottom: 20px;
      line-height: var(--zl-line-height);
    }

    .pricing-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 24px;
    }

    .pricing-amount {
      font-family: var(--zl-heading-font-family);
      font-size: 40px;
      font-weight: 800;
      color: var(--zl-text);
      line-height: 1;
    }

    .pricing-period {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
    }

    .pricing-features {
      flex: 1;
      margin-bottom: 28px;
    }

    .pricing-feature {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      font-size: var(--zl-small-font-size);
      color: var(--zl-text);
      line-height: var(--zl-line-height);
    }

    .pricing-feature-check {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      border-radius: 50%;
      font-size: 12px;
      font-weight: 700;
    }

    .pricing-cta {
      width: 100%;
      text-align: center;
    }

    .pricing-card--highlighted .zl-btn--secondary {
      background: var(--zl-primary);
      color: #fff;
      border-color: var(--zl-primary);
    }

    .pricing-card--highlighted .zl-btn--secondary:hover {
      background: var(--zl-primary-hover);
      border-color: var(--zl-primary-hover);
    }

    @media (max-width: 768px) {
      .pricing-grid--2,
      .pricing-grid--3 {
        grid-template-columns: 1fr;
        max-width: 400px;
        margin: 0 auto;
      }
      .pricing-card--highlighted { transform: none; }
      .pricing-card--highlighted:hover { transform: translateY(-4px); }
    }
  `];

  @property({ type: Object }) config!: PricingSectionConfig;
  @state() private annual = false;

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

    const cols = Math.min(c.plans.length, 3) as 2 | 3;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}

          ${c.billingToggle ? html`
            <div class="pricing-toggle">
              <span class="pricing-toggle-label ${!this.annual ? 'pricing-toggle-label--active' : ''}"
                    @click="${() => this.annual = false}">Monthly</span>
              <span class="pricing-toggle-switch ${this.annual ? 'pricing-toggle-switch--active' : ''}"
                    @click="${() => this.annual = !this.annual}"></span>
              <span class="pricing-toggle-label ${this.annual ? 'pricing-toggle-label--active' : ''}"
                    @click="${() => this.annual = true}">Annual</span>
            </div>
          ` : ''}

          <div class="pricing-grid pricing-grid--${cols}">
            ${c.plans.map(plan => html`
              <div class="pricing-card ${plan.highlighted ? 'pricing-card--highlighted' : ''}">
                ${plan.badge ? html`<span class="pricing-badge">${plan.badge}</span>` : ''}
                <div class="pricing-name">${plan.name}</div>
                ${plan.description ? html`<div class="pricing-desc">${plan.description}</div>` : ''}
                <div class="pricing-price">
                  <span class="pricing-amount">${plan.price}</span>
                  ${plan.period ? html`<span class="pricing-period">${plan.period}</span>` : ''}
                </div>
                <div class="pricing-features">
                  ${plan.features.map(f => html`
                    <div class="pricing-feature">
                      <span class="pricing-feature-check">&#x2713;</span>
                      <span>${f}</span>
                    </div>
                  `)}
                </div>
                <a class="zl-btn ${plan.highlighted ? 'zl-btn--primary' : 'zl-btn--secondary'} pricing-cta"
                   @click="${() => this.handleCtaClick(plan.cta.href)}">${plan.cta.label}</a>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-pricing': ZsSectionPricing; } }
