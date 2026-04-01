// @zentto/studio — Landing page navigation bar

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingButtonStyles } from './zs-landing-styles.js';
import type { LandingNavbar } from '@zentto/studio-core';

@customElement('zs-landing-navbar')
export class ZsLandingNavbar extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, css`
    :host { display: block; }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 0 var(--zl-section-padding-x);
      transition: background var(--zl-transition-slow), box-shadow var(--zl-transition-slow);
    }

    .navbar--solid {
      background: var(--zl-bg);
      box-shadow: var(--zl-shadow-sm);
    }

    .navbar--transparent {
      background: transparent;
    }

    .navbar--scrolled {
      background: var(--zl-bg) !important;
      box-shadow: var(--zl-shadow-sm) !important;
    }

    .navbar-inner {
      max-width: var(--zl-max-width);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--zl-heading-font-family);
      font-size: 22px;
      font-weight: 700;
      color: var(--zl-text);
      cursor: pointer;
      text-decoration: none;
    }

    .navbar-logo {
      height: 36px;
      width: auto;
    }

    .navbar-logo--svg { display: flex; }

    .navbar-links {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .navbar-link {
      font-size: 15px;
      font-weight: 500;
      color: var(--zl-text-secondary);
      transition: color var(--zl-transition);
      cursor: pointer;
    }

    .navbar-link:hover {
      color: var(--zl-primary);
    }

    .navbar-cta {
      margin-left: 16px;
    }

    .navbar-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--zl-text);
    }

    .navbar-toggle svg {
      width: 24px;
      height: 24px;
    }

    .navbar-mobile {
      display: none;
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      background: var(--zl-bg);
      box-shadow: var(--zl-shadow-lg);
      padding: 16px var(--zl-section-padding-x) 24px;
      flex-direction: column;
      gap: 16px;
      z-index: 999;
    }

    .navbar-mobile.open { display: flex; }

    .navbar-mobile .navbar-link {
      font-size: 17px;
      padding: 8px 0;
    }

    .navbar-mobile .zl-btn {
      width: 100%;
      text-align: center;
    }

    /* Spacer to push content below fixed navbar */
    .navbar-spacer { height: 72px; }

    @media (max-width: 768px) {
      .navbar-links { display: none; }
      .navbar-toggle { display: block; }
    }
  `];

  @property({ type: Object }) config!: LandingNavbar;
  @state() private scrolled = false;
  @state() private mobileOpen = false;

  private scrollHandler = () => {
    const wasScrolled = this.scrolled;
    this.scrolled = window.scrollY > 60;
    if (wasScrolled !== this.scrolled) this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.scrollHandler);
  }

  private handleLinkClick(href: string, external?: boolean) {
    this.mobileOpen = false;
    if (external) {
      window.open(href, '_blank', 'noopener');
      return;
    }
    if (href.startsWith('#')) {
      this.dispatchEvent(new CustomEvent('landing-scroll-to', {
        detail: { anchor: href.slice(1) },
        bubbles: true, composed: true,
      }));
      return;
    }
    this.dispatchEvent(new CustomEvent('landing-navigate', {
      detail: { segment: href.replace(/^\//, '') },
      bubbles: true, composed: true,
    }));
  }

  private renderLogo() {
    const c = this.config;
    if (!c.logo) return c.title ?? '';
    if (c.logo.startsWith('<')) return html`<span class="navbar-logo navbar-logo--svg">${unsafeHTML(c.logo)}</span>`;
    return html`<img class="navbar-logo" src="${c.logo}" alt="${c.logoAlt ?? c.title ?? 'Logo'}" />`;
  }

  render() {
    const c = this.config;
    if (!c) return '';
    const transparent = c.transparent && !this.scrolled;
    const navClasses = `navbar ${transparent ? 'navbar--transparent' : 'navbar--solid'} ${this.scrolled ? 'navbar--scrolled' : ''}`;

    return html`
      <nav class="${navClasses}" role="navigation">
        <div class="navbar-inner">
          <a class="navbar-brand" @click="${() => this.handleLinkClick('/')}">${this.renderLogo()}<span>${c.title ?? ''}</span></a>

          <div class="navbar-links">
            ${(c.links ?? []).map(link => html`
              <a class="navbar-link" @click="${() => this.handleLinkClick(link.href, link.external)}">${link.label}</a>
            `)}
            ${c.ctaButton ? html`
              <a class="zl-btn zl-btn--${c.ctaButton.variant ?? 'primary'} navbar-cta"
                 @click="${() => this.handleLinkClick(c.ctaButton!.href)}">${c.ctaButton.label}</a>
            ` : ''}
          </div>

          <button class="navbar-toggle" @click="${() => { this.mobileOpen = !this.mobileOpen; }}" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${this.mobileOpen
                ? html`<path d="M6 6L18 18M6 18L18 6"/>`
                : html`<path d="M3 6h18M3 12h18M3 18h18"/>`}
            </svg>
          </button>
        </div>
      </nav>

      <div class="navbar-mobile ${this.mobileOpen ? 'open' : ''}">
        ${(c.links ?? []).map(link => html`
          <a class="navbar-link" @click="${() => this.handleLinkClick(link.href, link.external)}">${link.label}</a>
        `)}
        ${c.ctaButton ? html`
          <a class="zl-btn zl-btn--${c.ctaButton.variant ?? 'primary'}"
             @click="${() => this.handleLinkClick(c.ctaButton!.href)}">${c.ctaButton.label}</a>
        ` : ''}
      </div>

      ${c.sticky !== false ? html`<div class="navbar-spacer"></div>` : ''}
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-landing-navbar': ZsLandingNavbar; } }
