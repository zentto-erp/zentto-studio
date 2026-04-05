// @zentto/studio — Map section component (OpenStreetMap)

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { MapSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-map')
export class ZsSectionMap extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .map-wrapper {
      position: relative;
      width: 100%;
    }

    .map-iframe {
      width: 100%;
      border: 0;
      border-radius: var(--zl-radius-lg);
    }

    .map-address-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zl-surface);
      border-radius: var(--zl-radius-lg);
      padding: 48px 24px;
      text-align: center;
    }

    .map-address-fallback a {
      color: var(--zl-primary);
      font-size: var(--zl-body-font-size);
      font-weight: 600;
      text-decoration: none;
    }

    .map-address-fallback a:hover {
      text-decoration: underline;
    }

    .map-info-overlay {
      position: absolute;
      bottom: 24px;
      left: 24px;
      background: var(--zl-bg);
      border-radius: var(--zl-radius-lg);
      padding: 20px 24px;
      box-shadow: var(--zl-shadow-xl);
      max-width: 320px;
      z-index: 2;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
    }

    .info-row + .info-row {
      margin-top: 10px;
    }

    .info-icon {
      flex-shrink: 0;
      width: 18px;
      text-align: center;
      color: var(--zl-primary);
      font-weight: 600;
    }

    .info-row a {
      color: var(--zl-primary);
      text-decoration: none;
    }

    .info-row a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .map-info-overlay {
        position: relative;
        bottom: auto;
        left: auto;
        max-width: 100%;
        margin-top: 16px;
      }
    }
  `];

  @property({ type: Object }) config!: MapSectionConfig;

  private buildEmbedUrl(): string | null {
    const c = this.config;
    if (c.lat == null || c.lng == null) return null;

    const zoom = c.zoom ?? 15;
    const delta = 0.01 / (zoom / 15);
    const bbox = `${c.lng - delta},${c.lat - delta},${c.lng + delta},${c.lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${c.lat},${c.lng}`;
  }

  private renderInfoOverlay() {
    const c = this.config;
    if (!c.showInfo) return nothing;

    const hasInfo = c.address || c.phone || c.email || c.hours;
    if (!hasInfo) return nothing;

    return html`
      <div class="map-info-overlay">
        ${c.address ? html`
          <div class="info-row">
            <span class="info-icon">\u{1F4CD}</span>
            <span>${c.address}</span>
          </div>
        ` : ''}
        ${c.phone ? html`
          <div class="info-row">
            <span class="info-icon">\u{1F4DE}</span>
            <a href="tel:${c.phone}">${c.phone}</a>
          </div>
        ` : ''}
        ${c.email ? html`
          <div class="info-row">
            <span class="info-icon">\u{2709}</span>
            <a href="mailto:${c.email}">${c.email}</a>
          </div>
        ` : ''}
        ${c.hours ? html`
          <div class="info-row">
            <span class="info-icon">\u{1F552}</span>
            <span>${c.hours}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const embedUrl = this.buildEmbedUrl();
    const mapHeight = c.height ?? '400px';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline ? html`
            <div class="zl-section-header">
              <h2 class="zl-section-headline">${c.headline}</h2>
            </div>
          ` : ''}
          <div class="map-wrapper">
            ${embedUrl ? html`
              <iframe
                class="map-iframe"
                src="${embedUrl}"
                style="height:${mapHeight}"
                loading="lazy"
                referrerpolicy="no-referrer"
                title="${c.address ?? 'Map'}"
              ></iframe>
            ` : c.address ? html`
              <div class="map-address-fallback" style="min-height:${mapHeight}">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}"
                   target="_blank" rel="noopener noreferrer">
                  ${c.address}
                </a>
              </div>
            ` : nothing}
            ${this.renderInfoOverlay()}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-map': ZsSectionMap; } }
