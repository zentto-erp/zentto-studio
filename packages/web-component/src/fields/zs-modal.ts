// @zentto/studio — Modal / Dialog system
// Supports: alert, confirm, form, custom content, fullscreen, side-panel

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens } from '../styles/tokens.js';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' | 'side-right' | 'side-left';
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning' | 'info';

@customElement('zs-modal')
export class ZsModal extends LitElement {
  static styles = [studioTokens, css`
    :host { display: contents; }

    /* Backdrop */
    .zs-backdrop {
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 200ms ease;
    }
    .zs-backdrop--open { opacity: 1; pointer-events: auto; }

    /* Dialog */
    .zs-dialog {
      background: var(--zs-bg, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: flex; flex-direction: column;
      max-height: 90vh;
      transform: translateY(20px) scale(0.97);
      transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
    }
    .zs-backdrop--open .zs-dialog {
      transform: translateY(0) scale(1);
    }

    /* Sizes */
    .zs-dialog--sm { width: 400px; }
    .zs-dialog--md { width: 560px; }
    .zs-dialog--lg { width: 760px; }
    .zs-dialog--xl { width: 960px; }
    .zs-dialog--fullscreen {
      width: 100vw; height: 100vh; max-height: 100vh;
      border-radius: 0;
    }
    .zs-dialog--side-right {
      position: fixed; right: 0; top: 0; bottom: 0;
      width: 480px; max-height: 100vh; height: 100vh;
      border-radius: 12px 0 0 12px;
      transform: translateX(100%);
    }
    .zs-backdrop--open .zs-dialog--side-right { transform: translateX(0); }
    .zs-dialog--side-left {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: 480px; max-height: 100vh; height: 100vh;
      border-radius: 0 12px 12px 0;
      transform: translateX(-100%);
    }
    .zs-backdrop--open .zs-dialog--side-left { transform: translateX(0); }

    /* Header */
    .zs-dialog-header {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--zs-border, #dee2e6);
    }
    .zs-dialog-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .zs-dialog-icon--default { background: var(--zs-bg-secondary); }
    .zs-dialog-icon--danger { background: #fde8e8; color: #e74c3c; }
    .zs-dialog-icon--success { background: #d4edda; color: #27ae60; }
    .zs-dialog-icon--warning { background: #fff3cd; color: #f39c12; }
    .zs-dialog-icon--info { background: #d1ecf1; color: #3498db; }
    .zs-dialog-title {
      font-size: 18px; font-weight: 600; color: var(--zs-text, #212529);
      margin: 0; flex: 1;
    }
    .zs-dialog-subtitle {
      font-size: 13px; color: var(--zs-text-secondary, #6c757d);
      margin: 2px 0 0;
    }
    .zs-dialog-close {
      width: 32px; height: 32px; border-radius: 8px;
      border: none; background: none; cursor: pointer;
      font-size: 18px; color: var(--zs-text-muted, #adb5bd);
      display: flex; align-items: center; justify-content: center;
      transition: all 150ms;
    }
    .zs-dialog-close:hover {
      background: var(--zs-bg-hover, #f1f3f5);
      color: var(--zs-text, #212529);
    }

    /* Body */
    .zs-dialog-body {
      padding: 20px 24px;
      overflow-y: auto; flex: 1;
      font-size: 14px; color: var(--zs-text, #212529);
      line-height: 1.6;
    }

    /* Footer */
    .zs-dialog-footer {
      display: flex; gap: 8px; justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid var(--zs-border, #dee2e6);
      background: var(--zs-bg-secondary, #f8f9fa);
    }
    .zs-dialog-footer--spread { justify-content: space-between; }

    /* Buttons */
    .zs-dlg-btn {
      padding: 9px 20px; border-radius: 8px;
      font-family: var(--zs-font-family, sans-serif);
      font-size: 14px; font-weight: 500;
      cursor: pointer; border: 1px solid transparent;
      transition: all 150ms;
    }
    .zs-dlg-btn--primary { background: var(--zs-primary, #e67e22); color: white; }
    .zs-dlg-btn--primary:hover { filter: brightness(0.9); }
    .zs-dlg-btn--secondary {
      background: var(--zs-bg, #fff); color: var(--zs-text, #212529);
      border-color: var(--zs-border, #dee2e6);
    }
    .zs-dlg-btn--secondary:hover { background: var(--zs-bg-hover, #f1f3f5); }
    .zs-dlg-btn--danger { background: #e74c3c; color: white; }
    .zs-dlg-btn--danger:hover { background: #c0392b; }
    .zs-dlg-btn--success { background: #27ae60; color: white; }
    .zs-dlg-btn--success:hover { background: #219a52; }
    .zs-dlg-btn--ghost {
      background: none; color: var(--zs-text-secondary, #6c757d);
    }
    .zs-dlg-btn--ghost:hover { color: var(--zs-text); background: var(--zs-bg-hover); }
    .zs-dlg-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .zs-dlg-btn--loading {
      position: relative; color: transparent; pointer-events: none;
    }
    .zs-dlg-btn--loading::after {
      content: ''; position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: white;
    }

    /* Confirm specific */
    .zs-confirm-text { font-size: 15px; line-height: 1.6; color: var(--zs-text); }
    .zs-confirm-input {
      width: 100%; margin-top: 12px; padding: 8px 12px;
      border: 1px solid var(--zs-border); border-radius: 6px;
      font-size: 14px; font-family: var(--zs-font-family);
      outline: none; box-sizing: border-box;
    }
    .zs-confirm-input:focus { border-color: var(--zs-primary); }
    .zs-confirm-hint {
      font-size: 12px; color: var(--zs-text-muted);
      margin-top: 4px;
    }
  `];

