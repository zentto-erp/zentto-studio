// @zentto/studio — Timeline section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { TimelineSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-timeline')
export class ZsSectionTimeline extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .timeline {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px 0;
    }

    /* Center vertical line */
    .timeline::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--zl-border);
    }

    .timeline--alternating::before,
    .timeline--right::before {
      left: 50%;
      transform: translateX(-50%);
    }

    .timeline--left::before {
      left: 24px;
    }

    /* Timeline item */
    .timeline-item {
      position: relative;
      display: flex;
      align-items: flex-start;
      margin-bottom: 48px;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .timeline-item--visible {
      opacity: 1;
      transform: translateY(0);
    }

    .timeline-item:last-child { margin-bottom: 0; }

    /* Alternating layout */
    .timeline--alternating .timeline-item {
      width: 50%;
      padding-right: 40px;
      justify-content: flex-end;
      margin-left: 0;
    }

    .timeline--alternating .timeline-item--right {
      margin-left: 50%;
      padding-right: 0;
      padding-left: 40px;
      justify-content: flex-start;
    }

    /* Left layout */
    .timeline--left .timeline-item {
      padding-left: 56px;
    }

    /* Right layout */
    .timeline--right .timeline-item {
      width: 50%;
      margin-left: 50%;
      padding-left: 40px;
    }

    /* Node circle on the line */
    .timeline-node {
      position: absolute;
      width: 16px;
      height: 16px;
      background: var(--zl-primary);
      border: 3px solid var(--zl-bg);
      border-radius: 50%;
      box-shadow: 0 0 0 3px var(--zl-primary);
      z-index: 1;
      flex-shrink: 0;
    }

    .timeline--alternating .timeline-node {
      right: -8px;
    }

    .timeline--alternating .timeline-item--right .timeline-node {
      right: auto;
      left: -8px;
    }

    .timeline--left .timeline-node {
      left: 16px;
    }

    .timeline--right .timeline-node {
      left: -8px;
    }

    /* Card content */
    .timeline-card {
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      border-radius: var(--zl-radius-lg);
      padding: 24px;
      box-shadow: var(--zl-shadow-sm);
      transition: box-shadow var(--zl-transition), transform var(--zl-transition);
      max-width: 380px;
    }

    .timeline-card:hover {
      box-shadow: var(--zl-shadow-md);
      transform: translateY(-2px);
    }

    .timeline-icon {
      font-size: 24px;
      margin-bottom: 8px;
      line-height: 1;
    }

    .timeline-date {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      color: var(--zl-primary);
      background: var(--zl-primary-light);
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .timeline-title {
      font-family: var(--zl-heading-font-family);
      font-size: 17px;
      font-weight: 700;
      color: var(--zl-text);
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .timeline-desc {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
      margin: 0;
    }

    /* Responsive: always left layout on mobile */
    @media (max-width: 768px) {
      .timeline::before {
        left: 24px !important;
        transform: none !important;
      }

      .timeline--alternating .timeline-item,
      .timeline--right .timeline-item {
        width: 100% !important;
        margin-left: 0 !important;
        padding-left: 56px !important;
        padding-right: 0 !important;
        justify-content: flex-start !important;
      }

      .timeline .timeline-node {
        left: 16px !important;
        right: auto !important;
      }

      .timeline-card {
        max-width: 100%;
      }
    }
  `];

  @property({ type: Object }) config!: TimelineSectionConfig;
  @state() private visibleItems = new Set<number>();

  private observer?: IntersectionObserver;

  connectedCallback() {
    super.connectedCallback();
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute('data-idx'));
          if (!isNaN(idx)) {
            this.visibleItems = new Set([...this.visibleItems, idx]);
          }
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  updated() {
    this.shadowRoot?.querySelectorAll('.timeline-item:not(.timeline-item--visible)').forEach(el => {
      this.observer?.observe(el);
    });
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'alternating';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}

          <div class="timeline timeline--${variant}">
            ${c.items.map((item, i) => {
              const isRight = variant === 'alternating' ? i % 2 === 1 : variant === 'right';
              const isVisible = this.visibleItems.has(i);
              return html`
                <div class="timeline-item ${isRight ? 'timeline-item--right' : ''} ${isVisible ? 'timeline-item--visible' : ''}"
                     data-idx="${i}">
                  <span class="timeline-node"></span>
                  <div class="timeline-card">
                    ${item.icon ? html`<div class="timeline-icon">${item.icon}</div>` : ''}
                    ${item.date ? html`<span class="timeline-date">${item.date}</span>` : ''}
                    <div class="timeline-title">${item.title}</div>
                    ${item.description ? html`<p class="timeline-desc">${item.description}</p>` : ''}
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-timeline': ZsSectionTimeline; } }
