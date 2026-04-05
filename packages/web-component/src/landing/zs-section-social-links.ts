// @zentto/studio — Social Links section component

import { LitElement, html, css, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import { getSocialIcon } from '@zentto/studio-core';
import type { SocialLinksSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-social-links')
export class ZsSectionSocialLinks extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .social-links-list {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 24px;
    }

    .social-links-list--vertical {
      flex-direction: column;
    }

    .social-links-list--grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      justify-items: center;
      gap: 24px;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--zl-bg-alt);
      padding: 12px;
      transition: all var(--zl-transition);
      text-decoration: none;
      color: var(--zl-text-secondary);
    }

    .social-link:hover {
      transform: scale(1.15);
      box-shadow: var(--zl-shadow-lg);
    }

    .social-link--brand:hover {
      color: #fff;
    }

    .social-link--mono {
      color: var(--zl-text-secondary);
    }

    .social-link--mono:hover {
      background: var(--zl-text);
      color: var(--zl-bg);
    }

    .social-link svg {
      display: block;
      fill: currentColor;
    }

    .social-label {
      display: block;
      margin-top: 8px;
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      text-align: center;
    }

    .social-link-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @media (max-width: 480px) {
      .social-links-list {
        gap: 16px;
      }
      .social-link {
        padding: 10px;
      }
    }
  `];

  @property({ type: Object }) config!: SocialLinksSectionConfig;

  private renderIcon(network: string, size: number) {
    const icon = getSocialIcon(network);
    if (!icon) return nothing;

    return svg`
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="${icon.viewBox}"
           width="${size}" height="${size}"
           aria-hidden="true">
        ${icon.paths.map(p => svg`<path d="${p}" />`)}
      </svg>
    `;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const variant = c.variant ?? 'horizontal';
    const size = c.iconSize ?? 32;
    const colorMode = c.colorMode ?? 'brand';

    const listClass = variant === 'vertical'
      ? 'social-links-list social-links-list--vertical'
      : variant === 'grid'
        ? 'social-links-list social-links-list--grid'
        : 'social-links-list';

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          <div class="${listClass}">
            ${c.links.map(link => {
              const icon = getSocialIcon(link.network);
              const brandColor = icon?.brandColor ?? '';

              // Determine color and hover styles based on colorMode
              let linkStyle = '';
              let linkClass = 'social-link';
              if (colorMode === 'brand' && brandColor) {
                linkStyle = `color:${brandColor}`;
                linkClass += ' social-link--brand';
              } else if (colorMode === 'custom' && c.customColor) {
                linkStyle = `color:${c.customColor}`;
                linkClass += ' social-link--brand';
              } else {
                linkClass += ' social-link--mono';
              }

              // For brand mode, set hover bg to brand color via inline style
              const hoverBg = colorMode === 'brand' && brandColor ? brandColor
                : colorMode === 'custom' && c.customColor ? c.customColor
                : '';

              return html`
                <div class="social-link-wrapper">
                  <a class="${linkClass}"
                     href="${link.url}"
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="${link.label ?? link.network}"
                     style="${linkStyle}"
                     @mouseenter="${hoverBg ? (e: MouseEvent) => {
                       (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg;
                       (e.currentTarget as HTMLElement).style.color = '#fff';
                     } : nothing}"
                     @mouseleave="${hoverBg ? (e: MouseEvent) => {
                       (e.currentTarget as HTMLElement).style.backgroundColor = '';
                       (e.currentTarget as HTMLElement).style.color = colorMode === 'brand' && brandColor ? brandColor : (c.customColor ?? '');
                     } : nothing}"
                  >
                    ${this.renderIcon(link.network, size)}
                  </a>
                  ${link.label ? html`<span class="social-label">${link.label}</span>` : ''}
                </div>
              `;
            })}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-social-links': ZsSectionSocialLinks; } }
