// @zentto/studio — Comparison table section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { ComparisonSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-comparison')
export class ZsSectionComparison extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    .comparison-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 500px;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 14px 20px;
      text-align: center;
      font-size: var(--zl-body-font-size);
      border-bottom: 1px solid var(--zl-border);
    }

    .comparison-table th {
      font-family: var(--zl-heading-font-family);
      font-weight: 700;
      font-size: 15px;
      color: var(--zl-text);
      background: var(--zl-bg-alt);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .comparison-table th:first-child,
    .comparison-table td:first-child {
      text-align: left;
      font-weight: 600;
      color: var(--zl-text);
      position: sticky;
      left: 0;
      background: var(--zl-bg);
      z-index: 2;
    }

    .comparison-table th:first-child {
      background: var(--zl-bg-alt);
      z-index: 3;
    }

    /* Zebra striping */
    .comparison-table tbody tr:nth-child(even) td {
      background: var(--zl-bg-alt);
    }
    .comparison-table tbody tr:nth-child(even) td:first-child {
      background: var(--zl-bg-alt);
    }

    /* Highlighted column */
    .col-highlighted {
      background: color-mix(in srgb, var(--zl-primary) 6%, transparent) !important;
      border-left: 2px solid var(--zl-primary);
      border-right: 2px solid var(--zl-primary);
    }

    th.col-highlighted {
      background: color-mix(in srgb, var(--zl-primary) 12%, var(--zl-bg-alt)) !important;
      color: var(--zl-primary);
    }

    /* First row of highlighted column — top border */
    thead th.col-highlighted {
      border-top: 2px solid var(--zl-primary);
      border-radius: var(--zl-radius) var(--zl-radius) 0 0;
    }

    /* Last row of highlighted column — bottom border */
    tbody tr:last-child td.col-highlighted {
      border-bottom: 2px solid var(--zl-primary);
    }

    .check {
      color: var(--zl-primary);
      font-size: 18px;
      font-weight: 700;
    }

    .cross {
      color: var(--zl-text-secondary);
      opacity: 0.4;
      font-size: 18px;
    }

    .value-text {
      color: var(--zl-text-secondary);
      font-size: var(--zl-small-font-size);
    }

    @media (max-width: 768px) {
      .comparison-table th,
      .comparison-table td {
        padding: 10px 14px;
        font-size: var(--zl-small-font-size);
      }
    }
  `];

  @property({ type: Object }) config!: ComparisonSectionConfig;

  private renderValue(val: string, highlighted: boolean) {
    if (val === 'true') {
      return html`<span class="check">&#x2713;</span>`;
    }
    if (val === 'false') {
      return html`<span class="cross">&#x2717;</span>`;
    }
    return html`<span class="value-text">${val}</span>`;
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

          <div class="comparison-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th></th>
                  ${c.columns.map(col => html`
                    <th class="${col.highlighted ? 'col-highlighted' : ''}">${col.name}</th>
                  `)}
                </tr>
              </thead>
              <tbody>
                ${c.rows.map(row => html`
                  <tr>
                    <td>${row.feature}</td>
                    ${row.values.map((val, i) => html`
                      <td class="${c.columns[i]?.highlighted ? 'col-highlighted' : ''}">
                        ${this.renderValue(val, c.columns[i]?.highlighted ?? false)}
                      </td>
                    `)}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-comparison': ZsSectionComparison; } }
