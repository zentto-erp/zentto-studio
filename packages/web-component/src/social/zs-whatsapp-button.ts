// @zentto/studio — Floating WhatsApp button component

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const WHATSAPP_ICON_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';

@customElement('zs-whatsapp-button')
export class ZsWhatsAppButton extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      z-index: 9999;
      bottom: 24px;
      animation: zsWaSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    :host([position='bottom-right']),
    :host(:not([position])) {
      right: 24px;
    }

    :host([position='bottom-left']) {
      right: auto;
      left: 24px;
    }

    @keyframes zsWaSlideIn {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes zsWaPulse {
      0% {
        box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
      }
      50% {
        box-shadow: 0 4px 24px rgba(37, 211, 102, 0.7),
                    0 0 0 12px rgba(37, 211, 102, 0.15);
      }
      100% {
        box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
      }
    }

    .wa-button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--zs-wa-size, 56px);
      height: var(--zs-wa-size, 56px);
      border-radius: 50%;
      border: none;
      background: #25D366;
      color: #fff;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .wa-button:hover {
      transform: scale(1.08);
      background: #20bd5a;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.55);
    }

    .wa-button:active {
      transform: scale(0.96);
    }

    .wa-button.pulse {
      animation: zsWaPulse 2s ease-in-out infinite;
    }

    .wa-button:hover.pulse {
      animation: none;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.55);
    }

    .wa-button svg {
      width: 60%;
      height: 60%;
      fill: #fff;
    }

    /* Tooltip */
    .wa-tooltip {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      white-space: nowrap;
      background: #333;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 6px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .wa-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 20px;
      border: 5px solid transparent;
      border-top-color: #333;
    }

    :host([position='bottom-left']) .wa-tooltip {
      right: auto;
      left: 0;
    }

    :host([position='bottom-left']) .wa-tooltip::after {
      right: auto;
      left: 20px;
    }

    .wa-button:hover + .wa-tooltip {
      opacity: 1;
      transform: translateY(0);
    }

    /* Responsive: smaller on mobile */
    @media (max-width: 480px) {
      :host {
        bottom: 16px;
      }
      :host([position='bottom-right']),
      :host(:not([position])) {
        right: 16px;
      }
      :host([position='bottom-left']) {
        left: 16px;
      }
      .wa-button {
        width: calc(var(--zs-wa-size, 56px) * 0.85);
        height: calc(var(--zs-wa-size, 56px) * 0.85);
      }
    }
  `;

  @property({ type: String }) phoneNumber = '';
  @property({ type: String }) message = '';
  @property({ type: String, reflect: true }) position: 'bottom-right' | 'bottom-left' = 'bottom-right';
  @property({ type: Number }) size = 56;
  @property({ type: String }) tooltipText = 'Chat on WhatsApp';
  @property({ type: Boolean }) pulse = true;

  private _handleClick() {
    if (!this.phoneNumber) return;
    const url = `https://wa.me/${this.phoneNumber}${this.message ? `?text=${encodeURIComponent(this.message)}` : ''}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('size')) {
      this.style.setProperty('--zs-wa-size', `${this.size}px`);
    }
  }

  render() {
    return html`
      <button
        class="wa-button ${this.pulse ? 'pulse' : ''}"
        @click="${this._handleClick}"
        aria-label="${this.tooltipText}"
        title=""
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="${WHATSAPP_ICON_PATH}" />
        </svg>
      </button>
      <span class="wa-tooltip">${this.tooltipText}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-whatsapp-button': ZsWhatsAppButton;
  }
}
