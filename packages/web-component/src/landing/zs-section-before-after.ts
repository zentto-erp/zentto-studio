// @zentto/studio — Before/After image comparison section with draggable slider

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { BeforeAfterSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-before-after')
export class ZsSectionBeforeAfter extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .ba-header {
      text-align: center;
      max-width: var(--zl-max-width, 1200px);
      margin: 0 auto 32px;
      padding: 0 var(--zl-section-padding-x, 24px);
    }

    .ba-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(24px, 4vw, 42px);
      font-weight: 700;
      color: var(--zl-text);
      margin: 0 0 12px;
      line-height: 1.2;
    }

    .ba-subtitle {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-muted);
      line-height: var(--zl-line-height);
      margin: 0;
    }

    .ba-container {
      position: relative;
      max-width: var(--zl-max-width, 1200px);
      margin: 0 auto;
      padding: 0 var(--zl-section-padding-x, 24px);
      user-select: none;
      -webkit-user-select: none;
    }

    .ba-wrapper {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      cursor: ew-resize;
    }

    .ba-image {
      display: block;
      width: 100%;
      height: auto;
    }

    .ba-after {
      position: relative;
    }

    .ba-before {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      overflow: hidden;
    }

    .ba-before .ba-image {
      display: block;
      height: 100%;
      width: auto;
      max-width: none;
      object-fit: cover;
    }

    .ba-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #fff;
      cursor: ew-resize;
      z-index: 3;
      transform: translateX(-50%);
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
    }

    .ba-handle-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .ba-handle-arrows {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #333;
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
    }

    .ba-label {
      position: absolute;
      top: 16px;
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      border-radius: 4px;
      pointer-events: none;
      z-index: 2;
      backdrop-filter: blur(4px);
      letter-spacing: 0.03em;
    }

    .ba-label--before {
      left: 16px;
    }

    .ba-label--after {
      right: 16px;
    }

    @media (max-width: 768px) {
      .ba-handle-circle { width: 32px; height: 32px; }
      .ba-label { font-size: 11px; padding: 4px 10px; top: 10px; }
      .ba-label--before { left: 10px; }
      .ba-label--after { right: 10px; }
    }
  `];

  @property({ type: Object }) config!: BeforeAfterSectionConfig;
  @state() private position = 50;
  private dragging = false;
  private wrapperRef: HTMLElement | null = null;

  private boundMouseMove = this.onMouseMove.bind(this);
  private boundMouseUp = this.onMouseUp.bind(this);
  private boundTouchMove = this.onTouchMove.bind(this);
  private boundTouchEnd = this.onTouchEnd.bind(this);

  connectedCallback() {
    super.connectedCallback();
    this.position = this.config?.initialPosition ?? 50;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config') && this.config) {
      this.position = this.config.initialPosition ?? 50;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListeners();
  }

  private getWrapper(): HTMLElement | null {
    if (!this.wrapperRef) {
      this.wrapperRef = this.shadowRoot?.querySelector('.ba-wrapper') as HTMLElement | null;
    }
    return this.wrapperRef;
  }

  private updatePosition(clientX: number) {
    const wrapper = this.getWrapper();
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    this.position = pct;
  }

  private onMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.dragging = true;
    this.updatePosition(e.clientX);
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.dragging) return;
    e.preventDefault();
    this.updatePosition(e.clientX);
  }

  private onMouseUp() {
    this.dragging = false;
    this.removeGlobalListeners();
  }

  private onTouchStart(e: TouchEvent) {
    e.preventDefault();
    this.dragging = true;
    this.updatePosition(e.touches[0].clientX);
    document.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    document.addEventListener('touchend', this.boundTouchEnd);
  }

  private onTouchMove(e: TouchEvent) {
    if (!this.dragging) return;
    e.preventDefault();
    this.updatePosition(e.touches[0].clientX);
  }

  private onTouchEnd() {
    this.dragging = false;
    this.removeGlobalListeners();
  }

  private removeGlobalListeners() {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    document.removeEventListener('touchmove', this.boundTouchMove);
    document.removeEventListener('touchend', this.boundTouchEnd);
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const beforeLabel = c.beforeLabel ?? 'Before';
    const afterLabel = c.afterLabel ?? 'After';
    const pos = this.position;

    return html`
      <section class="zl-section" style="padding:var(--zl-section-padding-y, 64px) 0">
        ${c.headline || c.subtitle ? html`
          <div class="ba-header">
            ${c.headline ? html`<h2 class="ba-headline">${c.headline}</h2>` : ''}
            ${c.subtitle ? html`<p class="ba-subtitle">${c.subtitle}</p>` : ''}
          </div>
        ` : ''}

        <div class="ba-container">
          <div class="ba-wrapper"
            @mousedown="${this.onMouseDown}"
            @touchstart="${this.onTouchStart}"
          >
            <!-- After image (full width, base layer) -->
            <div class="ba-after">
              <img class="ba-image" src="${c.afterImage}" alt="${afterLabel}" draggable="false" />
            </div>

            <!-- Before image (clipped to position) -->
            <div class="ba-before" style="width:${pos}%">
              <img class="ba-image" src="${c.beforeImage}" alt="${beforeLabel}" draggable="false"
                style="width:${(100 / pos) * 100}%; max-width:none;"
              />
            </div>

            <!-- Labels -->
            ${pos > 10 ? html`<span class="ba-label ba-label--before">${beforeLabel}</span>` : ''}
            ${pos < 90 ? html`<span class="ba-label ba-label--after">${afterLabel}</span>` : ''}

            <!-- Drag handle -->
            <div class="ba-handle" style="left:${pos}%">
              <div class="ba-handle-circle">
                <span class="ba-handle-arrows">&#9664; &#9654;</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-before-after': ZsSectionBeforeAfter; } }
