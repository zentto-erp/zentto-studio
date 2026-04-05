// @zentto/studio — Social share buttons component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getShareUrl, canNativeShare, nativeShare } from '@zentto/studio-core';
import type { ShareConfig } from '@zentto/studio-core';
import { SOCIAL_ICONS } from '@zentto/studio-core';
import type { SocialIconData } from '@zentto/studio-core';

const NETWORK_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  pinterest: 'Pinterest',
  reddit: 'Reddit',
  email: 'Email',
  threads: 'Threads',
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
  tumblr: 'Tumblr',
  pocket: 'Pocket',
  hackernews: 'Hacker News',
  flipboard: 'Flipboard',
  line: 'LINE',
  viber: 'Viber',
};

@customElement('zs-social-share')
export class ZsSocialShare extends LitElement {
  static styles = css`
    :host { display: block; }

    /* ─── Inline variant ─── */
    .share--inline {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    /* ─── Sticky variant (left sidebar) ─── */
    .share--sticky {
      position: fixed;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 1000;
      padding: 4px;
    }

    /* ─── Floating variant (bottom bar mobile) ─── */
    .share--floating {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: none; /* shown only on mobile */
      justify-content: center;
      gap: 4px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.12);
      z-index: 1000;
    }

    /* ─── Share button ─── */
    .share-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      cursor: pointer;
      border-radius: 8px;
      padding: 8px;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 1;
      transition: transform 0.15s ease, filter 0.15s ease;
      text-decoration: none;
    }

    .share-btn:hover {
      transform: scale(1.1);
      filter: brightness(1.15);
    }

    .share-btn:active {
      transform: scale(0.95);
    }

    .share-btn svg {
      flex-shrink: 0;
      fill: currentColor;
    }

    .share-btn__label {
      white-space: nowrap;
    }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
      .share--sticky {
        display: none;
      }
      .share--floating {
        display: flex;
      }
    }

    @media (min-width: 769px) {
      .share--floating {
        display: none;
      }
    }
  `;

  @property({ type: Array }) networks: string[] = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram'];
  @property({ type: String }) variant: 'inline' | 'sticky' | 'floating' = 'inline';
  @property({ type: Boolean }) showLabels = false;
  @property({ type: String }) url = '';
  @property({ type: String }) title = '';
  @property({ type: String }) text = '';
  @property({ type: String }) image = '';
  @property({ type: Number }) iconSize = 24;

  private _getShareConfig(): ShareConfig {
    return {
      url: this.url || (typeof window !== 'undefined' ? window.location.href : ''),
      title: this.title,
      text: this.text,
      image: this.image,
    };
  }

  private async _handleClick(network: string, e: Event) {
    e.preventDefault();

    const config = this._getShareConfig();

    // Try native share on mobile first
    if (canNativeShare()) {
      const shared = await nativeShare(config);
      if (shared) return;
    }

    // Fallback: open share URL in popup window
    const shareUrl = getShareUrl(network, config);
    if (!shareUrl) return;

    // email links open directly
    if (network === 'email') {
      window.location.href = shareUrl;
      return;
    }

    const w = 600;
    const h = 400;
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 2;
    window.open(
      shareUrl,
      '_blank',
      `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`,
    );
  }

  private _renderIcon(network: string): ReturnType<typeof html> {
    const icon: SocialIconData | undefined = SOCIAL_ICONS[network];
    if (!icon) return html``;

    const size = this.iconSize;
    return html`
      <svg width="${size}" height="${size}" viewBox="${icon.viewBox}" xmlns="http://www.w3.org/2000/svg">
        ${icon.paths.map(d => html`<path d="${d}"/>`)}
      </svg>
    `;
  }

  private _renderButton(network: string): ReturnType<typeof html> {
    const icon: SocialIconData | undefined = SOCIAL_ICONS[network];
    const bg = icon?.brandColor ?? '#555';
    const label = NETWORK_LABELS[network] ?? network;

    return html`
      <button
        class="share-btn"
        style="background:${bg}"
        title="${label}"
        aria-label="Share on ${label}"
        @click="${(e: Event) => this._handleClick(network, e)}"
      >
        ${this._renderIcon(network)}
        ${this.showLabels ? html`<span class="share-btn__label">${label}</span>` : nothing}
      </button>
    `;
  }

  render() {
    const variantClass = `share--${this.variant}`;

    return html`
      <div class="${variantClass}" role="group" aria-label="Share buttons">
        ${this.networks.map(n => this._renderButton(n))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-social-share': ZsSocialShare;
  }
}
