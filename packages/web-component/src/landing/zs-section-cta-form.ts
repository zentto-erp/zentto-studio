// @zentto/studio — CTA Form section component (lead capture / newsletter)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { CtaFormSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-cta-form')
export class ZsSectionCtaForm extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingButtonStyles, landingSectionStyles, css`
    :host { display: block; }

    .cta-form-section {
      padding: var(--zl-section-padding-y, 80px) var(--zl-section-padding-x, 24px);
      background: var(--zl-bg-alt);
    }

    .cta-form-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .cta-form-headline {
      font-family: var(--zl-heading-font-family);
      font-size: clamp(24px, 3.5vw, 40px);
      font-weight: 700;
      color: var(--zl-text);
      margin-bottom: 12px;
    }

    .cta-form-desc {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text-secondary);
      max-width: 560px;
      margin: 0 auto;
      line-height: var(--zl-line-height);
    }

    /* Form */
    .cta-form {
      max-width: 720px;
      margin: 0 auto;
    }

    /* Horizontal variant */
    .cta-form--horizontal .cta-form-fields {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .cta-form--horizontal .cta-form-field {
      flex: 1;
      min-width: 180px;
    }

    .cta-form--horizontal .cta-form-submit {
      flex-shrink: 0;
      align-self: flex-start;
      margin-top: 0;
    }

    /* Stacked variant */
    .cta-form--stacked .cta-form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cta-form--stacked .cta-form-submit {
      margin-top: 8px;
    }

    /* Inputs */
    .cta-form-input,
    .cta-form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--zl-border);
      border-radius: var(--zl-radius);
      background: var(--zl-bg);
      color: var(--zl-text);
      font-family: var(--zl-font-family);
      font-size: var(--zl-body-font-size);
      transition: border-color var(--zl-transition), box-shadow var(--zl-transition);
      box-sizing: border-box;
    }

    .cta-form-input:focus,
    .cta-form-textarea:focus {
      outline: none;
      border-color: var(--zl-primary);
      box-shadow: 0 0 0 3px rgba(var(--zl-primary-rgb, 59, 130, 246), 0.15);
    }

    .cta-form-input::placeholder,
    .cta-form-textarea::placeholder {
      color: var(--zl-text-secondary);
      opacity: 0.6;
    }

    .cta-form-input.invalid,
    .cta-form-textarea.invalid {
      border-color: #ef4444;
    }

    .cta-form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .cta-form-error {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
    }

    /* Honeypot — invisible to users */
    .cta-form-hp {
      position: absolute;
      left: -9999px;
      opacity: 0;
      height: 0;
      width: 0;
      overflow: hidden;
      tab-index: -1;
    }

    /* Success state */
    .cta-form-success {
      text-align: center;
      padding: 32px 16px;
    }

    .cta-form-success-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #22c55e;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 16px;
    }

    .cta-form-success-msg {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      font-weight: 600;
    }

    @media (max-width: 600px) {
      .cta-form--horizontal .cta-form-fields {
        flex-direction: column;
      }
      .cta-form--horizontal .cta-form-field {
        min-width: 0;
      }
    }
  `];

  @property({ type: Object }) config!: CtaFormSectionConfig;
  @state() private submitted = false;
  @state() private errors: Record<string, string> = {};

  private validate(formData: Record<string, string>): boolean {
    const errors: Record<string, string> = {};
    for (const field of this.config.fields) {
      const value = (formData[field.name] ?? '').trim();
      if (field.required && !value) {
        errors[field.name] = 'Required';
      } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.name] = 'Invalid email';
      }
    }
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    // Honeypot check — if filled, silently pretend success
    if (fd.get('_hp')) {
      this.submitted = true;
      return;
    }

    const data: Record<string, string> = {};
    for (const field of this.config.fields) {
      data[field.name] = (fd.get(field.name) as string) ?? '';
    }

    if (!this.validate(data)) return;

    this.submitted = true;
    this.dispatchEvent(new CustomEvent('form-submit', {
      detail: data,
      bubbles: true,
      composed: true,
    }));
  }

  private renderField(field: CtaFormSectionConfig['fields'][number]) {
    const err = this.errors[field.name];
    const invalidClass = err ? 'invalid' : '';

    if (field.type === 'textarea') {
      return html`
        <div class="cta-form-field">
          <textarea
            class="cta-form-textarea ${invalidClass}"
            name="${field.name}"
            placeholder="${field.placeholder ?? ''}"
            ?required="${field.required}"
          ></textarea>
          ${err ? html`<div class="cta-form-error">${err}</div>` : ''}
        </div>
      `;
    }

    return html`
      <div class="cta-form-field">
        <input
          class="cta-form-input ${invalidClass}"
          type="${field.type}"
          name="${field.name}"
          placeholder="${field.placeholder ?? ''}"
          ?required="${field.required}"
        />
        ${err ? html`<div class="cta-form-error">${err}</div>` : ''}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'stacked';

    if (this.submitted) {
      return html`
        <section class="cta-form-section" role="region">
          <div class="zl-container">
            <div class="cta-form-success">
              <div class="cta-form-success-icon">&#x2713;</div>
              <div class="cta-form-success-msg">${c.successMessage ?? 'Thank you!'}</div>
            </div>
          </div>
        </section>
      `;
    }

    return html`
      <section class="cta-form-section" role="region">
        <div class="zl-container">
          <div class="cta-form-header">
            <div class="cta-form-headline">${c.headline}</div>
            ${c.description ? html`<div class="cta-form-desc">${c.description}</div>` : ''}
          </div>
          <form class="cta-form cta-form--${variant}" @submit="${this.handleSubmit}" novalidate>
            <!-- Honeypot field for anti-spam -->
            <div class="cta-form-hp" aria-hidden="true">
              <input type="text" name="_hp" tabindex="-1" autocomplete="off" />
            </div>
            <div class="cta-form-fields">
              ${c.fields.map(f => this.renderField(f))}
              <div class="cta-form-submit">
                <button type="submit" class="zl-btn zl-btn--primary">${c.buttonLabel ?? 'Submit'}</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-cta-form': ZsSectionCtaForm; } }
