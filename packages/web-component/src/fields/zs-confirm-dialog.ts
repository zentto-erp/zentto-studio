// @zentto/studio — Pre-built confirm/alert/prompt dialogs
// Imperative API: ZsConfirmDialog.confirm({ title, message })

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens } from '../styles/tokens.js';

type DialogType = 'confirm' | 'alert' | 'prompt' | 'delete' | 'decision';

interface DialogButton {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  value?: string;
  icon?: string;
}

interface DialogOptions {
  type?: DialogType;
  title: string;
  message?: string;
  icon?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'info';
  okText?: string;
  cancelText?: string;
  // For prompt
  inputLabel?: string;
  inputPlaceholder?: string;
  inputDefault?: string;
  // For delete confirmation
  confirmWord?: string;
  // For decision dialog
  buttons?: DialogButton[];
  // Size
  size?: 'sm' | 'md' | 'lg';
}

@customElement('zs-confirm-dialog')
export class ZsConfirmDialog extends LitElement {
  static styles = [studioTokens, css`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none; transition: opacity 200ms;
    }
    .backdrop--open { opacity: 1; pointer-events: auto; }
    .dialog {
      background: var(--zs-bg, #fff); border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.2);
      padding: 28px; max-width: 440px; width: 90%;
      transform: scale(0.9); transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: center;
    }
    .dialog--lg { max-width: 560px; }
    .backdrop--open .dialog { transform: scale(1); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .icon-circle {
      width: 72px; height: 72px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; font-size: 32px;
    }
    .icon-circle--danger { background: #fde8e8; }
    .icon-circle--success { background: #d4edda; }
    .icon-circle--warning { background: #fff3cd; }
    .icon-circle--info { background: #d1ecf1; }
    .icon-circle--default { background: var(--zs-bg-secondary); }
    .title {
      font-size: 20px; font-weight: 700; color: var(--zs-text, #212529);
      margin: 0 0 8px;
    }
    .message {
      font-size: 14px; color: var(--zs-text-secondary, #6c757d);
      line-height: 1.6; margin: 0 0 20px;
    }
    .input-group { margin-bottom: 20px; text-align: left; }
    .input-label { font-size: 13px; font-weight: 500; color: var(--zs-text); margin-bottom: 6px; display: block; }
    .input {
      width: 100%; padding: 10px 14px; border: 1px solid var(--zs-border);
      border-radius: 8px; font-size: 14px; font-family: var(--zs-font-family);
      outline: none; box-sizing: border-box; transition: border-color 150ms;
    }
    .input:focus { border-color: var(--zs-primary); box-shadow: 0 0 0 3px var(--zs-primary-light); }
    .input--error { border-color: #e74c3c; }
    .hint { font-size: 12px; color: var(--zs-text-muted); margin-top: 6px; }
    .buttons { display: flex; gap: 10px; justify-content: center; }
    .buttons--decision { flex-direction: column; }
    .btn {
      padding: 10px 24px; border-radius: 8px; flex: 1;
      font-family: var(--zs-font-family); font-size: 14px; font-weight: 500;
      cursor: pointer; border: 1px solid transparent; transition: all 150ms;
    }
    .btn--primary { background: var(--zs-primary, #e67e22); color: white; }
    .btn--primary:hover { filter: brightness(0.9); }
    .btn--secondary { background: var(--zs-bg); color: var(--zs-text); border-color: var(--zs-border); }
    .btn--secondary:hover { background: var(--zs-bg-hover); }
    .btn--danger { background: #e74c3c; color: white; }
    .btn--danger:hover { background: #c0392b; }
    .btn--success { background: #27ae60; color: white; }
    .btn--ghost { background: none; color: var(--zs-text-secondary); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-icon { margin-right: 6px; }

    .decision-btn {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 20px; border-radius: 10px;
      border: 1px solid var(--zs-border); background: var(--zs-bg);
      cursor: pointer; transition: all 150ms; text-align: left;
      font-family: var(--zs-font-family); font-size: 14px;
    }
    .decision-btn:hover { border-color: var(--zs-primary); background: var(--zs-primary-light); }
    .decision-btn-icon { font-size: 20px; }
    .decision-btn-label { font-weight: 500; color: var(--zs-text); }
  `];

  @state() private isOpen = false;
  @state() private options: DialogOptions = { title: '' };
  @state() private inputValue = '';
  @state() private confirmValue = '';
  private resolvePromise: ((value: string | boolean | null) => void) | null = null;

  /**
   * Show a confirm dialog. Returns true/false.
   */
  async showConfirm(opts: DialogOptions): Promise<boolean> {
    return (await this.showDialog({ ...opts, type: 'confirm' })) as boolean;
  }

