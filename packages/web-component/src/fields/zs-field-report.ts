// @zentto/studio — Report viewer field (embeds <zentto-report-viewer> via dynamic import)
// Renders a real Zentto Report Viewer inside the studio form

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface FieldConfig {
  id: string;
  type: string;
  field: string;
  label?: string;
  props?: Record<string, unknown>;
}

@customElement('zs-field-report')
export class ZsFieldReport extends LitElement {
  static styles = css`
    :host { display: block; }

    .zs-report-wrapper {
      font-family: var(--zs-font-family, sans-serif);
      border: 1px solid var(--zs-border, #dee2e6);
      border-radius: var(--zs-radius, 6px);
      overflow: auto;
      background: var(--zs-bg, #fff);
    }

    .zs-report-label {
      font-size: var(--zs-font-size, 14px);
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--zs-text, #212529);
    }

    .zs-report-loading,
    .zs-report-error {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: var(--zs-text-secondary, #6c757d);
      font-size: var(--zs-font-size-sm, 13px);
    }

    .zs-report-error {
      color: var(--zs-danger, #dc3545);
    }

    .zs-report-container {
      width: 100%;
    }
  `;

  // ─── Properties ──────────────────────────────────────────────

  @property({ type: Object }) config: FieldConfig | null = null;
  @property({ type: Object }) template: unknown = null;
  @property({ type: Object }) data: unknown = null;
  @property({ type: String }) theme: 'light' | 'dark' = 'light';

  // ─── Internal State ──────────────────────────────────────────

  @state() private viewerLoaded = false;
  @state() private loadError = '';
  @state() private loading = true;

  // ─── Resolved props from config ──────────────────────────────

  private get templateId(): string {
    return (this.config?.props?.templateId as string) ?? '';
  }

  private get reportTemplate(): unknown {
    // Direct property takes precedence over config
    if (this.template) return this.template;
    return this.config?.props?.template ?? null;
  }

  private get reportData(): unknown {
    // Direct property takes precedence over config
    if (this.data) return this.data;
    return this.config?.props?.data ?? null;
  }

  private get dataSourceId(): string {
    return (this.config?.props?.dataSourceId as string) ?? '';
  }

  private get viewerHeight(): string {
    return (this.config?.props?.height as string) ?? '500px';
  }

  private get showToolbar(): boolean {
    return (this.config?.props?.showToolbar as boolean) ?? true;
  }

  private get zoom(): number {
    return (this.config?.props?.zoom as number) ?? 1;
  }

  // ─── Lifecycle ───────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this.loadViewer();
  }

  private async loadViewer() {
    if (this.viewerLoaded) return;

    this.loading = true;
    this.loadError = '';

    try {
      // @ts-ignore — optional peer dependency, loaded at runtime
      await import('@zentto/report-viewer');
      this.viewerLoaded = true;
    } catch (err) {
      this.loadError = `Failed to load @zentto/report-viewer: ${err instanceof Error ? err.message : String(err)}`;
      console.warn('[zs-field-report]', this.loadError);
    } finally {
      this.loading = false;
    }
  }

  // ─── Render ──────────────────────────────────────────────────

  render() {
    const label = this.config?.label;

    return html`
      ${label ? html`<div class="zs-report-label">${label}</div>` : nothing}
      <div class="zs-report-wrapper">
        ${this.loading
          ? html`<div class="zs-report-loading">Loading Report Viewer...</div>`
          : this.loadError
            ? html`<div class="zs-report-error">${this.loadError}</div>`
            : this.renderViewer()}
      </div>
    `;
  }

  private renderViewer() {
    if (!this.viewerLoaded) return nothing;

    return html`
      <div class="zs-report-container" style="height: ${this.viewerHeight}">
        <zentto-report-viewer
          .templateId="${this.templateId}"
          .template="${this.reportTemplate}"
          .data="${this.reportData}"
          .dataSourceId="${this.dataSourceId}"
          .theme="${this.theme}"
          .zoom="${this.zoom}"
          ?showToolbar="${this.showToolbar}"
        ></zentto-report-viewer>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-report': ZsFieldReport;
  }
}
