// @zentto/studio — Stats section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { StatsSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-stats')
export class ZsSectionStats extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
      text-align: center;
    }

    .stat-item {
      padding: 24px 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-primary-light);
      color: var(--zl-primary);
    }

    .stat-value {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(28px, 4vw, 48px);
      font-weight: 800;
      color: var(--zl-text);
      line-height: 1;
      margin-bottom: 8px;
    }

    .stat-suffix {
      color: var(--zl-primary);
    }

    .stat-label {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
    }

    /* Dark background support */
    :host([dark]) .stat-value,
    :host([dark]) .stat-label { color: #fff; }
    :host([dark]) .stat-label { color: rgba(255, 255, 255, 0.75); }
    :host([dark]) .stat-icon {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `];

  @property({ type: Object }) config!: StatsSectionConfig;
  @state() private visible = false;
  @state() private animatedValues: number[] = [];

  private observer?: IntersectionObserver;

  connectedCallback() {
    super.connectedCallback();
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.visible) {
        this.visible = true;
        this.animateCounters();
        this.observer?.disconnect();
      }
    }, { threshold: 0.3 });
  }

  firstUpdated() {
    const section = this.renderRoot.querySelector('.zl-section');
    if (section && this.observer) {
      this.observer.observe(section);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  private animateCounters() {
    const items = this.config?.items ?? [];
    this.animatedValues = items.map(() => 0);

    const targets = items.map(item => {
      const num = parseFloat(item.value.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    });

    const duration = 1500;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);

      this.animatedValues = targets.map(t => Math.round(t * ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  private renderIcon(icon: string) {
    if (icon.startsWith('<')) return unsafeHTML(icon);
    return icon;
  }

  private getDisplayValue(item: StatsSectionConfig['items'][0], index: number): string {
    if (!this.visible) return '0';

    const num = parseFloat(item.value.replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return item.value; // Non-numeric, just show as-is

    // Preserve prefix characters (e.g. '$')
    const prefix = item.value.match(/^[^\d.-]*/)?.[0] ?? '';
    return `${prefix}${this.animatedValues[index] ?? 0}`;
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
          <div class="stats-grid">
            ${c.items.map((item, i) => html`
              <div class="stat-item">
                ${item.icon ? html`<div class="stat-icon">${this.renderIcon(item.icon)}</div>` : ''}
                <div class="stat-value">
                  ${this.getDisplayValue(item, i)}${item.suffix ? html`<span class="stat-suffix">${item.suffix}</span>` : ''}
                </div>
                <div class="stat-label">${item.label}</div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-stats': ZsSectionStats; } }
