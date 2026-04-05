// @zentto/studio — Countdown section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { CountdownSectionConfig } from '@zentto/studio-core';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

@customElement('zs-section-countdown')
export class ZsSectionCountdown extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .countdown-content {
      text-align: center;
    }

    .countdown-subtitle {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
      margin-bottom: 32px;
    }

    /* Variant: boxes */
    .countdown-boxes {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .countdown-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--zl-surface);
      border-radius: var(--zl-radius-lg);
      padding: 24px 28px;
      min-width: 100px;
      box-shadow: var(--zl-shadow-md);
    }

    .countdown-box-value {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 800;
      color: var(--zl-primary);
      line-height: 1;
      margin-bottom: 8px;
    }

    .countdown-box-label {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    /* Variant: inline */
    .countdown-inline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(24px, 4vw, 48px);
      font-weight: 700;
      color: var(--zl-text);
      letter-spacing: 0.02em;
    }

    .countdown-inline-sep {
      color: var(--zl-text-secondary);
      margin: 0 4px;
    }

    /* Variant: minimal */
    .countdown-minimal {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(28px, 5vw, 64px);
      font-weight: 800;
      color: var(--zl-text);
      letter-spacing: 0.04em;
    }

    .countdown-minimal-sep {
      color: var(--zl-text-secondary);
      margin: 0 2px;
    }

    /* Expired */
    .countdown-expired {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(20px, 3vw, 36px);
      font-weight: 700;
      color: var(--zl-primary);
    }

    /* Dark support */
    :host([dark]) .countdown-box {
      background: rgba(255, 255, 255, 0.1);
    }
    :host([dark]) .countdown-box-value { color: #fff; }
    :host([dark]) .countdown-inline,
    :host([dark]) .countdown-minimal { color: #fff; }

    @media (max-width: 480px) {
      .countdown-boxes { gap: 12px; }
      .countdown-box {
        min-width: 72px;
        padding: 16px 18px;
      }
    }
  `];

  @property({ type: Object }) config!: CountdownSectionConfig;
  @state() private timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

  private timerId: ReturnType<typeof setInterval> | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.tick();
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private tick() {
    const target = new Date(this.config?.targetDate ?? 0).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      if (this.timerId != null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.timeLeft = { days, hours, minutes, seconds, expired: false };
  }

  private pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  private renderBoxes() {
    const c = this.config;
    const t = this.timeLeft;
    const showDays = c.showDays !== false;
    const showHours = c.showHours !== false;
    const showMinutes = c.showMinutes !== false;
    const showSeconds = c.showSeconds !== false;

    return html`
      <div class="countdown-boxes">
        ${showDays ? html`
          <div class="countdown-box">
            <span class="countdown-box-value">${t.days}</span>
            <span class="countdown-box-label">Days</span>
          </div>
        ` : ''}
        ${showHours ? html`
          <div class="countdown-box">
            <span class="countdown-box-value">${this.pad(t.hours)}</span>
            <span class="countdown-box-label">Hours</span>
          </div>
        ` : ''}
        ${showMinutes ? html`
          <div class="countdown-box">
            <span class="countdown-box-value">${this.pad(t.minutes)}</span>
            <span class="countdown-box-label">Minutes</span>
          </div>
        ` : ''}
        ${showSeconds ? html`
          <div class="countdown-box">
            <span class="countdown-box-value">${this.pad(t.seconds)}</span>
            <span class="countdown-box-label">Seconds</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderInline() {
    const c = this.config;
    const t = this.timeLeft;
    const parts: string[] = [];
    if (c.showDays !== false) parts.push(`${t.days}d`);
    if (c.showHours !== false) parts.push(`${this.pad(t.hours)}h`);
    if (c.showMinutes !== false) parts.push(`${this.pad(t.minutes)}m`);
    if (c.showSeconds !== false) parts.push(`${this.pad(t.seconds)}s`);

    return html`<div class="countdown-inline">${parts.join(' ')}</div>`;
  }

  private renderMinimal() {
    const c = this.config;
    const t = this.timeLeft;
    const parts: string[] = [];
    if (c.showDays !== false) parts.push(String(t.days));
    if (c.showHours !== false) parts.push(this.pad(t.hours));
    if (c.showMinutes !== false) parts.push(this.pad(t.minutes));
    if (c.showSeconds !== false) parts.push(this.pad(t.seconds));

    return html`<div class="countdown-minimal">${parts.join(':')}</div>`;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'boxes';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          <div class="countdown-content">
            ${c.headline ? html`
              <div class="zl-section-header">
                <h2 class="zl-section-headline">${c.headline}</h2>
              </div>
            ` : ''}
            ${c.subtitle ? html`<p class="countdown-subtitle">${c.subtitle}</p>` : ''}
            ${this.timeLeft.expired
              ? html`<div class="countdown-expired">${c.expiredMessage ?? 'Event started!'}</div>`
              : variant === 'inline' ? this.renderInline()
              : variant === 'minimal' ? this.renderMinimal()
              : this.renderBoxes()
            }
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-countdown': ZsSectionCountdown; } }
