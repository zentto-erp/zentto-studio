// @zentto/studio — Social media embed component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type EmbedNetwork = 'youtube' | 'vimeo' | 'spotify' | 'tiktok' | 'twitter' | 'instagram' | 'unknown';

interface EmbedInfo {
  network: EmbedNetwork;
  embedUrl: string;
  iframe: boolean;
}

@customElement('zs-social-embed')
export class ZsSocialEmbed extends LitElement {
  static styles = css`
    :host { display: block; }

    .embed-wrapper {
      max-width: var(--zse-max-width, 560px);
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      background: #000;
    }

    /* 16:9 responsive iframe container */
    .embed-container {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
    }

    .embed-container iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }

    /* Link-card preview (Twitter, Instagram, unknown non-iframe) */
    .embed-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #fff;
      color: #1a1a1a;
      text-decoration: none;
      transition: background 0.2s ease;
    }

    .embed-card:hover {
      background: #f5f5f5;
    }

    .embed-card-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .embed-card-icon.twitter  { background: #000;    color: #fff; }
    .embed-card-icon.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; }
    .embed-card-icon.unknown  { background: #6366f1; color: #fff; }

    .embed-card-body {
      flex: 1;
      min-width: 0;
    }

    .embed-card-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
      margin-bottom: 2px;
    }

    .embed-card-url {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #1a1a1a;
    }

    .embed-card-arrow {
      flex-shrink: 0;
      font-size: 18px;
      opacity: 0.4;
    }
  `;

  @property({ type: String }) url = '';
  @property({ type: String, attribute: 'max-width' }) maxWidth = '560px';

  private detectNetwork(url: string): EmbedNetwork {
    if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
    if (/vimeo\.com/i.test(url)) return 'vimeo';
    if (/open\.spotify\.com/i.test(url)) return 'spotify';
    if (/tiktok\.com/i.test(url)) return 'tiktok';
    if (/twitter\.com|x\.com/i.test(url)) return 'twitter';
    if (/instagram\.com/i.test(url)) return 'instagram';
    return 'unknown';
  }

  private resolveEmbed(url: string): EmbedInfo {
    const network = this.detectNetwork(url);

    switch (network) {
      case 'youtube': {
        const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        const id = m?.[1] ?? '';
        return { network, embedUrl: `https://www.youtube.com/embed/${id}`, iframe: true };
      }
      case 'vimeo': {
        const m = url.match(/vimeo\.com\/(\d+)/);
        const id = m?.[1] ?? '';
        return { network, embedUrl: `https://player.vimeo.com/video/${id}`, iframe: true };
      }
      case 'spotify': {
        // open.spotify.com/track/ID, /album/ID, /playlist/ID, /episode/ID
        const m = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
        const type = m?.[1] ?? 'track';
        const id = m?.[2] ?? '';
        return { network, embedUrl: `https://open.spotify.com/embed/${type}/${id}`, iframe: true };
      }
      case 'tiktok': {
        // TikTok oEmbed: use the video URL inside an iframe via their embed endpoint
        const m = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
        const id = m?.[1] ?? '';
        const embedUrl = id
          ? `https://www.tiktok.com/embed/v2/${id}`
          : url;
        return { network, embedUrl, iframe: true };
      }
      case 'twitter':
        return { network, embedUrl: url, iframe: false };
      case 'instagram':
        return { network, embedUrl: url, iframe: false };
      default:
        return { network, embedUrl: url, iframe: true };
    }
  }

  private renderIframe(info: EmbedInfo) {
    return html`
      <div class="embed-wrapper" style="--zse-max-width: ${this.maxWidth}">
        <div class="embed-container">
          <iframe
            src="${info.embedUrl}"
            loading="lazy"
            allowfullscreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          ></iframe>
        </div>
      </div>
    `;
  }

  private renderCard(info: EmbedInfo) {
    const labels: Record<string, string> = {
      twitter: 'X / Twitter',
      instagram: 'Instagram',
      unknown: 'Link',
    };
    const icons: Record<string, string> = {
      twitter: '𝕏',
      instagram: '📷',
      unknown: '🔗',
    };

    return html`
      <div class="embed-wrapper" style="--zse-max-width: ${this.maxWidth}">
        <a class="embed-card" href="${info.embedUrl}" target="_blank" rel="noopener noreferrer">
          <div class="embed-card-icon ${info.network}">
            ${icons[info.network] ?? '🔗'}
          </div>
          <div class="embed-card-body">
            <div class="embed-card-label">${labels[info.network] ?? 'Link'}</div>
            <div class="embed-card-url">${info.embedUrl}</div>
          </div>
          <span class="embed-card-arrow">→</span>
        </a>
      </div>
    `;
  }

  render() {
    if (!this.url) return nothing;

    const info = this.resolveEmbed(this.url);

    if (info.iframe) {
      return this.renderIframe(info);
    }
    return this.renderCard(info);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-social-embed': ZsSocialEmbed;
  }
}
