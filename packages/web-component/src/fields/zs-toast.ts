// @zentto/studio — Toast notification system
// Stackable toasts with auto-dismiss, action buttons, progress bar

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens } from '../styles/tokens.js';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;      // ms, 0 = no auto-dismiss (default 4000)
  action?: string;        // action button label
  actionId?: string;      // action event id
  dismissable?: boolean;  // show close button (default true)
  icon?: string;
  progress?: boolean;     // show progress bar (default true)
}

@customElement('zs-toast')
export class ZsToast extends LitElement {
  static styles = [studioTokens, css`
    :host { display: contents; }

    .zs-toast-container {
      position: fixed; z-index: 9999;
      display: flex; flex-direction: column; gap: 8px;
      max-width: 420px; width: 100%;
      pointer-events: none;
    }
    .zs-toast-container--top-right { top: 16px; right: 16px; }
    .zs-toast-container--top-left { top: 16px; left: 16px; }
    .zs-toast-container--bottom-right { bottom: 16px; right: 16px; }
    .zs-toast-container--bottom-left { bottom: 16px; left: 16px; }
    .zs-toast-container--top-center { top: 16px; left: 50%; transform: translateX(-50%); }
    .zs-toast-container--bottom-center { bottom: 16px; left: 50%; transform: translateX(-50%); }

    .zs-toast-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 16px;
      background: var(--zs-bg, #fff);
      border-radius: 10px;
      border-left: 4px solid;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      pointer-events: auto;
      animation: zs-toast-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      transition: all 200ms;
    }
    .zs-toast-item--removing {
      animation: zs-toast-out 200ms ease forwards;
    }
    .zs-toast-item--success { border-left-color: #27ae60; }
    .zs-toast-item--error { border-left-color: #e74c3c; }
    .zs-toast-item--warning { border-left-color: #f39c12; }
    .zs-toast-item--info { border-left-color: #3498db; }

    @keyframes zs-toast-in {
      from { opacity: 0; transform: translateX(30px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes zs-toast-out {
      from { opacity: 1; transform: translateX(0); max-height: 200px; }
      to { opacity: 0; transform: translateX(60px); max-height: 0; padding: 0; margin: 0; }
    }

    .zs-toast-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
    .zs-toast-content { flex: 1; min-width: 0; }
    .zs-toast-title {
      font-size: 14px; font-weight: 600;
      color: var(--zs-text, #212529);
      margin: 0;
    }
    .zs-toast-message {
      font-size: 13px; color: var(--zs-text-secondary, #6c757d);
      margin: 2px 0 0; line-height: 1.4;
    }
    .zs-toast-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    .zs-toast-action {
      padding: 4px 12px; border-radius: 6px;
      font-size: 12px; font-weight: 600;
      cursor: pointer; border: none;
      transition: all 100ms;
    }
    .zs-toast-action--primary {
      background: var(--zs-primary, #e67e22); color: white;
    }
    .zs-toast-action--primary:hover { filter: brightness(0.9); }
    .zs-toast-action--secondary {
      background: var(--zs-bg-secondary, #f8f9fa);
      color: var(--zs-text-secondary); border: 1px solid var(--zs-border);
    }

    .zs-toast-close {
      border: none; background: none; cursor: pointer;
      color: var(--zs-text-muted, #adb5bd); font-size: 16px;
      padding: 0; line-height: 1; transition: color 100ms;
      flex-shrink: 0;
    }
    .zs-toast-close:hover { color: var(--zs-text); }

    /* Progress bar */
    .zs-toast-progress {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 3px; background: rgba(0,0,0,0.06);
    }
    .zs-toast-progress-bar {
      height: 100%; transition: width 100ms linear;
    }
    .zs-toast-progress-bar--success { background: #27ae60; }
    .zs-toast-progress-bar--error { background: #e74c3c; }
    .zs-toast-progress-bar--warning { background: #f39c12; }
    .zs-toast-progress-bar--info { background: #3498db; }
  `];

  @property() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right';
  @property({ type: Number }) maxVisible = 5;

  @state() private toasts: (ToastMessage & { _progress?: number; _timer?: number; _removing?: boolean })[] = [];

  private getDefaultIcon(type: string): string {
    return { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type] ?? 'ℹ️';
  }

  /** Add a toast notification */
  show(toast: Omit<ToastMessage, 'id'> & { id?: string }) {
    const id = toast.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const duration = toast.duration ?? 4000;
    const item = {
      ...toast, id,
      dismissable: toast.dismissable ?? true,
      progress: toast.progress ?? true,
      _progress: 100,
    } as ToastMessage & { _progress: number; _timer?: number; _removing?: boolean };

    this.toasts = [...this.toasts.slice(-(this.maxVisible - 1)), item];

    if (duration > 0) {
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        const t = this.toasts.find(t => t.id === id);
        if (t) {
          t._progress = remaining;
          this.requestUpdate();
        }
        if (remaining > 0) {
          item._timer = requestAnimationFrame(tick) as unknown as number;
        } else {
          this.dismiss(id);
        }
      };
      item._timer = requestAnimationFrame(tick) as unknown as number;
    }
  }

  /** Dismiss a toast by ID */
  dismiss(id: string) {
    const t = this.toasts.find(t => t.id === id);
    if (t) {
      if (t._timer) cancelAnimationFrame(t._timer as unknown as number);
      t._removing = true;
      this.requestUpdate();
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 200);
    }
  }

  /** Clear all toasts */
  clear() {
    this.toasts.forEach(t => {
      if (t._timer) cancelAnimationFrame(t._timer as unknown as number);
    });
    this.toasts = [];
  }

  /** Convenience methods */
  success(title: string, message?: string) { this.show({ title, message, type: 'success' }); }
  error(title: string, message?: string) { this.show({ title, message, type: 'error', duration: 6000 }); }
  warning(title: string, message?: string) { this.show({ title, message, type: 'warning' }); }
  info(title: string, message?: string) { this.show({ title, message, type: 'info' }); }

  render() {
    return html`
      <div class="zs-toast-container zs-toast-container--${this.position}">
        ${this.toasts.map(t => html`
          <div class="zs-toast-item zs-toast-item--${t.type} ${t._removing ? 'zs-toast-item--removing' : ''}">
            <span class="zs-toast-icon">${t.icon ?? this.getDefaultIcon(t.type)}</span>
            <div class="zs-toast-content">
              <div class="zs-toast-title">${t.title}</div>
              ${t.message ? html`<div class="zs-toast-message">${t.message}</div>` : ''}
              ${t.action ? html`
                <div class="zs-toast-actions">
                  <button class="zs-toast-action zs-toast-action--primary" @click="${() => {
                    this.dispatchEvent(new CustomEvent('toast-action', { detail: { id: t.id, actionId: t.actionId ?? t.action }, bubbles: true, composed: true }));
                    this.dismiss(t.id);
                  }}">${t.action}</button>
                </div>
              ` : ''}
            </div>
            ${t.dismissable ? html`<button class="zs-toast-close" @click="${() => this.dismiss(t.id)}">✕</button>` : ''}
            ${t.progress && t.duration !== 0 ? html`
              <div class="zs-toast-progress">
                <div class="zs-toast-progress-bar zs-toast-progress-bar--${t.type}" style="width:${t._progress ?? 100}%"></div>
              </div>
            ` : ''}
          </div>
        `)}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-toast': ZsToast; } }
