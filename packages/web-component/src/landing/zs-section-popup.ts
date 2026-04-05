// @zentto/studio — Popup section component with configurable triggers

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { PopupSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-popup')
export class ZsSectionPopup extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    .popup-trigger-btn {
      display: inline-block;
    }

    /* Backdrop */
    .popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .popup-backdrop--open {
      opacity: 1;
      visibility: visible;
    }

    /* Modal base */
    .popup-modal {
      position: fixed;
      z-index: 9999;
      outline: none;
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
      opacity: 0;
      visibility: hidden;
    }

    .popup-modal--open {
      opacity: 1;
      visibility: visible;
    }

    /* Centered variant */
    .popup-modal--centered {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      max-width: 600px;
      width: 90vw;
      max-height: 85vh;
      overflow-y: auto;
      background: var(--zl-surface, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .popup-modal--centered.popup-modal--open {
      transform: translate(-50%, -50%) scale(1);
    }

    /* Slide-in variant */
    .popup-modal--slide-in {
      top: 0;
      right: 0;
      bottom: 0;
      width: 420px;
      max-width: 90vw;
      background: var(--zl-surface, #fff);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.25);
      transform: translateX(100%);
      overflow-y: auto;
    }

    .popup-modal--slide-in.popup-modal--open {
      transform: translateX(0);
    }

    /* Fullscreen variant */
    .popup-modal--fullscreen {
      inset: 0;
      background: var(--zl-surface, #fff);
      overflow-y: auto;
      transform: scale(0.95);
    }

    .popup-modal--fullscreen.popup-modal--open {
      transform: scale(1);
    }

    /* Modal content */
    .popup-content {
      padding: 32px;
    }

    .popup-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(20px, 3vw, 32px);
      font-weight: 700;
      color: var(--zl-text);
      margin: 0 0 16px;
      line-height: 1.2;
    }

    .popup-body {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      line-height: var(--zl-line-height);
    }

    /* Close button */
    .popup-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.08);
      color: var(--zl-text);
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
      z-index: 1;
      line-height: 1;
    }

    .popup-close:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .popup-modal--slide-in { width: 100vw; max-width: 100vw; }
      .popup-content { padding: 24px 16px; }
      .popup-close { top: 8px; right: 8px; width: 32px; height: 32px; font-size: 18px; }
    }
  `];

  @property({ type: Object }) config!: PopupSectionConfig;
  @state() private isOpen = false;
  private scrollHandler?: () => void;
  private exitIntentHandler?: (e: MouseEvent) => void;
  private timeoutId?: ReturnType<typeof setTimeout>;
  private keyHandler = this.onKeyDown.bind(this);
  private hasFired = false;

  connectedCallback() {
    super.connectedCallback();
    if (this.shouldSuppressPopup()) return;

    const trigger = this.config?.trigger;
    if (trigger === 'scroll') {
      this.scrollHandler = this.onScroll.bind(this);
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    } else if (trigger === 'time') {
      const delay = this.config?.delay ?? 3000;
      this.timeoutId = setTimeout(() => this.openPopup(), delay);
    } else if (trigger === 'exit-intent') {
      this.exitIntentHandler = this.onExitIntent.bind(this);
      document.addEventListener('mouseleave', this.exitIntentHandler);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = undefined;
    }
    if (this.exitIntentHandler) {
      document.removeEventListener('mouseleave', this.exitIntentHandler);
      this.exitIntentHandler = undefined;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    document.removeEventListener('keydown', this.keyHandler);
    document.body.style.overflow = '';
  }

  private shouldSuppressPopup(): boolean {
    if (!this.config?.showOnce) return false;
    const key = this.getStorageKey();
    try {
      return localStorage.getItem(key) === 'dismissed';
    } catch {
      return false;
    }
  }

  private getStorageKey(): string {
    return this.config?.storageKey ?? `zs-popup-${this.config?.headline ?? 'default'}`;
  }

  private markDismissed() {
    if (!this.config?.showOnce) return;
    const key = this.getStorageKey();
    try {
      localStorage.setItem(key, 'dismissed');
    } catch {
      // Storage not available
    }
  }

  private onScroll() {
    if (this.hasFired) return;
    const percent = this.config?.scrollPercent ?? 50;
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrolled >= percent) {
      this.hasFired = true;
      this.openPopup();
      if (this.scrollHandler) {
        window.removeEventListener('scroll', this.scrollHandler);
        this.scrollHandler = undefined;
      }
    }
  }

  private onExitIntent(e: MouseEvent) {
    if (this.hasFired) return;
    if (e.clientY <= 5) {
      this.hasFired = true;
      this.openPopup();
      if (this.exitIntentHandler) {
        document.removeEventListener('mouseleave', this.exitIntentHandler);
        this.exitIntentHandler = undefined;
      }
    }
  }

  private openPopup() {
    if (this.shouldSuppressPopup()) return;
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.keyHandler);

    // Focus trap: focus the modal after render
    this.updateComplete.then(() => {
      const modal = this.shadowRoot?.querySelector('.popup-modal') as HTMLElement | null;
      modal?.focus();
    });
  }

  private closePopup() {
    this.isOpen = false;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.keyHandler);
    this.markDismissed();
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.closePopup();
      return;
    }

    // Focus trap
    if (e.key === 'Tab') {
      const modal = this.shadowRoot?.querySelector('.popup-modal') as HTMLElement | null;
      if (!modal) return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (this.shadowRoot?.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (this.shadowRoot?.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'centered';
    const openClass = this.isOpen ? 'popup-modal--open' : '';
    const backdropClass = this.isOpen ? 'popup-backdrop--open' : '';

    return html`
      ${c.trigger === 'button' ? html`
        <button class="zl-btn zl-btn--primary popup-trigger-btn"
          @click="${() => this.openPopup()}"
        >${c.buttonLabel ?? 'Open'}</button>
      ` : ''}

      <div class="popup-backdrop ${backdropClass}"></div>

      <div
        class="popup-modal popup-modal--${variant} ${openClass}"
        role="dialog"
        aria-modal="true"
        aria-label="${c.headline ?? 'Popup'}"
        tabindex="-1"
      >
        <button class="popup-close" @click="${() => this.closePopup()}" aria-label="Close">&#10005;</button>
        <div class="popup-content">
          ${c.headline ? html`<h2 class="popup-headline">${c.headline}</h2>` : ''}
          <div class="popup-body">${unsafeHTML(c.content)}</div>
        </div>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-popup': ZsSectionPopup; } }
