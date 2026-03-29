// @zentto/studio — DataGrid field (embeds <zentto-grid> via dynamic import)
// Renders a real ZenttoDataGrid inside the studio form

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface ColumnDef {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  type?: string;
  align?: 'left' | 'center' | 'right';
  format?: string;
  hidden?: boolean;
}

interface FieldConfig {
  id: string;
  type: string;
  field: string;
  label?: string;
  props?: Record<string, unknown>;
}

@customElement('zs-field-datagrid')
export class ZsFieldDatagrid extends LitElement {
  static styles = css`
    :host { display: block; }

    .zs-datagrid-wrapper {
      font-family: var(--zs-font-family, sans-serif);
      border: 1px solid var(--zs-border, #dee2e6);
      border-radius: var(--zs-radius, 6px);
      overflow: hidden;
      background: var(--zs-bg, #fff);
    }

    .zs-datagrid-label {
      font-size: var(--zs-font-size, 14px);
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--zs-text, #212529);
    }

    .zs-datagrid-loading,
    .zs-datagrid-error {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: var(--zs-text-secondary, #6c757d);
      font-size: var(--zs-font-size-sm, 13px);
    }

    .zs-datagrid-error {
      color: var(--zs-danger, #dc3545);
    }

    .zs-datagrid-container {
      width: 100%;
    }
  `;

  // ─── Properties ──────────────────────────────────────────────

  @property({ type: Object }) config: FieldConfig | null = null;
  @property({ type: Array }) rows: unknown[] = [];
  @property({ type: String }) theme: 'light' | 'dark' = 'light';

  // ─── Internal State ──────────────────────────────────────────

  @state() private gridLoaded = false;
  @state() private loadError = '';
  @state() private loading = true;

  // ─── Resolved props from config ──────────────────────────────

  private get columns(): ColumnDef[] {
    const configured = (this.config?.props?.columns as ColumnDef[]) ?? [];
    return configured.length > 0 ? configured : this.autoColumns;
  }

  private get gridHeight(): string {
    return (this.config?.props?.height as string) ?? '400px';
  }

  private get enableToolbar(): boolean {
    return (this.config?.props?.enableToolbar as boolean) ?? true;
  }

  private get enableSearch(): boolean {
    return (this.config?.props?.enableSearch as boolean) ?? true;
  }

  private get enablePagination(): boolean {
    return (this.config?.props?.enablePagination as boolean) ?? true;
  }

  private get pageSize(): number {
    return (this.config?.props?.pageSize as number) ?? 25;
  }

  private get density(): 'compact' | 'standard' | 'comfortable' {
    return (this.config?.props?.density as 'compact' | 'standard' | 'comfortable') ?? 'compact';
  }

  private get enableHeaderFilters(): boolean {
    return (this.config?.props?.enableHeaderFilters as boolean) ?? false;
  }

  private get enableExport(): boolean {
    return (this.config?.props?.enableExport as boolean) ?? false;
  }

  private get onRowClick(): 'navigate' | 'select' | 'detail' | 'emit' {
    return (this.config?.props?.onRowClick as 'navigate' | 'select' | 'detail' | 'emit') ?? 'emit';
  }

  private get dataSourceId(): string {
    return (this.config?.props?.dataSourceId as string) ?? '';
  }

  private get gridRows(): unknown[] {
    // Priority: explicit rows > fetched rows > config.props.rows
    if (this.rows.length > 0) return this.rows;
    if (this.fetchedRows.length > 0) return this.fetchedRows;
    return (this.config?.props?.rows as unknown[]) ?? [];
  }

  @property({ type: String }) endpoint = '';
  @property({ type: String }) authToken = '';
  @property({ type: Object }) authHeaders: Record<string, string> = {};

  @state() private fetchedRows: unknown[] = [];
  @state() private autoColumns: ColumnDef[] = [];

