// @zentto/studio — FAQ section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { FaqSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-faq')
export class ZsSectionFaq extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* Accordion variant */
    .faq-accordion {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      border-bottom: 1px solid var(--zl-border);
    }

    .faq-question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 0;
      cursor: pointer;
      font-family: var(--zl-heading-font-family);
      font-size: 16px;
      font-weight: 600;
      color: var(--zl-text);
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      transition: color var(--zl-transition);
    }

    .faq-question:hover { color: var(--zl-primary); }

    .faq-chevron {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      transition: transform var(--zl-transition);
      color: var(--zl-text-secondary);
    }

    .faq-chevron--open { transform: rotate(180deg); }

    .faq-answer-wrapper {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
    }

    .faq-answer-wrapper--open {
      max-height: 500px;
    }

    .faq-answer {
      padding: 0 0 20px;
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
    }

    /* Two-column variant */
    .faq-two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px 48px;
    }

    .faq-two-col .faq-item {
      border-bottom: none;
      padding: 24px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg-alt);
    }

    .faq-two-col .faq-q {
      font-family: var(--zl-heading-font-family);
      font-size: 16px;
      font-weight: 600;
      color: var(--zl-text);
      margin-bottom: 8px;
    }

    .faq-two-col .faq-a {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
    }

    @media (max-width: 768px) {
      .faq-two-col { grid-template-columns: 1fr; }
    }
  `];

  @property({ type: Object }) config!: FaqSectionConfig;
  @state() private openItems: Set<number> = new Set();

  private toggleItem(index: number) {
    const newSet = new Set(this.openItems);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    this.openItems = newSet;
  }

  private renderAccordion() {
    return html`
      <div class="faq-accordion">
        ${this.config.items.map((item, i) => {
          const isOpen = this.openItems.has(i);
          return html`
            <div class="faq-item">
              <button class="faq-question" @click="${() => this.toggleItem(i)}" aria-expanded="${isOpen}">
                <span>${item.question}</span>
                <svg class="faq-chevron ${isOpen ? 'faq-chevron--open' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-answer-wrapper ${isOpen ? 'faq-answer-wrapper--open' : ''}">
                <div class="faq-answer">${item.answer}</div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private renderTwoColumn() {
    return html`
      <div class="faq-two-col">
        ${this.config.items.map(item => html`
          <div class="faq-item">
            <div class="faq-q">${item.question}</div>
            <div class="faq-a">${item.answer}</div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'accordion';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          ${variant === 'two-column' ? this.renderTwoColumn() : this.renderAccordion()}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-faq': ZsSectionFaq; } }
