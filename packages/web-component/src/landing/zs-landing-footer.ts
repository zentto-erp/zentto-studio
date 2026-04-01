// @zentto/studio — Landing page footer

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles } from './zs-landing-styles.js';
import type { LandingFooter } from '@zentto/studio-core';

@customElement('zs-landing-footer')
export class ZsLandingFooter extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, css`
    :host { display: block; }

    footer {
      background: var(--zl-text);
      color: #ccc;
      padding: 64px var(--zl-section-padding-x) 32px;
      font-family: var(--zl-font-family);
    }

    .footer-inner {
      max-width: var(--zl-max-width);
      margin: 0 auto;
    }

    .footer-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      margin-bottom: 48px;
    }

    .footer-col-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #fff;
      margin-bottom: 16px;
    }

    .footer-link {
      display: block;
      font-size: 14px;
      color: #aaa;
      padding: 4px 0;
      transition: color var(--zl-transition);
      cursor: pointer;
    }

    .footer-link:hover { color: #fff; }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-copyright {
      font-size: 13px;
      color: #888;
    }

    .footer-social {
      display: flex;
      gap: 16px;
    }

    .footer-social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: #ccc;
      transition: all var(--zl-transition);
      cursor: pointer;
      font-size: 16px;
    }

    .footer-social-link:hover {
      background: var(--zl-primary);
      color: #fff;
    }

    .footer-newsletter {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .footer-newsletter input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--zl-radius);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      font-size: 14px;
      outline: none;
    }

    .footer-newsletter input::placeholder { color: #888; }

    .footer-newsletter input:focus {
      border-color: var(--zl-primary);
    }

    @media (max-width: 480px) {
      .footer-columns { grid-template-columns: 1fr 1fr; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `];

  @property({ type: Object }) config!: LandingFooter;

  private handleLinkClick(href: string, external?: boolean) {
    if (external) { window.open(href, '_blank', 'noopener'); return; }
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

  render() {
    const c = this.config;
    if (!c) return '';

    return html`
      <footer role="contentinfo">
        <div class="footer-inner">
          <div class="footer-columns">
            ${(c.columns ?? []).map(col => html`
              <div>
                <div class="footer-col-title">${col.title}</div>
                ${col.links.map(link => html`
                  <a class="footer-link" @click="${() => this.handleLinkClick(link.href, link.external)}">${link.label}</a>
                `)}
              </div>
            `)}
            ${c.newsletter ? html`
              <div>
                <div class="footer-col-title">Newsletter</div>
                <div class="footer-newsletter">
                  <input type="email" placeholder="${c.newsletter.placeholder ?? 'Tu email...'}" />
                  <button class="zl-btn zl-btn--primary" style="padding:10px 16px;font-size:14px;">${c.newsletter.buttonLabel ?? 'Suscribir'}</button>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="footer-bottom">
            <div class="footer-copyright">${c.copyright ?? ''}</div>
            ${c.socialLinks?.length ? html`
              <div class="footer-social">
                ${c.socialLinks.map(s => html`
                  <a class="footer-social-link" href="${s.url}" target="_blank" rel="noopener" title="${s.icon}">${s.icon}</a>
                `)}
              </div>
            ` : ''}
          </div>
        </div>
      </footer>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-landing-footer': ZsLandingFooter; } }