  /**
   * Show an alert dialog. Returns true when dismissed.
   */
  async showAlert(opts: DialogOptions): Promise<boolean> {
    return (await this.showDialog({ ...opts, type: 'alert' })) as boolean;
  }

  /**
   * Show a prompt dialog. Returns input value or null.
   */
  async showPrompt(opts: DialogOptions): Promise<string | null> {
    return (await this.showDialog({ ...opts, type: 'prompt' })) as string | null;
  }

  /**
   * Show a delete confirmation. Returns true/false.
   */
  async showDelete(opts: DialogOptions): Promise<boolean> {
    return (await this.showDialog({
      ...opts,
      type: 'delete',
      variant: 'danger',
      icon: opts.icon ?? '🗑️',
      okText: opts.okText ?? 'Eliminar',
    })) as boolean;
  }

  /**
   * Show a decision dialog. Returns the button value.
   */
  async showDecision(opts: DialogOptions): Promise<string | null> {
    return (await this.showDialog({ ...opts, type: 'decision' })) as string | null;
  }

  private showDialog(opts: DialogOptions): Promise<string | boolean | null> {
    return new Promise((resolve) => {
      this.options = opts;
      this.inputValue = opts.inputDefault ?? '';
      this.confirmValue = '';
      this.resolvePromise = resolve;
      this.isOpen = true;
    });
  }

  private resolve(value: string | boolean | null) {
    this.isOpen = false;
    this.resolvePromise?.(value);
    this.resolvePromise = null;
  }

  private get canDelete(): boolean {
    if (!this.options.confirmWord) return true;
    return this.confirmValue === this.options.confirmWord;
  }

  render() {
    const opts = this.options;
    const variant = opts.variant ?? 'default';
    const type = opts.type ?? 'confirm';

    return html`
      <div class="backdrop ${this.isOpen ? 'backdrop--open' : ''}">
        <div class="dialog ${opts.size === 'lg' ? 'dialog--lg' : ''}">
          <div class="icon-circle icon-circle--${variant}">
            ${opts.icon ?? { danger: '⚠️', success: '✅', warning: '⚡', info: 'ℹ️', default: '💬' }[variant]}
          </div>
          <h3 class="title">${opts.title}</h3>
          ${opts.message ? html`<p class="message">${opts.message}</p>` : ''}

          ${type === 'prompt' ? html`
            <div class="input-group">
              ${opts.inputLabel ? html`<label class="input-label">${opts.inputLabel}</label>` : ''}
              <input class="input" .value="${this.inputValue}" placeholder="${opts.inputPlaceholder ?? ''}"
                @input="${(e: Event) => { this.inputValue = (e.target as HTMLInputElement).value; }}"
                @keydown="${(e: KeyboardEvent) => { if (e.key === 'Enter') this.resolve(this.inputValue); }}"
              />
            </div>
          ` : ''}

          ${type === 'delete' && opts.confirmWord ? html`
            <div class="input-group">
              <label class="input-label">Escribe <strong>${opts.confirmWord}</strong> para confirmar:</label>
              <input class="input ${this.confirmValue && !this.canDelete ? 'input--error' : ''}"
                .value="${this.confirmValue}"
                placeholder="${opts.confirmWord}"
                @input="${(e: Event) => { this.confirmValue = (e.target as HTMLInputElement).value; }}"
              />
            </div>
          ` : ''}

          ${type === 'decision' && opts.buttons ? html`
            <div class="buttons buttons--decision">
              ${opts.buttons.map(btn => html`
                <button class="decision-btn" @click="${() => this.resolve(btn.value ?? btn.label)}">
                  ${btn.icon ? html`<span class="decision-btn-icon">${btn.icon}</span>` : ''}
                  <span class="decision-btn-label">${btn.label}</span>
                </button>
              `)}
              <button class="btn btn--ghost" style="margin-top:4px;" @click="${() => this.resolve(null)}">${opts.cancelText ?? 'Cancelar'}</button>
            </div>
          ` : html`
            <div class="buttons">
              ${type !== 'alert' ? html`
                <button class="btn btn--secondary" @click="${() => this.resolve(type === 'prompt' ? null : false)}">${opts.cancelText ?? 'Cancelar'}</button>
              ` : ''}
              <button class="btn btn--${type === 'delete' ? 'danger' : 'primary'}"
                ?disabled="${type === 'delete' && !this.canDelete}"
                @click="${() => {
                  if (type === 'prompt') this.resolve(this.inputValue);
                  else this.resolve(true);
                }}"
              >${opts.okText ?? (type === 'alert' ? 'Entendido' : 'Aceptar')}</button>
            </div>
          `}
        </div>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-confirm-dialog': ZsConfirmDialog; } }
