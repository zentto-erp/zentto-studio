// @zentto/studio — Team section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { TeamSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-team')
export class ZsSectionTeam extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .team-grid {
      display: grid;
      gap: 32px;
    }

    .team-grid--2 { grid-template-columns: repeat(2, 1fr); }
    .team-grid--3 { grid-template-columns: repeat(3, 1fr); }
    .team-grid--4 { grid-template-columns: repeat(4, 1fr); }

    .team-card {
      text-align: center;
      padding: 32px 24px;
      border-radius: var(--zl-radius-lg);
      background: var(--zl-bg);
      border: 1px solid var(--zl-border);
      transition: all var(--zl-transition);
    }

    .team-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--zl-shadow-lg);
      border-color: var(--zl-primary-light);
    }

    .team-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 16px;
      border: 3px solid var(--zl-bg-alt);
    }

    .team-avatar-placeholder {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--zl-primary-light);
      color: var(--zl-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-weight: 700;
      font-size: 28px;
    }

    .team-name {
      font-family: var(--zl-heading-font-family);
      font-size: 18px;
      font-weight: 600;
      color: var(--zl-text);
      margin-bottom: 4px;
    }

    .team-role {
      font-size: var(--zl-small-font-size);
      color: var(--zl-primary);
      font-weight: 500;
      margin-bottom: 12px;
    }

    .team-bio {
      font-size: var(--zl-small-font-size);
      color: var(--zl-text-secondary);
      line-height: var(--zl-line-height);
      margin-bottom: 16px;
    }

    .team-social {
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .team-social-link {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--zl-bg-alt);
      color: var(--zl-text-secondary);
      font-size: 14px;
      transition: all var(--zl-transition);
      text-decoration: none;
    }

    .team-social-link:hover {
      background: var(--zl-primary);
      color: #fff;
    }

    @media (max-width: 768px) {
      .team-grid--3,
      .team-grid--4 { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .team-grid--2,
      .team-grid--3,
      .team-grid--4 { grid-template-columns: 1fr; }
    }
  `];

  @property({ type: Object }) config!: TeamSectionConfig;

  private renderIcon(icon: string) {
    if (icon.startsWith('<')) return unsafeHTML(icon);
    return icon;
  }

  render() {
    const c = this.config;
    if (!c) return nothing;

    const cols = c.columns ?? 3;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline || c.subtitle ? html`
            <div class="zl-section-header">
              ${c.headline ? html`<h2 class="zl-section-headline">${c.headline}</h2>` : ''}
              ${c.subtitle ? html`<p class="zl-section-subtitle">${c.subtitle}</p>` : ''}
            </div>
          ` : ''}
          <div class="team-grid team-grid--${cols}">
            ${c.members.map(member => html`
              <div class="team-card">
                ${member.avatar
                  ? html`<img class="team-avatar" src="${member.avatar}" alt="${member.name}" loading="lazy" />`
                  : html`<div class="team-avatar-placeholder">${member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>`
                }
                <div class="team-name">${member.name}</div>
                <div class="team-role">${member.role}</div>
                ${member.bio ? html`<div class="team-bio">${member.bio}</div>` : ''}
                ${member.social?.length ? html`
                  <div class="team-social">
                    ${member.social.map(s => html`
                      <a class="team-social-link" href="${s.url}" target="_blank" rel="noopener noreferrer"
                         aria-label="${s.icon}">${this.renderIcon(s.icon)}</a>
                    `)}
                  </div>
                ` : ''}
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-team': ZsSectionTeam; } }
