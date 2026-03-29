// @zentto/studio — Media display field (image, video, audio, iframe)

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('zs-field-media')
export class ZsFieldMedia extends LitElement {
  static styles = css`
    :host { display: block; }
    .zs-media-label {
      font-size: 13px; font-weight: 500;
      color: var(--zs-text, #212529);
      margin-bottom: 4px;
    }
    img { max-width: 100%; height: auto; border-radius: 6px; display: block; }
    video { max-width: 100%; border-radius: 6px; display: block; }
    audio { width: 100%; }
    iframe {
      width: 100%; min-height: 300px; border: 1px solid var(--zs-border, #dee2e6);
      border-radius: 6px;
    }
  `;

  @property() label = '';
  @property() src = '';
  @property() mediaType: 'image' | 'video' | 'audio' | 'iframe' = 'image';
  @property() alt = '';

  render() {
    return html`
      ${this.label ? html`<div class="zs-media-label">${this.label}</div>` : ''}
      ${this.mediaType === 'image' ? html`<img src="${this.src}" alt="${this.alt}" loading="lazy" />` :
        this.mediaType === 'video' ? html`<video src="${this.src}" controls></video>` :
        this.mediaType === 'audio' ? html`<audio src="${this.src}" controls></audio>` :
        html`<iframe src="${this.src}" title="${this.alt}" frameborder="0"></iframe>`
      }
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-media': ZsFieldMedia; } }
