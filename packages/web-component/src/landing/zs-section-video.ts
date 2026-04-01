// @zentto/studio — Video section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { VideoSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-video')
export class ZsSectionVideo extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .video-wrapper {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
    }

    .video-container {
      position: relative;
      width: 100%;
      padding-top: 56.25%; /* 16:9 aspect ratio */
      background: #000;
      border-radius: var(--zl-radius-lg);
      overflow: hidden;
      box-shadow: var(--zl-shadow-xl);
    }

    .video-container iframe,
    .video-container video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }

    .video-poster {
      position: absolute;
      inset: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .video-poster img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-play-btn {
      position: relative;
      z-index: 1;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--zl-transition);
      box-shadow: var(--zl-shadow-lg);
    }

    .video-play-btn:hover {
      transform: scale(1.1);
      background: #fff;
    }

    .video-play-icon {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 14px 0 14px 24px;
      border-color: transparent transparent transparent var(--zl-primary);
      margin-left: 4px;
    }

    .video-poster-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 0;
    }
  `];

  @property({ type: Object }) config!: VideoSectionConfig;
  @state() private playing = false;

  private getProvider(): 'youtube' | 'vimeo' | 'self' {
    const c = this.config;
    if (c.provider) return c.provider;
    const url = c.videoUrl;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'self';
  }

  private getEmbedUrl(): string {
    const url = this.config.videoUrl;
    const provider = this.getProvider();

    if (provider === 'youtube') {
      // Extract video ID
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      const id = match?.[1] ?? url;
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }

    if (provider === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      const id = match?.[1] ?? url;
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    return url;
  }

  private getDefaultPoster(): string {
    const url = this.config.videoUrl;
    const provider = this.getProvider();

    if (provider === 'youtube') {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      const id = match?.[1];
      if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }

    return '';
  }

  private play() {
    this.playing = true;
  }

  private renderVideo() {
    const provider = this.getProvider();
    const poster = this.config.poster || this.getDefaultPoster();

    if (!this.playing && poster) {
      return html`
        <div class="video-container">
          <div class="video-poster" @click="${this.play}">
            <img src="${poster}" alt="Video thumbnail" loading="lazy" />
            <div class="video-poster-overlay"></div>
            <button class="video-play-btn" aria-label="Play video">
              <div class="video-play-icon"></div>
            </button>
          </div>
        </div>
      `;
    }

    if (provider === 'self') {
      return html`
        <div class="video-container">
          <video src="${this.config.videoUrl}" controls autoplay
                 ${this.config.poster ? `poster="${this.config.poster}"` : ''}>
          </video>
        </div>
      `;
    }

    return html`
      <div class="video-container">
        <iframe src="${this.getEmbedUrl()}"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
                loading="lazy"></iframe>
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          <div class="video-wrapper">
            ${this.renderVideo()}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-video': ZsSectionVideo; } }
