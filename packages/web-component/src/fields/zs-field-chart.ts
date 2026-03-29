// @zentto/studio — Inline SVG chart field
// Renders bar, line, pie, donut charts from data

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = [
  '#e67e22', '#3498db', '#27ae60', '#e74c3c', '#9b59b6',
  '#f39c12', '#1abc9c', '#34495e', '#e91e63', '#00bcd4',
];

@customElement('zs-field-chart')
export class ZsFieldChart extends LitElement {
  static styles = css`
    :host { display: block; }
    .zs-chart-wrapper {
      font-family: var(--zs-font-family, sans-serif);
    }
    .zs-chart-title {
      font-size: var(--zs-font-size, 14px);
      font-weight: 600; margin-bottom: 8px;
      color: var(--zs-text, #212529);
    }
    svg { width: 100%; height: auto; }
    .zs-chart-legend {
      display: flex; flex-wrap: wrap; gap: 12px;
      margin-top: 8px; font-size: 12px;
    }
    .zs-chart-legend-item { display: flex; align-items: center; gap: 4px; }
    .zs-chart-legend-dot {
      width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    }
    .zs-chart-legend-label { color: var(--zs-text-secondary, #6c757d); }
  `;

  @property() label = '';
  @property() chartType: 'bar' | 'line' | 'pie' | 'donut' = 'bar';
  @property({ type: Array }) data: ChartDataPoint[] = [];
  @property({ type: Number }) width = 400;
  @property({ type: Number }) height = 250;

  render() {
    return html`
      <div class="zs-chart-wrapper">
        ${this.label ? html`<div class="zs-chart-title">${this.label}</div>` : ''}
        ${this.chartType === 'bar' ? this.renderBar() :
          this.chartType === 'line' ? this.renderLine() :
          this.chartType === 'pie' || this.chartType === 'donut' ? this.renderPie() :
          this.renderBar()}
        ${this.renderLegend()}
      </div>
    `;
  }

  private color(i: number): string {
    return this.data[i]?.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
  }

  private renderBar() {
    if (this.data.length === 0) return html``;
    const maxVal = Math.max(...this.data.map(d => d.value), 1);
    const barW = Math.max(20, (this.width - 60) / this.data.length - 8);
    const chartH = this.height - 40;

    return html`
      <svg viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Axis -->
        <line x1="40" y1="10" x2="40" y2="${chartH + 10}" stroke="#dee2e6" stroke-width="1"/>
        <line x1="40" y1="${chartH + 10}" x2="${this.width - 10}" y2="${chartH + 10}" stroke="#dee2e6" stroke-width="1"/>
        ${this.data.map((d, i) => {
          const barH = (d.value / maxVal) * chartH;
          const x = 50 + i * (barW + 8);
          const y = chartH + 10 - barH;
          return html`
            <rect x="${x}" y="${y}" width="${barW}" height="${barH}"
              fill="${this.color(i)}" rx="3" opacity="0.85">
              <title>${d.label}: ${d.value}</title>
            </rect>
            <text x="${x + barW / 2}" y="${chartH + 25}" text-anchor="middle"
              font-size="10" fill="#6c757d">${d.label.slice(0, 8)}</text>
          `;
        })}
      </svg>
    `;
  }

  private renderLine() {
    if (this.data.length === 0) return html``;
    const maxVal = Math.max(...this.data.map(d => d.value), 1);
    const chartH = this.height - 40;
    const chartW = this.width - 60;
    const step = chartW / Math.max(this.data.length - 1, 1);

    const points = this.data.map((d, i) => {
      const x = 50 + i * step;
      const y = chartH + 10 - (d.value / maxVal) * chartH;
      return `${x},${y}`;
    }).join(' ');

    return html`
      <svg viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="10" x2="40" y2="${chartH + 10}" stroke="#dee2e6" stroke-width="1"/>
        <line x1="40" y1="${chartH + 10}" x2="${this.width - 10}" y2="${chartH + 10}" stroke="#dee2e6" stroke-width="1"/>
        <polyline points="${points}" fill="none" stroke="${this.color(0)}" stroke-width="2.5" stroke-linejoin="round"/>
        ${this.data.map((d, i) => {
          const x = 50 + i * step;
          const y = chartH + 10 - (d.value / maxVal) * chartH;
          return html`
            <circle cx="${x}" cy="${y}" r="4" fill="${this.color(0)}" stroke="white" stroke-width="2">
              <title>${d.label}: ${d.value}</title>
            </circle>
            <text x="${x}" y="${chartH + 25}" text-anchor="middle" font-size="10" fill="#6c757d">${d.label.slice(0, 8)}</text>
          `;
        })}
      </svg>
    `;
  }

  private renderPie() {
    const total = this.data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return html``;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const r = Math.min(cx, cy) - 20;
    const innerR = this.chartType === 'donut' ? r * 0.55 : 0;

    let startAngle = -Math.PI / 2;
    const slices = this.data.map((d, i) => {
      const angle = (d.value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const largeArc = angle > Math.PI ? 1 : 0;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      let path: string;
      if (innerR > 0) {
        const ix1 = cx + innerR * Math.cos(startAngle);
        const iy1 = cy + innerR * Math.sin(startAngle);
        const ix2 = cx + innerR * Math.cos(endAngle);
        const iy2 = cy + innerR * Math.sin(endAngle);
        path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      } else {
        path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }

      startAngle = endAngle;
      return html`
        <path d="${path}" fill="${this.color(i)}" opacity="0.85">
          <title>${d.label}: ${d.value} (${((d.value / total) * 100).toFixed(1)}%)</title>
        </path>
      `;
    });

    return html`
      <svg viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
        ${slices}
      </svg>
    `;
  }

  private renderLegend() {
    if (this.data.length === 0) return html``;
    return html`
      <div class="zs-chart-legend">
        ${this.data.map((d, i) => html`
          <div class="zs-chart-legend-item">
            <span class="zs-chart-legend-dot" style="background:${this.color(i)}"></span>
            <span class="zs-chart-legend-label">${d.label}</span>
          </div>
        `)}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-chart': ZsFieldChart; } }
