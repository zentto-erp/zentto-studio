// @zentto/studio-core — Field type registry
// Maps FieldType to web component tag name and metadata

import type { FieldRendererMeta, FieldType } from '../types.js';

const registry = new Map<FieldType, FieldRendererMeta>();

/** Register a field renderer for a given type */
export function registerField(meta: FieldRendererMeta): void {
  registry.set(meta.type, meta);
}

/** Get renderer metadata for a field type */
export function getFieldMeta(type: FieldType): FieldRendererMeta | undefined {
  return registry.get(type);
}

/** Get the web component tag name for a field type */
export function getFieldTag(type: FieldType): string {
  return registry.get(type)?.tagName ?? `zs-field-${type}`;
}

/** Get all registered field types */
export function getAllFields(): FieldRendererMeta[] {
  return Array.from(registry.values());
}

/** Get fields by category */
export function getFieldsByCategory(category: string): FieldRendererMeta[] {
  return Array.from(registry.values()).filter(m => m.category === category);
}

// ─── Default Registrations ────────────────────────────────────────

const defaults: FieldRendererMeta[] = [
  // ─── Basic ────────────────────────────────────
  { type: 'text', tagName: 'zs-field-text', label: 'Texto', icon: 'Aa', category: 'basic' },
  { type: 'textarea', tagName: 'zs-field-text', label: 'Area Texto', icon: '¶', category: 'basic' },
  { type: 'number', tagName: 'zs-field-number', label: 'Numero', icon: '#', category: 'basic' },
  { type: 'currency', tagName: 'zs-field-number', label: 'Moneda', icon: '$', category: 'basic',
    defaultProps: { isCurrency: true } },
  { type: 'percentage', tagName: 'zs-field-number', label: 'Porcentaje', icon: '%', category: 'basic',
    defaultProps: { isPercentage: true } },
  { type: 'date', tagName: 'zs-field-date', label: 'Fecha', icon: '📅', category: 'basic' },
  { type: 'time', tagName: 'zs-field-date', label: 'Hora', icon: '🕐', category: 'basic',
    defaultProps: { mode: 'time' } },
  { type: 'datetime', tagName: 'zs-field-date', label: 'Fecha/Hora', icon: '📆', category: 'basic',
    defaultProps: { mode: 'datetime' } },
  { type: 'select', tagName: 'zs-field-select', label: 'Select', icon: '▾', category: 'basic' },
  { type: 'multiselect', tagName: 'zs-field-select', label: 'Multi-Select', icon: '☰', category: 'basic',
    defaultProps: { multiple: true } },
  { type: 'radio', tagName: 'zs-field-checkbox', label: 'Radio', icon: '◉', category: 'basic',
    defaultProps: { mode: 'radio' } },
  { type: 'checkbox', tagName: 'zs-field-checkbox', label: 'Checkbox', icon: '☑', category: 'basic' },
  { type: 'switch', tagName: 'zs-field-switch', label: 'Switch', icon: '⬤', category: 'basic' },
  { type: 'email', tagName: 'zs-field-text', label: 'Email', icon: '@', category: 'basic',
    defaultProps: { inputType: 'email' },
    defaultValidation: [{ type: 'email', message: 'Email invalido' }] },
  { type: 'url', tagName: 'zs-field-text', label: 'URL', icon: '🔗', category: 'basic',
    defaultProps: { inputType: 'url' },
    defaultValidation: [{ type: 'url', message: 'URL invalida' }] },
  { type: 'password', tagName: 'zs-field-text', label: 'Password', icon: '🔒', category: 'basic',
    defaultProps: { inputType: 'password' } },
  { type: 'phone', tagName: 'zs-field-text', label: 'Telefono', icon: '📱', category: 'basic',
    defaultProps: { inputType: 'tel' } },
  // ─── Advanced ─────────────────────────────────
  { type: 'color', tagName: 'zs-field-text', label: 'Color', icon: '🎨', category: 'advanced',
    defaultProps: { inputType: 'color' } },
  { type: 'richtext', tagName: 'zs-field-richtext', label: 'Rich Text', icon: '📝', category: 'advanced' },
  { type: 'code', tagName: 'zs-field-code', label: 'Codigo', icon: '⌨', category: 'advanced' },
  { type: 'signature', tagName: 'zs-field-signature', label: 'Firma', icon: '✍', category: 'advanced' },
  { type: 'slider', tagName: 'zs-field-number', label: 'Slider', icon: '◧', category: 'advanced',
    defaultProps: { mode: 'slider' } },
  { type: 'rating', tagName: 'zs-field-number', label: 'Rating', icon: '⭐', category: 'advanced',
    defaultProps: { mode: 'rating' } },
  { type: 'tags', tagName: 'zs-field-select', label: 'Tags', icon: '🏷', category: 'advanced',
    defaultProps: { mode: 'tags' } },
  { type: 'chips', tagName: 'zs-field-chips', label: 'Chips', icon: '◔', category: 'advanced' },
  { type: 'address', tagName: 'zs-field-address', label: 'Direccion', icon: '📍', category: 'advanced' },
  { type: 'qr-scanner', tagName: 'zs-field-text', label: 'QR', icon: '⊞', category: 'advanced',
    defaultProps: { inputType: 'text', placeholder: 'Escanear QR...' } },
  { type: 'barcode-scanner', tagName: 'zs-field-text', label: 'Barcode', icon: '⊟', category: 'advanced',
    defaultProps: { inputType: 'text', placeholder: 'Escanear codigo...' } },
  // ─── Data ─────────────────────────────────────
  { type: 'lookup', tagName: 'zs-field-lookup', label: 'Lookup', icon: '🔍', category: 'data' },
  { type: 'datagrid', tagName: 'zs-field-datagrid', label: 'DataGrid', icon: '◫', category: 'data',
    defaultProps: {
      endpoint: '', columns: [], height: '400px', pageSize: 25,
      density: 'compact', onRowClick: 'emit', rowClickSegment: '',
      enableToolbar: true, enableSearch: true, enableExport: false,
      enablePagination: true, enableHeaderFilters: false, enableClipboard: false,
      enableRowSelection: false, enableMasterDetail: false, showTotals: false,
      enableContextMenu: false, enableFind: false, enableStatusBar: false,
      enableFilterPanel: false, enableConfigurator: true,
      defaultCurrency: '', exportFilename: '', gridId: '',
      gridLayout: null, columnWidths: null, columnVisibility: null, sorts: null,
    },
  },
  { type: 'report', tagName: 'zs-field-report', label: 'Reporte', icon: '📋', category: 'data',
    defaultProps: {
      templateId: '', height: '500px', zoom: 100,
      showToolbar: true, showPrint: true, showExportPdf: true, showNavigation: true,
    },
  },
  { type: 'chart', tagName: 'zs-field-chart', label: 'Grafico', icon: '📊', category: 'data',
    defaultProps: {
      chartType: 'bar', chartTitle: '', labelField: '', valueField: '',
      width: 400, height: 250, showLegend: true, animated: false,
    },
  },
  { type: 'treeview', tagName: 'zs-field-treeview', label: 'TreeView', icon: '🌳', category: 'data' },
  // ─── Media ────────────────────────────────────
  { type: 'file', tagName: 'zs-field-file', label: 'Archivo', icon: '📁', category: 'media' },
  { type: 'image', tagName: 'zs-field-file', label: 'Imagen', icon: '🖼', category: 'media',
    defaultProps: { accept: 'image/*' } },
  { type: 'media', tagName: 'zs-field-media', label: 'Media', icon: '▶', category: 'media' },
  // ─── Layout ───────────────────────────────────
  { type: 'button', tagName: 'zs-field-button', label: 'Boton', icon: '▣', category: 'layout',
    defaultProps: {
      buttonLabel: 'Accion', variant: 'primary', size: 'medium',
      actionType: 'custom', actionUrl: '', actionMethod: 'POST',
      navigateTo: '', eventName: '', confirmMessage: '',
      successMessage: 'Operacion exitosa', errorMessage: 'Error en la operacion',
      disabled: false, disabledRule: '', fullWidth: false, icon: '',
    },
  },
  { type: 'link', tagName: 'zs-field-button', label: 'Enlace', icon: '🔗', category: 'layout',
    defaultProps: { buttonLabel: 'Ver mas', variant: 'ghost', actionType: 'navigate', navigateTo: '/' },
  },
  { type: 'spacer', tagName: 'zs-field-separator', label: 'Espacio', icon: '⬜', category: 'layout',
    defaultProps: { height: '24px' },
  },
  { type: 'icon', tagName: 'zs-field-heading', label: 'Icono', icon: '★', category: 'layout',
    defaultProps: { level: 'icon', iconName: '★', iconSize: '32px', iconColor: '#1976d2' },
  },
  { type: 'html', tagName: 'zs-field-html', label: 'HTML', icon: '◇', category: 'layout' },
  { type: 'separator', tagName: 'zs-field-separator', label: 'Separador', icon: '—', category: 'layout' },
  { type: 'heading', tagName: 'zs-field-heading', label: 'Titulo', icon: 'H', category: 'layout' },
  { type: 'alert', tagName: 'zs-field-html', label: 'Alerta', icon: '⚠', category: 'layout',
    defaultProps: {
      content: '<div style="padding:12px 16px;border-radius:6px;background:#fff3e0;border:1px solid #ffe0b2;color:#e65100;font-size:14px;">Mensaje de alerta</div>',
    },
  },
  { type: 'badge', tagName: 'zs-field-heading', label: 'Badge', icon: '●', category: 'layout',
    defaultProps: { level: 'badge', badgeText: 'Nuevo', badgeColor: '#1976d2' },
  },
  { type: 'card', tagName: 'zs-field-html', label: 'Card', icon: '▭', category: 'layout',
    defaultProps: {
      content: '<div style="padding:16px;border:1px solid #e0e0e0;border-radius:8px;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.1);"><h4 style="margin:0 0 8px;">Titulo</h4><p style="margin:0;color:#666;font-size:14px;">Contenido de la card</p></div>',
    },
  },
  { type: 'progress', tagName: 'zs-field-html', label: 'Progreso', icon: '▰', category: 'layout',
    defaultProps: {
      content: '<div style="width:100%;height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden;"><div style="width:60%;height:100%;background:#1976d2;border-radius:4px;"></div></div>',
    },
  },
  { type: 'avatar', tagName: 'zs-field-html', label: 'Avatar', icon: '👤', category: 'layout',
    defaultProps: {
      content: '<div style="width:48px;height:48px;border-radius:50%;background:#1976d2;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;">U</div>',
    },
  },
  // ─── Custom ───────────────────────────────────
  { type: 'custom', tagName: 'zs-field-custom', label: 'Custom', icon: '🧩', category: 'custom' },
];

for (const d of defaults) {
  registerField(d);
}