  @property({ type: Boolean, reflect: true }) open = false;
  @property() title = '';
  @property() subtitle = '';
  @property() icon = '';
  @property() size: ModalSize = 'md';
  @property() variant: ModalVariant = 'default';
  @property({ type: Boolean }) closable = true;
  @property({ type: Boolean }) closeOnBackdrop = true;
  @property({ type: Boolean }) hideFooter = false;
  @property({ type: Boolean }) hideHeader = false;

  // Confirm dialog props
  @property() confirmText = '';
  @property() cancelText = 'Cancelar';
  @property() okText = 'Aceptar';
  @property() okVariant: 'primary' | 'danger' | 'success' = 'primary';
  @property({ type: Boolean }) loading = false;

  // Confirm with input (type to confirm)
  @property() confirmInput = '';  // if set, user must type this to confirm
  @state() private confirmInputValue = '';

  private get canConfirm(): boolean {
    if (!this.confirmInput) return true;
    return this.confirmInputValue === this.confirmInput;
  }

  private handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget && this.closeOnBackdrop && this.closable) {
      this.close('backdrop');
    }
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closable) this.close('escape');
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeydown);
  }

  close(reason: 'close' | 'backdrop' | 'escape' | 'cancel' | 'ok' = 'close') {
    this.open = false;
    this.confirmInputValue = '';
    this.dispatchEvent(new CustomEvent('modal-close', {
      detail: { reason },
      bubbles: true, composed: true,
    }));
  }

  confirm() {
    if (!this.canConfirm) return;
    this.dispatchEvent(new CustomEvent('modal-confirm', {
      detail: {},
      bubbles: true, composed: true,
    }));
    if (!this.loading) this.close('ok');
  }

  cancel() {
    this.dispatchEvent(new CustomEvent('modal-cancel', {
      detail: {},
      bubbles: true, composed: true,
    }));
    this.close('cancel');
  }

  private getVariantIcon(): string {
    if (this.icon) return this.icon;
    const icons: Record<ModalVariant, string> = {
      default: '💬',
      danger: '⚠️',
      success: '✅',
      warning: '⚡',
      info: 'ℹ️',
    };
    return icons[this.variant];
  }

  render() {
    const backdropClass = `zs-backdrop ${this.open ? 'zs-backdrop--open' : ''}`;
    const dialogClass = `zs-dialog zs-dialog--${this.size}`;
    const iconClass = `zs-dialog-icon zs-dialog-icon--${this.variant}`;

    return html`
      <div class="${backdropClass}" @click="${this.handleBackdropClick}">
        <div class="${dialogClass}" @click="${(e: Event) => e.stopPropagation()}">

          ${!this.hideHeader ? html`
            <div class="zs-dialog-header">
              <div class="${iconClass}">${this.getVariantIcon()}</div>
              <div style="flex:1;">
                <h3 class="zs-dialog-title">${this.title}</h3>
                ${this.subtitle ? html`<p class="zs-dialog-subtitle">${this.subtitle}</p>` : ''}
              </div>
              ${this.closable ? html`
                <button class="zs-dialog-close" @click="${() => this.close('close')}">✕</button>
              ` : ''}
            </div>
          ` : ''}

          <div class="zs-dialog-body">
            ${this.confirmText ? html`
              <p class="zs-confirm-text">${this.confirmText}</p>
              ${this.confirmInput ? html`
                <input class="zs-confirm-input"
                  placeholder="Escribe '${this.confirmInput}' para confirmar"
                  .value="${this.confirmInputValue}"
                  @input="${(e: Event) => { this.confirmInputValue = (e.target as HTMLInputElement).value; }}"
                />
                <div class="zs-confirm-hint">Escribe <strong>${this.confirmInput}</strong> para habilitar el boton</div>
              ` : ''}
            ` : ''}
            <slot></slot>
          </div>

          ${!this.hideFooter ? html`
            <div class="zs-dialog-footer">
              <button class="zs-dlg-btn zs-dlg-btn--secondary" @click="${this.cancel}">${this.cancelText}</button>
              <button class="zs-dlg-btn zs-dlg-btn--${this.okVariant} ${this.loading ? 'zs-dlg-btn--loading' : ''}"
                ?disabled="${!this.canConfirm || this.loading}"
                @click="${this.confirm}"
              >${this.loading ? '...' : this.okText}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-modal': ZsModal; } }
