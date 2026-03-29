// @zentto/studio — Button field
// Renders an action button that can submit forms, call APIs, navigate, or emit custom events

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface FieldConfig {
  id: string;
  type: string;
  field: string;
  label?: string;
  props?: Record<string, unknown>;
}

@customElement('zs-field-button')
export class ZsFieldButton extends LitElement {
  static styles = css`
    :host { display: block; }

    .zs-btn {
      font-family: var(--zs-font-family, sans-serif);
      border: none;
      border-radius: var(--zs-radius, 6px);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.15s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
    }

    .zs-btn:hover { filter: brightness(0.92); }
    .zs-btn:active { transform: scale(0.98); }
    .zs-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }

    /* Variants */
    .zs-btn--primary { background: var(--zs-primary, #1976d2); color: white; }
    .zs-btn--secondary { background: transparent; color: var(--zs-primary, #1976d2); border: 1px solid var(--zs-primary, #1976d2); }
    .zs-btn--danger { background: var(--zs-danger, #d32f2f); color: white; }
    .zs-btn--ghost { background: transparent; color: var(--zs-text, #333); }
    .zs-btn--success { background: #2e7d32; color: white; }
    .zs-btn--warning { background: #ed6c02; color: white; }

    /* Sizes */
    .zs-btn--small { padding: 6px 12px; font-size: 12px; }
    .zs-btn--medium { padding: 8px 20px; font-size: 14px; }
    .zs-btn--large { padding: 12px 28px; font-size: 16px; }

    .zs-btn--full { width: 100%; }
  `;

  @property({ type: Object }) config: FieldConfig | null = null;

  private get p(): Record<string, unknown> { return this.config?.props ?? {}; }

  private async handleClick() {
    const p = this.p;
    const actionType = (p.actionType as string) ?? 'custom';
    const confirmMsg = p.confirmMessage as string;

    // Confirm dialog
    if (confirmMsg) {
      const ok = window.confirm(confirmMsg);
      if (!ok) return;
    }

    // Emit the action event — host app handles the actual logic
    this.dispatchEvent(new CustomEvent('studio-action', {
      detail: {
        fieldId: this.config?.id,
        actionType,
        actionUrl: p.actionUrl ?? '',
        actionMethod: p.actionMethod ?? 'POST',
        navigateTo: p.navigateTo ?? '',
        eventName: p.eventName ?? this.config?.id,
        successMessage: p.successMessage ?? '',
        errorMessage: p.errorMessage ?? '',
      },
      bubbles: true,
      composed: true,
    }));

    // Built-in actions
    if (actionType === 'submit') {
      // Emit submit event — renderer handles collecting form data
      this.dispatchEvent(new CustomEvent('studio-submit', {
        detail: { fieldId: this.config?.id, url: p.actionUrl, method: p.actionMethod },
        bubbles: true, composed: true,
      }));
    } else if (actionType === 'navigate' && p.navigateTo) {
      this.dispatchEvent(new CustomEvent('studio-navigate', {
        detail: { path: p.navigateTo },
        bubbles: true, composed: true,
      }));
    } else if (actionType === 'reset') {
      this.dispatchEvent(new CustomEvent('studio-reset', {
        detail: { fieldId: this.config?.id },
        bubbles: true, composed: true,
      }));
    } else if (actionType === 'apiCall' && p.actionUrl) {
      await this.executeApiCall();
    }
  }

  private async executeApiCall() {
    const p = this.p;
    const url = p.actionUrl as string;
    const method = ((p.actionMethod as string) ?? 'POST').toUpperCase();

    this.dispatchEvent(new CustomEvent('studio-action-start', {
      detail: { fieldId: this.config?.id },
      bubbles: true, composed: true,
    }));

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));

      this.dispatchEvent(new CustomEvent('studio-action-result', {
        detail: { fieldId: this.config?.id, success: res.ok, data, status: res.status },
        bubbles: true, composed: true,
      }));
    } catch (err) {
      this.dispatchEvent(new CustomEvent('studio-action-result', {
        detail: { fieldId: this.config?.id, success: false, error: String(err) },
        bubbles: true, composed: true,
      }));
    }
  }

  render() {
    const p = this.p;
    const label = (p.buttonLabel as string) ?? this.config?.label ?? 'Accion';
    const variant = (p.variant as string) ?? 'primary';
    const size = (p.size as string) ?? 'medium';
    const full = (p.fullWidth as boolean) ?? false;
    const icon = (p.icon as string) ?? '';
    const disabled = (p.disabled as boolean) ?? false;

    return html`
      <button
        class="zs-btn zs-btn--${variant} zs-btn--${size} ${full ? 'zs-btn--full' : ''}"
        ?disabled="${disabled}"
        @click="${this.handleClick}"
      >
        ${icon ? html`<span>${icon}</span>` : nothing}
        ${label}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-button': ZsFieldButton;
  }
}