  // ─── Lifecycle ───────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this.loadGrid();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config') || changed.has('endpoint')) {
      const ep = this.endpoint || (this.config?.props?.endpoint as string) || '';
      if (ep && this.gridLoaded) this.fetchData(ep);
    }
  }

  private async loadGrid() {
    if (this.gridLoaded) return;

    this.loading = true;
    this.loadError = '';

    try {
      // @ts-ignore — optional peer dependency, loaded at runtime
      await import('@zentto/datagrid');
      this.gridLoaded = true;

      // Auto-fetch if endpoint configured
      const ep = this.endpoint || (this.config?.props?.endpoint as string) || '';
      if (ep) await this.fetchData(ep);
    } catch (err) {
      this.loadError = `Failed to load @zentto/datagrid: ${err instanceof Error ? err.message : String(err)}`;
      console.warn('[zs-field-datagrid]', this.loadError);
    } finally {
      this.loading = false;
    }
  }

  /** Fetch data from endpoint and auto-generate columns */
  private async fetchData(endpoint: string) {
    try {
      const url = endpoint.startsWith('http') ? endpoint : endpoint;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.authHeaders,
      };
      if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      let data = await res.json();

      // Unwrap common response wrappers
      if (data && !Array.isArray(data)) {
        if (Array.isArray(data.data)) data = data.data;
        else if (Array.isArray(data.rows)) data = data.rows;
        else if (Array.isArray(data.items)) data = data.items;
        else if (Array.isArray(data.results)) data = data.results;
      }

      if (Array.isArray(data)) {
        this.fetchedRows = data;

        // Auto-generate columns if none configured
        if (this.columns.length === 0 && data.length > 0) {
          const sample = data[0] as Record<string, unknown>;
          this.autoColumns = Object.keys(sample)
            .filter(k => !k.startsWith('_'))
            .map(k => ({
              field: k,
              headerName: k.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim(),
              width: this.guessColumnWidth(k, sample[k]),
              sortable: true,
              type: this.guessColumnType(k, sample[k]),
            }));
        }
      }
    } catch (err) {
      console.warn('[zs-field-datagrid] fetch error:', err);
    }
  }

  private guessColumnWidth(key: string, value: unknown): number {
    if (typeof value === 'boolean') return 80;
    if (typeof value === 'number') return 100;
    const str = String(value ?? '');
    if (str.length > 50) return 250;
    if (str.length > 20) return 180;
    return 140;
  }

  private guessColumnType(key: string, value: unknown): string {
    const lower = key.toLowerCase();
    if (typeof value === 'number' || lower.includes('precio') || lower.includes('total') || lower.includes('saldo') || lower.includes('monto')) return 'number';
    if (typeof value === 'boolean' || lower.includes('activ') || lower.includes('active')) return 'boolean';
    if (lower.includes('fecha') || lower.includes('date')) return 'date';
    return 'text';
  }

  // ─── Event Handling ──────────────────────────────────────────

  private handleRowClick(e: Event) {
    const detail = (e as CustomEvent).detail;

    this.dispatchEvent(new CustomEvent('field-action', {
      detail: {
        fieldId: this.config?.id,
        action: this.onRowClick,
        row: detail?.row ?? detail,
      },
      bubbles: true,
      composed: true,
    }));
  }

  private handleSelectionChange(e: Event) {
    const detail = (e as CustomEvent).detail;

    this.dispatchEvent(new CustomEvent('field-change', {
      detail: {
        fieldId: this.config?.id,
        value: detail?.selectedRows ?? detail?.selection ?? detail,
      },
      bubbles: true,
      composed: true,
    }));
  }

  // ─── Render ──────────────────────────────────────────────────

  render() {
    const label = this.config?.label;

    return html`
      ${label ? html`<div class="zs-datagrid-label">${label}</div>` : nothing}
      <div class="zs-datagrid-wrapper">
        ${this.loading
          ? html`<div class="zs-datagrid-loading">Loading DataGrid...</div>`
          : this.loadError
            ? html`<div class="zs-datagrid-error">${this.loadError}</div>`
            : this.renderGrid()}
      </div>
    `;
  }

  private renderGrid() {
    if (!this.gridLoaded) return nothing;

    return html`
      <div class="zs-datagrid-container" style="height: ${this.gridHeight}">
        <zentto-grid
          .columns="${this.columns}"
          .rows="${this.gridRows}"
          .dataSourceId="${this.dataSourceId}"
          .theme="${this.theme}"
          .density="${this.density}"
          .pageSize="${this.pageSize}"
          ?enableToolbar="${this.enableToolbar}"
          ?enableSearch="${this.enableSearch}"
          ?enablePagination="${this.enablePagination}"
          ?enableHeaderFilters="${this.enableHeaderFilters}"
          ?enableExport="${this.enableExport}"
          enable-configurator
          @row-click="${this.handleRowClick}"
          @selection-change="${this.handleSelectionChange}"
        ></zentto-grid>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-datagrid': ZsFieldDatagrid;
  }
}
