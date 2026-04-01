// @zentto/studio — Contact section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { ContactSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-contact')
export class ZsSectionContact extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    .contact-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }

    .contact-info-headline {
      font-family: var(--zl-heading-font-family);
      font-size: var(--zl-subheading-font-size);
      font-weight: 700;
      color: var(--zl-text);
      line-height: var(--zl-heading-line-height);
      margin-bottom: 16px;
    }

    .contact-info-subtitle {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
      margin-bottom: 32px;
    }

    /* Default form styles */
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .contact-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .contact-label {
      font-size: var(--zl-small-font-size);
      font-weight: 600;
      color: var(--zl-text);
    }

    .contact-input,
    .contact-textarea {
      padding: 12px 16px;
      border: 1px solid var(--zl-border);
      border-radius: var(--zl-radius);
      font-family: var(--zl-font-family);
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      background: var(--zl-bg);
      transition: border-color var(--zl-transition), box-shadow var(--zl-transition);
      outline: none;
    }

    .contact-input:focus,
    .contact-textarea:focus {
      border-color: var(--zl-primary);
      box-shadow: 0 0 0 3px var(--zl-primary-light);
    }

    .contact-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .contact-submit {
      align-self: flex-start;
      margin-top: 8px;
    }

    .contact-success {
      padding: 16px 20px;
      border-radius: var(--zl-radius);
      background: #d4edda;
      color: #155724;
      font-size: var(--zl-body-font-size);
      line-height: var(--zl-line-height);
    }

    /* When schema provided, the studio renderer fills the right column */
    .contact-form-wrapper {
      padding: 32px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      box-shadow: var(--zl-shadow-md);
    }

    @media (max-width: 768px) {
      .contact-layout { grid-template-columns: 1fr; }
    }
  `];

  @property({ type: Object }) config!: ContactSectionConfig;
  @state() private submitted = false;

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    formData.forEach((v, k) => { data[k] = v as string; });

    const action = this.config.submitAction;
    if (action?.url) {
      try {
        await fetch(action.url, {
          method: action.method ?? 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch {
        // Silently handle — the form still shows success
      }
    }

    this.dispatchEvent(new CustomEvent('landing-contact-submit', {
      detail: data,
      bubbles: true, composed: true,
    }));

    this.submitted = true;
  }

  private renderDefaultForm() {
    if (this.submitted) {
      return html`
        <div class="contact-success">
          ${this.config.successMessage ?? 'Thank you! Your message has been sent successfully.'}
        </div>
      `;
    }

    return html`
      <form class="contact-form" @submit="${this.handleSubmit}">
        <div class="contact-field">
          <label class="contact-label" for="contact-name">Name</label>
          <input class="contact-input" id="contact-name" name="name" type="text" required placeholder="Your name" />
        </div>
        <div class="contact-field">
          <label class="contact-label" for="contact-email">Email</label>
          <input class="contact-input" id="contact-email" name="email" type="email" required placeholder="your@email.com" />
        </div>
        <div class="contact-field">
          <label class="contact-label" for="contact-message">Message</label>
          <textarea class="contact-textarea" id="contact-message" name="message" required placeholder="How can we help?"></textarea>
        </div>
        <button type="submit" class="zl-btn zl-btn--primary contact-submit">Send Message</button>
      </form>
    `;
  }

  private renderSchemaForm() {
    if (this.submitted) {
      return html`
        <div class="contact-success">
          ${this.config.successMessage ?? 'Thank you! Your message has been sent successfully.'}
        </div>
      `;
    }

    return html`<zentto-studio-renderer .schema="${this.config.schema}"></zentto-studio-renderer>`;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          <div class="contact-layout">
            <div class="contact-info">
              ${c.headline ? html`<div class="contact-info-headline">${c.headline}</div>` : ''}
              ${c.subtitle ? html`<div class="contact-info-subtitle">${c.subtitle}</div>` : ''}
            </div>
            <div class="contact-form-wrapper">
              ${c.schema ? this.renderSchemaForm() : this.renderDefaultForm()}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-contact': ZsSectionContact; } }
