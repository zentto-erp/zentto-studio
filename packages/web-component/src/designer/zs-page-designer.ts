// @zentto/studio — Professional Page Designer
// Visual form builder with drag-drop, resize, undo/redo, autosave
// Styled to match @zentto/report-designer (Figma-style properties, Material colors)

import { LitElement, html, css, unsafeCSS, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { StudioSchema, FieldConfig, Section, FieldType, StudioProvider } from '@zentto/studio-core';
import { getAllFields, getFieldsByCategory, resolveIcon } from '@zentto/studio-core';
import type { StudioSchema as SchemaType } from '@zentto/studio-core';

import '../zentto-studio-renderer.js';

// ─── Design tokens (matching report-designer) ─────────────────────

const ACCENT = '#1976d2';
const ACCENT_LIGHT = '#e3f2fd';
const DANGER = '#d32f2f';
const TEXT = '#333';
const TEXT_MUTED = '#888';
const BORDER = '#ddd';
const BG = '#f5f5f5';
const PANEL_BG = '#ffffff';

const FIELD_TYPE_COLORS: Record<string, string> = {
  text: 'background:#e3f2fd;color:#1565c0;',
  textarea: 'background:#e3f2fd;color:#1565c0;',
  number: 'background:#e8f5e9;color:#2e7d32;',
  currency: 'background:#e8f5e9;color:#2e7d32;',
  percentage: 'background:#e8f5e9;color:#2e7d32;',
  select: 'background:#f3e5f5;color:#7b1fa2;',
  multiselect: 'background:#f3e5f5;color:#7b1fa2;',
  date: 'background:#fff3e0;color:#e65100;',
  time: 'background:#fff3e0;color:#e65100;',
  datetime: 'background:#fff3e0;color:#e65100;',
  checkbox: 'background:#fce4ec;color:#c62828;',
  radio: 'background:#fce4ec;color:#c62828;',
  switch: 'background:#fce4ec;color:#c62828;',
  email: 'background:#e0f7fa;color:#00695c;',
  phone: 'background:#e0f7fa;color:#00695c;',
  url: 'background:#e0f7fa;color:#00695c;',
  password: 'background:#eceff1;color:#546e7a;',
  file: 'background:#fff8e1;color:#f57f17;',
  image: 'background:#fff8e1;color:#f57f17;',
  signature: 'background:#ede7f6;color:#4527a0;',
  address: 'background:#e0f2f1;color:#004d40;',
  lookup: 'background:#e8eaf6;color:#283593;',
  chips: 'background:#fce4ec;color:#880e4f;',
  treeview: 'background:#e8f5e9;color:#1b5e20;',
  datagrid: 'background:#e3f2fd;color:#0d47a1;',
  report: 'background:#fff3e0;color:#bf360c;',
  chart: 'background:#f3e5f5;color:#6a1b9a;',
  separator: 'background:#eceff1;color:#546e7a;',
  heading: 'background:#eceff1;color:#37474f;',
  html: 'background:#fff3e0;color:#e65100;',
  rating: 'background:#fff8e1;color:#f57f17;',
  slider: 'background:#e8f5e9;color:#2e7d32;',
  media: 'background:#f3e5f5;color:#7b1fa2;',
  custom: 'background:#eceff1;color:#546e7a;',
};

@customElement('zs-page-designer')
export class ZsPageDesigner extends LitElement {
  static styles = css`
    :host {
      display: block; height: 100%;
      --zrd-bg: ${unsafeCSS(BG)};
      --zrd-panel-bg: ${unsafeCSS(PANEL_BG)};
      --zrd-border: ${unsafeCSS(BORDER)};
      --zrd-accent: ${unsafeCSS(ACCENT)};
      --zrd-accent-light: ${unsafeCSS(ACCENT_LIGHT)};
      --zrd-text: ${unsafeCSS(TEXT)};
      --zrd-text-muted: ${unsafeCSS(TEXT_MUTED)};
      --zrd-danger: ${unsafeCSS(DANGER)};
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
    }

    /* ─── Layout ──────────────────────────────── */
    .designer {
      display: grid;
      grid-template-rows: auto 1fr;
      grid-template-columns: 200px 4px 1fr 4px 240px;
      height: 100%; background: var(--zrd-bg);
      overflow: hidden;
    }

    /* ─── Toolbar ─────────────────────────────── */
    .toolbar {
      grid-column: 1 / -1;
      display: flex; align-items: center; gap: 8px;
      padding: 6px 12px; min-height: 36px;
      background: var(--zrd-panel-bg);
      border-bottom: 1px solid var(--zrd-border);
      flex-wrap: wrap;
    }
    .toolbar-sep { width: 1px; height: 20px; background: var(--zrd-border); margin: 0 2px; }
    .tb-btn {
      background: none; border: 1px solid var(--zrd-border);
      border-radius: 4px; padding: 4px 10px;
      cursor: pointer; font-size: 12px; color: var(--zrd-text);
      font-family: inherit; transition: background 0.15s;
      white-space: nowrap; display: flex; align-items: center; gap: 4px;
    }
    .tb-btn:hover { background: var(--zrd-accent-light); }
    .tb-btn:disabled { opacity: 0.4; cursor: default; }
    .tb-btn--active { background: var(--zrd-accent); color: white; border-color: var(--zrd-accent); }
    .tb-btn--danger:hover { background: #ffebee; color: var(--zrd-danger); border-color: var(--zrd-danger); }
    .report-name {
      font-weight: 600; font-size: 14px; cursor: pointer;
      padding: 2px 6px; border-radius: 3px; border: 1px solid transparent;
      color: var(--zrd-text);
    }
    .report-name:hover { border-color: var(--zrd-border); background: var(--zrd-accent-light); }
    .report-name-input {
      font-weight: 600; font-size: 14px; border: 1px solid var(--zrd-accent);
      border-radius: 3px; padding: 2px 6px; outline: none;
      background: white; color: var(--zrd-text); font-family: inherit;
    }
    .tb-spacer { flex: 1; }
    .zoom-controls {
      display: flex; align-items: center; gap: 4px;
      padding-left: 8px; border-left: 1px solid var(--zrd-border);
    }
    .zoom-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 3px; font-size: 14px; font-weight: bold; }
    .zoom-label { font-size: 11px; min-width: 36px; text-align: center; color: var(--zrd-text-muted); cursor: pointer; }

    /* ─── Resize Handle ───────────────────────── */
    .panel-resize {
      width: 4px; cursor: col-resize; background: transparent;
      transition: background 0.15s; flex-shrink: 0;
    }
    .panel-resize:hover { background: var(--zrd-accent); }

    /* ─── Left Panel (Toolbox) ────────────────── */
    .left-panel {
      background: var(--zrd-panel-bg);
      border-right: 1px solid var(--zrd-border);
      display: flex; flex-direction: column; overflow: hidden;
    }
    .panel-tabs {
      display: flex; border-bottom: 1px solid var(--zrd-border);
    }
    .panel-tab {
      flex: 1; padding: 8px 4px; text-align: center; cursor: pointer;
      font-size: 11px; border-bottom: 2px solid transparent;
      color: var(--zrd-text-muted); transition: all 0.15s;
      background: none; border-top: none; border-left: none; border-right: none;
      font-family: inherit;
    }
    .panel-tab:hover { color: var(--zrd-text); }
    .panel-tab--active { border-bottom-color: var(--zrd-accent); color: var(--zrd-accent); font-weight: 600; }
    .panel-content { padding: 4px; overflow-y: auto; flex: 1; }
    .panel-content::-webkit-scrollbar { width: 6px; }
    .panel-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }

    /* Toolbox grid (3 columns like report-designer) */
    .toolbox-section {
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: #aaa;
      padding: 10px 8px 5px; margin-top: 2px;
    }
    .toolbox-section:first-child { margin-top: 0; padding-top: 6px; }
    .toolbox-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 3px; padding: 0 4px;
    }
    .toolbox-item {
      display: flex; flex-direction: column; align-items: center;
      gap: 3px; padding: 7px 2px 5px;
      border: 1px solid transparent; border-radius: 5px;
      cursor: grab; user-select: none; text-align: center;
      transition: all 0.15s; background: transparent;
    }
    .toolbox-item:hover {
      background: var(--zrd-accent-light); border-color: #c5dcf0;
      box-shadow: 0 1px 4px rgba(25,118,210,0.1);
    }
    .toolbox-item:active { cursor: grabbing; opacity: 0.6; transform: scale(0.95); }
    .toolbox-icon {
      width: 28px; height: 28px; display: flex; align-items: center;
      justify-content: center; border-radius: 6px;
      font-size: 15px; flex-shrink: 0;
      background: #f0f4f8; color: #1976d2;
      border: 1px solid #e3e8ee;
      transition: all 0.15s;
    }
    .toolbox-item:hover .toolbox-icon {
      background: #1976d2; color: white; border-color: #1976d2;
      box-shadow: 0 2px 6px rgba(25,118,210,0.3);
    }
    .toolbox-label {
      font-size: 9px; font-weight: 500; line-height: 1.1;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      max-width: 100%; color: #777;
    }
    .toolbox-item:hover .toolbox-label { color: #1976d2; }

    /* ─── Canvas ──────────────────────────────── */
    .canvas-area {
      overflow: auto; padding: 30px; position: relative;
      background: #d0d0d0; display: flex; justify-content: center;
    }
    .canvas {
      background: white; position: relative; margin: 0 auto; border-radius: 2px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08);
      min-width: 600px; min-height: 400px; padding: 24px;
      transform-origin: top center;
    }
    .canvas-section { margin-bottom: 20px; }
    .canvas-section-header {
      font-size: 13px; font-weight: 600; color: var(--zrd-text);
      padding: 6px 8px; margin-bottom: 8px;
      background: #f0f0f0; border-radius: 4px; border-left: 3px solid var(--zrd-accent);
      display: flex; align-items: center; gap: 8px; cursor: pointer;
    }
    .canvas-section-header:hover { background: var(--zrd-accent-light); }
    .canvas-grid {
      display: grid; gap: 8px; padding: 4px;
      background: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px),
                  repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px);
    }

    /* Field on canvas */
    .canvas-field {
      position: relative; border: 1px solid transparent;
      border-radius: 4px; cursor: pointer; user-select: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      padding: 4px;
    }
    .canvas-field:hover { border-color: rgba(25,118,210,0.5); }
    .canvas-field--selected {
      border-color: var(--zrd-accent);
      box-shadow: 0 0 0 1px var(--zrd-accent);
    }

    /* Type badge (above field) */
    .field-type-badge {
      position: absolute; top: -14px; left: 0;
      font-size: 9px; border-radius: 3px 3px 0 0;
      padding: 1px 6px; line-height: 13px;
      pointer-events: none; z-index: 6; display: none;
      white-space: nowrap;
    }
    .canvas-field:hover .field-type-badge,
    .canvas-field--selected .field-type-badge { display: block; }

    /* Resize handles (8-point like report-designer) */
    .rh { position: absolute; width: 6px; height: 6px; background: var(--zrd-accent); border: 1px solid white; z-index: 5; display: none; border-radius: 1px; }
    .rh:hover { background: #0d47a1; }
    .canvas-field--selected .rh { display: block; }
    .rh-nw { top: -3px; left: -3px; cursor: nw-resize; }
    .rh-n { top: -3px; left: calc(50% - 3px); cursor: n-resize; }
    .rh-ne { top: -3px; right: -3px; cursor: ne-resize; }
    .rh-e { top: calc(50% - 3px); right: -3px; cursor: e-resize; }
    .rh-se { bottom: -3px; right: -3px; cursor: se-resize; }
    .rh-s { bottom: -3px; left: calc(50% - 3px); cursor: s-resize; }
    .rh-sw { bottom: -3px; left: -3px; cursor: sw-resize; }
    .rh-w { top: calc(50% - 3px); left: -3px; cursor: w-resize; }

    /* Action buttons on field */
    .field-actions {
      position: absolute; top: -14px; right: 4px;
      display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; z-index: 7;
    }
    .canvas-field:hover .field-actions { opacity: 1; }
    .fa-btn {
      width: 18px; height: 14px; border-radius: 3px 3px 0 0;
      border: none; cursor: pointer; font-size: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .fa-btn--move { background: var(--zrd-accent); color: white; }
    .fa-btn--delete { background: var(--zrd-danger); color: white; }
    .fa-btn--copy { background: #7c3aed; color: white; }

    /* Field preview content */
    .field-preview {
      pointer-events: none;
    }
    .field-preview-label {
      font-size: 11px; font-weight: 500; color: var(--zrd-text-muted);
      margin-bottom: 3px;
    }
    .field-preview-input {
      height: 30px; border: 1px solid #e0e0e0; border-radius: 4px;
      background: #fafafa; display: flex; align-items: center;
      padding: 0 8px; font-size: 12px; color: #999;
    }
    .field-preview-input--textarea { height: 60px; align-items: flex-start; padding-top: 6px; }
    .field-preview-input--switch { height: auto; border: none; background: none; padding: 0; }
    .field-preview-input--separator { height: 1px; border: none; background: #ddd; padding: 0; }
    .field-preview-input--heading { height: auto; border: none; background: none; padding: 0; font-size: 16px; font-weight: 600; color: var(--zrd-text); }
    .field-preview-input--datagrid { height: 120px; border: 2px dashed var(--zrd-accent); background: var(--zrd-accent-light); justify-content: center; font-weight: 500; color: var(--zrd-accent); }
    .field-preview-input--report { height: 120px; border: 2px dashed #e65100; background: #fff3e0; justify-content: center; font-weight: 500; color: #e65100; }
    .field-preview-input--chart { height: 120px; border: 2px dashed #6a1b9a; background: #f3e5f5; justify-content: center; font-weight: 500; color: #6a1b9a; }

    /* Drop zone */
    .drop-zone {
      border: 2px dashed var(--zrd-border); border-radius: 6px;
      padding: 16px; text-align: center; margin: 4px 0;
      color: var(--zrd-text-muted); font-size: 12px; transition: all 0.15s;
    }
    .drop-zone--active { border-color: var(--zrd-accent); background: var(--zrd-accent-light); color: var(--zrd-accent); }

    /* ─── Right Panel (Properties — Figma-quality) ──── */
    .right-panel {
      background: var(--zrd-panel-bg);
      border-left: 1px solid var(--zrd-border);
      overflow-y: auto; font-size: 11px;
    }
    .right-panel::-webkit-scrollbar { width: 5px; }
    .right-panel::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 3px; }
    .right-panel::-webkit-scrollbar-thumb:hover { background: #bbb; }

    /* ─ Prop Section ─ */
    .prop-section { border-bottom: 1px solid #eee; padding: 8px 10px 10px; }
    .prop-section:last-child { border-bottom: none; }
    .prop-section-header {
      display: flex; align-items: center; gap: 6px;
      cursor: pointer; user-select: none; margin-bottom: 6px; padding: 2px 0;
    }
    .prop-section-header h4 {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; margin: 0; flex: 1;
    }
    .prop-section-header[data-section="general"] h4 { color: #1976d2; }
    .prop-section-header[data-section="layout"] h4 { color: #7c3aed; }
    .prop-section-header[data-section="behavior"] h4 { color: #0d9488; }
    .prop-section-header[data-section="rules"] h4 { color: #ea580c; }
    .prop-section-header[data-section="style"] h4 { color: #c2185b; }
    .prop-section-header[data-section="form"] h4 { color: #1976d2; }
    .collapse-icon {
      font-size: 8px; color: #bbb; transition: transform 0.15s;
      width: 14px; height: 14px; display: flex; align-items: center;
      justify-content: center; border-radius: 3px;
    }
    .collapse-icon:hover { background: #f0f0f0; color: #666; }
    .collapse-icon--collapsed { transform: rotate(-90deg); }

    /* ─ Prop Rows ─ */
    .prop-row {
      display: grid; grid-template-columns: 62px 1fr;
      align-items: center; gap: 4px; min-height: 26px; margin-bottom: 1px;
    }
    .prop-row-full { grid-template-columns: 1fr; margin-bottom: 3px; }
    .prop-label {
      font-size: 11px; color: #999; font-weight: 400;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      padding-left: 1px; line-height: 1;
    }

    /* ─ Figma-style input ─ */
    .prop-input {
      width: 100%; border: 1px solid transparent; border-radius: 4px;
      padding: 5px 7px; font-size: 11px; background: #f5f5f5;
      color: var(--zrd-text); outline: none; min-width: 0;
      font-family: inherit; box-sizing: border-box;
      transition: border-color 0.12s, background 0.12s, box-shadow 0.12s;
    }
    .prop-input:hover { background: #efefef; border-color: #ddd; }
    .prop-input:focus { border-color: #1976d2; background: white; box-shadow: 0 0 0 2px rgba(25,118,210,0.08); }
    select.prop-input {
      padding: 4px 20px 4px 7px; cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23999'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 6px center;
    }
    textarea.prop-input {
      min-height: 44px; resize: vertical; font-family: 'SF Mono','Consolas','Monaco',monospace;
      font-size: 10px; line-height: 1.5; padding: 6px 7px;
    }

    /* ─ Numeric stepper (Figma-style) ─ */
    .prop-stepper {
      display: flex; align-items: center; background: #f5f5f5;
      border: 1px solid transparent; border-radius: 4px; overflow: hidden;
      transition: border-color 0.12s;
    }
    .prop-stepper:hover { border-color: #ddd; }
    .prop-stepper:focus-within { border-color: #1976d2; background: white; }
    .prop-stepper input {
      border: none; background: transparent; width: 100%;
      font-size: 11px; color: var(--zrd-text); outline: none;
      padding: 4px 2px 4px 7px; min-width: 0; font-family: inherit;
      -moz-appearance: textfield;
    }
    .prop-stepper input::-webkit-inner-spin-button { -webkit-appearance: none; }
    .prop-stepper-btns {
      display: flex; flex-direction: column; border-left: 1px solid #eee;
    }
    .prop-stepper-btn {
      border: none; background: none; cursor: pointer; padding: 0;
      width: 18px; height: 12px; display: flex; align-items: center;
      justify-content: center; font-size: 7px; color: #999;
      transition: all 0.1s;
    }
    .prop-stepper-btn:hover { background: #e8e8e8; color: #333; }

    /* ─ Position grid (4-cell Figma layout) ─ */
    .prop-pos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
    .prop-pos-cell {
      display: flex; align-items: center; background: #f5f5f5;
      border: 1px solid transparent; border-radius: 4px; padding: 0 6px;
      height: 26px; gap: 3px; transition: border-color 0.12s;
    }
    .prop-pos-cell:hover { border-color: #ddd; }
    .prop-pos-cell:focus-within { border-color: #1976d2; background: white; }
    .prop-pos-label {
      font-size: 9px; font-weight: 700; width: 10px; text-align: center;
      flex-shrink: 0; user-select: none;
    }
    .prop-pos-label--x { color: #ef4444; }
    .prop-pos-label--y { color: #3b82f6; }
    .prop-pos-label--w { color: #8b5cf6; }
    .prop-pos-label--h { color: #10b981; }
    .prop-pos-cell input {
      border: none; background: transparent; width: 100%;
      font-size: 11px; color: var(--zrd-text); outline: none;
      padding: 0; min-width: 0; font-family: inherit;
    }

    /* ─ Toggle switches (Figma compact) ─ */
    .prop-toggle {
      display: flex; align-items: center; gap: 8px;
      min-height: 24px; padding: 1px 0;
    }
    .prop-switch {
      position: relative; width: 28px; height: 16px; border-radius: 8px;
      background: #d4d4d4; cursor: pointer; transition: background 0.2s;
      flex-shrink: 0; border: none; padding: 0;
    }
    .prop-switch--active { background: #1976d2; }
    .prop-switch::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 12px; height: 12px; border-radius: 50%;
      background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.15);
      transition: transform 0.2s;
    }
    .prop-switch--active::after { transform: translateX(12px); }
    .prop-toggle-label { font-size: 11px; color: #888; }
    .prop-toggle:hover .prop-toggle-label { color: #555; }

    /* ─ Segmented control (alignment, format) ─ */
    .prop-segmented {
      display: flex; border: 1px solid #e0e0e0; border-radius: 5px;
      overflow: hidden; background: #f5f5f5;
    }
    .prop-seg-btn {
      flex: 1; padding: 4px 0; background: transparent; border: none;
      border-right: 1px solid #e0e0e0; cursor: pointer;
      font-size: 11px; color: #999; transition: all 0.12s; text-align: center;
      font-family: inherit;
    }
    .prop-seg-btn:last-child { border-right: none; }
    .prop-seg-btn:hover { background: #eee; color: #555; }
    .prop-seg-btn--active { background: #1976d2; color: white; }

    /* ─ Color picker (swatch + hex inline) ─ */
    .prop-color-row { display: flex; align-items: center; gap: 6px; }
    .prop-color-swatch {
      width: 22px; height: 22px; border-radius: 5px;
      border: 1px solid #ddd; cursor: pointer; flex-shrink: 0;
      position: relative; overflow: hidden;
    }
    .prop-color-swatch input[type="color"] {
      position: absolute; inset: -4px; width: calc(100% + 8px);
      height: calc(100% + 8px); cursor: pointer; border: none; padding: 0;
    }
    .prop-color-hex {
      border: 1px solid transparent; border-radius: 4px;
      padding: 4px 6px; font-size: 10px;
      font-family: 'SF Mono','Consolas',monospace;
      background: #f5f5f5; color: var(--zrd-text); width: 70px; outline: none;
      box-sizing: border-box;
    }
    .prop-color-hex:hover { border-color: #ddd; }
    .prop-color-hex:focus { border-color: #1976d2; background: white; }

    /* ─ Info badge ─ */
    .prop-info {
      display: flex; align-items: center; gap: 4px;
      padding: 5px 8px; border-radius: 4px; background: #f0f7ff;
      font-size: 10px; color: #1976d2; margin-bottom: 4px;
    }

    /* ─ Divider line ─ */
    .prop-divider { height: 1px; background: #f0f0f0; margin: 4px 0; }

    /* ─ Empty state ─ */
    .props-empty {
      text-align: center; padding: 32px 16px; color: #ccc;
    }
    .props-empty-icon { font-size: 28px; margin-bottom: 6px; opacity: 0.4; }
    .props-empty-text { font-size: 11px; line-height: 1.5; }

    /* ─ Type badge ─ */
    .props-type-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; border-radius: 4px;
      font-size: 10px; font-weight: 700; letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .props-field-id {
      font-size: 10px; color: #bbb; font-family: 'SF Mono','Consolas',monospace;
      margin-top: 2px;
    }

    /* ─ JSON view ─ */
    .json-panel {
      font-family: 'SF Mono','Consolas','Monaco',monospace; font-size: 11px;
      line-height: 1.5; background: #1e1e2d; color: #a2a3b7;
      padding: 16px; border-radius: 4px; overflow: auto;
      white-space: pre; tab-size: 2;
    }
  `;

  // ─── Properties ───────────────────────────────────

  @property({ type: Object }) schema: StudioSchema | null = null;
  @property({ type: Object }) data: Record<string, unknown> = {};
  @property({ type: Object }) provider: StudioProvider = {};
  @property({ type: Number, attribute: 'auto-save-ms' }) autoSaveMs = 1000;
  @property({ type: Number, attribute: 'grid-snap' }) gridSnap = 1;

  // ─── State ────────────────────────────────────────

  @state() private selectedFieldId: string | null = null;
  @state() private viewMode: 'design' | 'preview' | 'json' = 'design';
  @state() private leftTab: 'fields' | 'sections' | 'api' = 'fields';
  @state() private dragType: FieldType | null = null;
  @state() private editingTitle = false;
  @state() private collapsedSections = new Set<string>();
  @state() private zoom = 1;

  // Undo/Redo
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  // ─── Lifecycle ────────────────────────────────────

  updated(changed: Map<string, unknown>) {
    if (changed.has('schema') && this.schema && this.undoStack.length === 0) {
      this.undoStack = [JSON.stringify(this.schema)];
    }
  }

  // ─── Undo/Redo ────────────────────────────────────

  private pushUndo() {
    if (!this.schema) return;
    this.undoStack.push(JSON.stringify(this.schema));
    this.redoStack = [];
    if (this.undoStack.length > 50) this.undoStack = this.undoStack.slice(-50);
  }

  private undo() {
    if (this.undoStack.length <= 1) return;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    this.schema = JSON.parse(this.undoStack[this.undoStack.length - 1]);
    this.emitChange();
  }

  private redo() {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    this.schema = JSON.parse(next);
    this.emitChange();
  }

  private commitChange() {
    this.pushUndo();
    this.emitChange();
    this.requestUpdate();
  }

  private emitChange() {
    this.dispatchEvent(new CustomEvent('schema-change', {
      detail: { schema: structuredClone(this.schema) },
      bubbles: true, composed: true,
    }));

    if (this.autoSaveMs > 0) {
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        this.dispatchEvent(new CustomEvent('auto-save', {
          detail: { schema: structuredClone(this.schema) },
          bubbles: true, composed: true,
        }));
      }, this.autoSaveMs);
    }

    this.requestUpdate();
  }

  // ─── Field helpers ────────────────────────────────

  private get selectedField(): FieldConfig | null {
    if (!this.schema || !this.selectedFieldId) return null;
    for (const s of this.schema.sections) {
      const f = s.fields.find(f => f.id === this.selectedFieldId);
      if (f) return f;
    }
    return null;
  }

  private findFieldSection(fieldId: string): number {
    if (!this.schema) return -1;
    return this.schema.sections.findIndex(s => s.fields.some(f => f.id === fieldId));
  }

  private addField(type: FieldType, sectionIndex = 0) {
    if (!this.schema) {
      this.schema = {
        id: 'new-form', version: '1.0', title: 'Nuevo Formulario',
        layout: { type: 'grid', columns: 2 },
        sections: [{ id: 'main', title: 'Datos', fields: [] }],
      };
      this.undoStack = [JSON.stringify(this.schema)];
    }
    if (sectionIndex >= this.schema.sections.length) sectionIndex = 0;
    const id = `${type}_${Date.now()}`;
    const meta = getAllFields().find(f => f.type === type);
    this.schema.sections[sectionIndex].fields.push({
      id, type, field: id,
      label: meta?.label ?? type,
      props: meta?.defaultProps ? { ...meta.defaultProps } : undefined,
    });
    this.selectedFieldId = id;
    this.commitChange();
  }

  private removeField(si: number, fi: number) {
    if (!this.schema) return;
    const f = this.schema.sections[si].fields[fi];
    if (this.selectedFieldId === f.id) this.selectedFieldId = null;
    this.schema.sections[si].fields.splice(fi, 1);
    this.commitChange();
  }

  private moveField(si: number, fi: number, dir: -1 | 1) {
    if (!this.schema) return;
    const fields = this.schema.sections[si].fields;
    const ni = fi + dir;
    if (ni < 0 || ni >= fields.length) return;
    [fields[fi], fields[ni]] = [fields[ni], fields[fi]];
    this.commitChange();
  }

  private duplicateField(si: number, fi: number) {
    if (!this.schema) return;
    const original = this.schema.sections[si].fields[fi];
    const clone = structuredClone(original);
    clone.id = `${clone.type}_${Date.now()}`;
    clone.field = clone.id;
    this.schema.sections[si].fields.splice(fi + 1, 0, clone);
    this.selectedFieldId = clone.id;
    this.commitChange();
  }

  // ─── Render ───────────────────────────────────────

  render() {
    return html`
      <div class="designer">
        ${this.renderToolbar()}
        ${this.renderLeftPanel()}
        <div class="panel-resize"></div>
        ${this.renderCanvas()}
        <div class="panel-resize"></div>
        ${this.renderRightPanel()}
      </div>
    `;
  }

  // ─── Toolbar ──────────────────────────────────────

  private renderToolbar() {
    return html`
      <div class="toolbar">
        ${this.editingTitle
          ? html`<input class="report-name-input" .value="${this.schema?.title ?? ''}"
              @blur="${(e: Event) => { if (this.schema) this.schema.title = (e.target as HTMLInputElement).value; this.editingTitle = false; this.commitChange(); }}"
              @keydown="${(e: KeyboardEvent) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}"
            />`
          : html`<span class="report-name" @click="${() => { this.editingTitle = true; }}">${this.schema?.title || 'Sin titulo'}</span>`
        }

        <div class="toolbar-sep"></div>

        <button class="tb-btn" ?disabled="${this.undoStack.length <= 1}" @click="${this.undo}" title="Deshacer (Ctrl+Z)">↩ Deshacer</button>
        <button class="tb-btn" ?disabled="${this.redoStack.length === 0}" @click="${this.redo}" title="Rehacer (Ctrl+Y)">↪ Rehacer</button>

        <div class="toolbar-sep"></div>

        <button class="tb-btn" @click="${() => {
          if (!this.schema) return;
          this.schema.sections.push({ id: `section_${Date.now()}`, title: 'Nueva Seccion', fields: [] });
          this.commitChange();
        }}">+ Seccion</button>

        <div style="position:relative;display:inline-block;">
          <button class="tb-btn" @click="${() => { this.showTemplateMenu = !this.showTemplateMenu; }}">📋 Plantillas ▾</button>
          ${this.showTemplateMenu ? this.renderTemplateMenu() : nothing}
        </div>

        <button class="tb-btn tb-btn--danger" @click="${() => {
          this.schema = { id: 'new-form', version: '1.0', title: 'Nuevo Formulario', layout: { type: 'grid', columns: 2 }, sections: [{ id: 'main', title: 'Datos', fields: [] }] };
          this.undoStack = [JSON.stringify(this.schema)]; this.redoStack = [];
          this.selectedFieldId = null; this.commitChange();
        }}">🗑 Nuevo</button>

        <div class="toolbar-sep"></div>

        <button class="tb-btn ${this.viewMode === 'design' ? 'tb-btn--active' : ''}" @click="${() => { this.viewMode = 'design'; }}">✏️ Diseño</button>
        <button class="tb-btn ${this.viewMode === 'preview' ? 'tb-btn--active' : ''}" @click="${() => { this.viewMode = 'preview'; }}">👁 Preview</button>
        <button class="tb-btn ${this.viewMode === 'json' ? 'tb-btn--active' : ''}" @click="${() => { this.viewMode = 'json'; }}">&lt;/&gt; JSON</button>

        <span class="tb-spacer"></span>

        <button class="tb-btn" @click="${() => {
          if (this.schema) { navigator.clipboard.writeText(JSON.stringify(this.schema, null, 2)); }
        }}">📋 Copiar</button>

        <div class="zoom-controls">
          <button class="tb-btn zoom-btn" @click="${() => { this.zoom = Math.max(0.5, this.zoom - 0.1); }}">−</button>
          <span class="zoom-label" @click="${() => { this.zoom = 1; }}">${Math.round(this.zoom * 100)}%</span>
          <button class="tb-btn zoom-btn" @click="${() => { this.zoom = Math.min(2, this.zoom + 0.1); }}">+</button>
        </div>
      </div>
    `;
  }

  // ─── Left Panel ───────────────────────────────────

  private renderLeftPanel() {
    const categories = [
      { key: 'basic', label: 'Basicos' },
      { key: 'advanced', label: 'Avanzados' },
      { key: 'data', label: 'Datos' },
      { key: 'media', label: 'Media' },
      { key: 'layout', label: 'Layout' },
    ];

    return html`
      <div class="left-panel">
        <div class="panel-tabs">
          <button class="panel-tab ${this.leftTab === 'fields' ? 'panel-tab--active' : ''}" @click="${() => { this.leftTab = 'fields'; }}">Campos</button>
          <button class="panel-tab ${this.leftTab === 'sections' ? 'panel-tab--active' : ''}" @click="${() => { this.leftTab = 'sections'; }}">Secciones</button>
          <button class="panel-tab ${this.leftTab === 'api' ? 'panel-tab--active' : ''}" @click="${() => { this.leftTab = 'api'; }}" style="${this.leftTab === 'api' ? 'color:#ea580c;border-bottom-color:#ea580c;' : ''}">API</button>
        </div>
        <div class="panel-content">
          ${this.leftTab === 'fields' ? html`
            ${categories.map(cat => {
              const items = getFieldsByCategory(cat.key);
              if (items.length === 0) return nothing;
              return html`
                <div class="toolbox-section">${cat.label}</div>
                <div class="toolbox-grid">
                  ${items.map(f => html`
                    <div class="toolbox-item"
                      draggable="true"
                      @dragstart="${(e: DragEvent) => { this.dragType = f.type; e.dataTransfer?.setData('text/plain', f.type); }}"
                      @dragend="${() => { this.dragType = null; }}"
                      @dblclick="${() => this.addField(f.type)}"
                      title="${f.label}"
                    >
                      <span class="toolbox-icon">${unsafeHTML(resolveIcon(f.icon, this.provider))}</span>
                      <span class="toolbox-label">${f.label}</span>
                    </div>
                  `)}
                </div>
              `;
            })}
          ` : this.leftTab === 'sections' ? html`
            ${this.schema?.sections.map((s, i) => html`
              <div style="padding:8px 10px;margin:2px 4px;background:${i % 2 === 0 ? '#f8f9fa' : 'white'};border-radius:6px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:8px;border:1px solid #eee;transition:all 0.15s;"
                @click="${() => { /* scroll to section */ }}"
              >
                <span style="background:#e3f2fd;color:#1976d2;font-weight:700;font-size:10px;padding:2px 6px;border-radius:4px;">§${i + 1}</span>
                <span style="flex:1;font-weight:500;">${s.title ?? 'Sin titulo'}</span>
                <span style="color:#aaa;font-size:10px;">${s.fields.length}</span>
              </div>
            `) ?? nothing}
            <button style="margin:8px 4px;padding:8px;width:calc(100% - 8px);border:1px dashed #ccc;border-radius:6px;background:none;cursor:pointer;font-size:11px;color:#888;font-family:inherit;transition:all 0.15s;"
              @click="${() => { if (this.schema) { this.schema.sections.push({ id: 'section_' + Date.now(), title: 'Nueva Seccion', fields: [] }); this.commitChange(); } }}"
            >+ Agregar Seccion</button>
          ` : this.renderApiPanel()}
        </div>
      </div>
    `;
  }

  // ─── Canvas ───────────────────────────────────────

  private renderCanvas() {
    return html`
      <div class="canvas-area">
        ${this.viewMode === 'json'
          ? html`<div class="json-panel" style="width:100%;max-width:800px;">${JSON.stringify(this.schema, null, 2)}</div>`
          : this.viewMode === 'preview'
            ? html`<div class="canvas" style="transform:scale(${this.zoom});"><zentto-studio-renderer .schema="${this.schema}" .data="${this.data}"></zentto-studio-renderer></div>`
            : this.renderDesignCanvas()
        }
      </div>
    `;
  }

  private renderDesignCanvas() {
    if (!this.schema) {
      return html`<div class="drop-zone ${this.dragType ? 'drop-zone--active' : ''}" style="width:500px;height:200px;display:flex;align-items:center;justify-content:center;"
        @dragover="${(e: DragEvent) => e.preventDefault()}"
        @drop="${(e: DragEvent) => { e.preventDefault(); if (this.dragType) { this.addField(this.dragType); this.dragType = null; } }}"
      >Arrastra un campo aqui para empezar</div>`;
    }

    const cols = this.schema.layout.columns ?? 1;

    return html`
      <div class="canvas" style="transform:scale(${this.zoom});" @click="${() => { this.selectedFieldId = null; }}">
        ${this.schema.sections.map((section, si) => html`
          <div class="canvas-section">
            <div class="canvas-section-header" @click="${(e: Event) => e.stopPropagation()}">
              <span style="font-size:10px;color:var(--zrd-accent);">§${si + 1}</span>
              ${section.title ?? 'Seccion'}
              <span style="flex:1;"></span>
              <span style="font-size:10px;color:var(--zrd-text-muted);">${section.fields.length} campos</span>
            </div>
            <div class="canvas-grid" style="grid-template-columns:repeat(${section.columns ?? cols}, 1fr);">
              ${section.fields.map((field, fi) => this.renderCanvasField(field, si, fi, section.columns ?? cols))}
            </div>
            <div class="drop-zone ${this.dragType ? 'drop-zone--active' : ''}"
              @dragover="${(e: DragEvent) => e.preventDefault()}"
              @drop="${(e: DragEvent) => { e.preventDefault(); if (this.dragType) { this.addField(this.dragType, si); this.dragType = null; } }}"
            >${this.dragType ? '↓ Soltar aqui' : '+ Arrastra campos'}</div>
          </div>
        `)}
      </div>
    `;
  }

  private renderCanvasField(field: FieldConfig, si: number, fi: number, maxCols: number): TemplateResult {
    const isSelected = this.selectedFieldId === field.id;
    const span = Math.min(field.colSpan ?? 1, maxCols);
    const fullWidth = ['separator', 'heading', 'html', 'datagrid', 'report', 'chart'].includes(field.type);
    const gridCol = fullWidth ? '1 / -1' : span > 1 ? `span ${span}` : '';
    const typeColor = FIELD_TYPE_COLORS[field.type] ?? 'background:#eceff1;color:#546e7a;';

    return html`
      <div class="canvas-field ${isSelected ? 'canvas-field--selected' : ''}"
        style="${gridCol ? `grid-column:${gridCol};` : ''}"
        @click="${(e: Event) => { e.stopPropagation(); this.selectedFieldId = field.id; }}"
      >
        <!-- Type badge -->
        <span class="field-type-badge" style="${typeColor}">${field.type}</span>

        <!-- Action buttons -->
        <div class="field-actions">
          ${fi > 0 ? html`<button class="fa-btn fa-btn--move" @click="${(e: Event) => { e.stopPropagation(); this.moveField(si, fi, -1); }}" title="Subir">↑</button>` : ''}
          ${fi < (this.schema?.sections[si].fields.length ?? 0) - 1 ? html`<button class="fa-btn fa-btn--move" @click="${(e: Event) => { e.stopPropagation(); this.moveField(si, fi, 1); }}" title="Bajar">↓</button>` : ''}
          <button class="fa-btn fa-btn--copy" @click="${(e: Event) => { e.stopPropagation(); this.duplicateField(si, fi); }}" title="Duplicar">⎘</button>
          <button class="fa-btn fa-btn--delete" @click="${(e: Event) => { e.stopPropagation(); this.removeField(si, fi); }}" title="Eliminar">✕</button>
        </div>

        <!-- Resize handles -->
        ${isSelected ? html`
          <div class="rh rh-nw"></div><div class="rh rh-n"></div><div class="rh rh-ne"></div>
          <div class="rh rh-e"></div><div class="rh rh-se"></div><div class="rh rh-s"></div>
          <div class="rh rh-sw"></div><div class="rh rh-w"></div>
        ` : ''}

        <!-- Field preview -->
        <div class="field-preview">
          <div class="field-preview-label">${field.label ?? field.id}${field.required ? ' *' : ''}</div>
          <div class="field-preview-input ${this.getPreviewClass(field.type)}">
            ${this.getPreviewContent(field)}
          </div>
        </div>
      </div>
    `;
  }

  private getPreviewClass(type: FieldType): string {
    if (type === 'textarea') return 'field-preview-input--textarea';
    if (type === 'switch') return 'field-preview-input--switch';
    if (type === 'separator') return 'field-preview-input--separator';
    if (type === 'heading') return 'field-preview-input--heading';
    if (type === 'datagrid') return 'field-preview-input--datagrid';
    if (type === 'report') return 'field-preview-input--report';
    if (type === 'chart') return 'field-preview-input--chart';
    return '';
  }

  private getPreviewContent(field: FieldConfig): string {
    if (field.type === 'switch') return '⬤───────';
    if (field.type === 'separator') return '';
    if (field.type === 'heading') return field.label ?? 'Titulo';
    if (field.type === 'datagrid') return '◫ ZenttoDataGrid';
    if (field.type === 'report') return '◫ ZenttoReportViewer';
    if (field.type === 'chart') return '◫ Chart SVG';
    if (field.type === 'checkbox' || field.type === 'radio') return '☐ ' + (field.label ?? '');
    if (field.type === 'rating') return '★ ★ ★ ★ ☆';
    if (field.type === 'signature') return '✍ Firma';
    if (field.type === 'file' || field.type === 'image') return '📁 Arrastra archivos';
    if (field.type === 'address') return '📍 Calle, Ciudad, Estado, CP';
    if (field.type === 'chips' || field.type === 'tags') return '🏷 tag1 × tag2 ×';
    if (field.type === 'treeview') return '▸ Nodo 1\n  ▸ Nodo 2';
    return field.placeholder ?? field.type;
  }

  // ─── Right Panel (Properties — Figma-quality) ──────

  private renderRightPanel() {
    const field = this.selectedField;

    if (!field) {
      return html`
        <div class="right-panel">
          <div class="props-empty">
            <div class="props-empty-icon">⬚</div>
            <div class="props-empty-text">Selecciona un campo<br/>para editar propiedades</div>
          </div>
          ${this.schema ? this.renderFormProperties() : ''}
        </div>
      `;
    }

    const typeColor = FIELD_TYPE_COLORS[field.type] ?? 'background:#eceff1;color:#546e7a;';

    return html`
      <div class="right-panel">
        <!-- Header with type badge -->
        <div style="padding:8px 10px;border-bottom:1px solid #eee;">
          <span class="props-type-badge" style="${typeColor}">${field.type.toUpperCase()}</span>
          <div class="props-field-id">#${field.id}</div>
        </div>

        <!-- General -->
        <div class="prop-section">
          <div class="prop-section-header" data-section="general" @click="${() => this.toggleSection('general')}">
            <span class="collapse-icon ${this.collapsedSections.has('general') ? 'collapse-icon--collapsed' : ''}">▾</span>
            <h4>General</h4>
          </div>
          ${!this.collapsedSections.has('general') ? html`
            <div class="prop-row"><span class="prop-label">Label</span><input class="prop-input" .value="${field.label ?? ''}" @input="${(e: Event) => { field.label = (e.target as HTMLInputElement).value; this.emitChange(); }}" /></div>
            <div class="prop-row"><span class="prop-label">Field</span><input class="prop-input" style="font-family:'SF Mono','Consolas',monospace;font-size:10px;" .value="${field.field}" @change="${(e: Event) => { field.field = (e.target as HTMLInputElement).value; this.commitChange(); }}" /></div>
            <div class="prop-row"><span class="prop-label">Placeholder</span><input class="prop-input" .value="${field.placeholder ?? ''}" @input="${(e: Event) => { field.placeholder = (e.target as HTMLInputElement).value; this.emitChange(); }}" /></div>
            <div class="prop-row"><span class="prop-label">Ayuda</span><input class="prop-input" .value="${field.helpText ?? ''}" @input="${(e: Event) => { field.helpText = (e.target as HTMLInputElement).value; this.emitChange(); }}" /></div>
          ` : ''}
        </div>

        <!-- Layout (Figma position grid) -->
        <div class="prop-section">
          <div class="prop-section-header" data-section="layout" @click="${() => this.toggleSection('layout')}">
            <span class="collapse-icon ${this.collapsedSections.has('layout') ? 'collapse-icon--collapsed' : ''}">▾</span>
            <h4>Layout</h4>
          </div>
          ${!this.collapsedSections.has('layout') ? html`
            <div class="prop-pos-grid">
              <div class="prop-pos-cell">
                <span class="prop-pos-label prop-pos-label--w">W</span>
                <input type="number" min="1" max="6" .value="${String(field.colSpan ?? 1)}" @change="${(e: Event) => { field.colSpan = parseInt((e.target as HTMLInputElement).value) || 1; this.commitChange(); }}" />
              </div>
              <div class="prop-pos-cell">
                <span class="prop-pos-label prop-pos-label--h">T</span>
                <select .value="${field.type}" @change="${(e: Event) => { (field as any).type = (e.target as HTMLSelectElement).value; this.commitChange(); }}" style="border:none;background:transparent;font-size:11px;width:100%;outline:none;color:var(--zrd-text);font-family:inherit;">
                  ${getAllFields().map(f => html`<option value="${f.type}" ?selected="${f.type === field.type}">${f.label}</option>`)}
                </select>
              </div>
            </div>
            <div class="prop-divider"></div>
            <div class="prop-row"><span class="prop-label">CSS Class</span><input class="prop-input" .value="${field.cssClass ?? ''}" placeholder="mi-clase" @input="${(e: Event) => { field.cssClass = (e.target as HTMLInputElement).value; this.emitChange(); }}" /></div>
          ` : ''}
        </div>

        <!-- Style -->
        <div class="prop-section">
          <div class="prop-section-header" data-section="style" @click="${() => this.toggleSection('style')}">
            <span class="collapse-icon ${this.collapsedSections.has('style') ? 'collapse-icon--collapsed' : ''}">▾</span>
            <h4>Estilo</h4>
          </div>
          ${!this.collapsedSections.has('style') ? html`
            <div class="prop-row">
              <span class="prop-label">Ancho</span>
              <div class="prop-segmented">
                ${['auto', '100%', '50%'].map(w => html`
                  <button class="prop-seg-btn ${(field.width ?? 'auto') === w ? 'prop-seg-btn--active' : ''}"
                    @click="${() => { field.width = w === 'auto' ? undefined : w; this.commitChange(); }}"
                  >${w}</button>
                `)}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Behavior (toggles) -->
        <div class="prop-section">
          <div class="prop-section-header" data-section="behavior" @click="${() => this.toggleSection('behavior')}">
            <span class="collapse-icon ${this.collapsedSections.has('behavior') ? 'collapse-icon--collapsed' : ''}">▾</span>
            <h4>Comportamiento</h4>
          </div>
          ${!this.collapsedSections.has('behavior') ? html`
            ${this.renderToggle('Requerido', field.required ?? false, (v) => { field.required = v; this.commitChange(); })}
            ${this.renderToggle('Solo lectura', field.readOnly ?? false, (v) => { field.readOnly = v; this.commitChange(); })}
            ${this.renderToggle('Deshabilitado', field.disabled ?? false, (v) => { field.disabled = v; this.commitChange(); })}
            ${this.renderToggle('Oculto', field.hidden ?? false, (v) => { field.hidden = v; this.commitChange(); })}
          ` : ''}
        </div>

        <!-- Rules (expressions) -->
        <div class="prop-section">
          <div class="prop-section-header" data-section="rules" @click="${() => this.toggleSection('rules')}">
            <span class="collapse-icon ${this.collapsedSections.has('rules') ? 'collapse-icon--collapsed' : ''}">▾</span>
            <h4>Reglas</h4>
          </div>
          ${!this.collapsedSections.has('rules') ? html`
            <div class="prop-info">💡 Usa {campo} para referencias y expresiones</div>
            <div class="prop-row prop-row-full"><span class="prop-label" style="margin-bottom:2px;">Condicion de visibilidad</span></div>
            <div class="prop-row prop-row-full"><textarea class="prop-input" rows="2" .value="${field.visibilityRule ?? ''}" placeholder='{tipo} == "empresa" AND {activo} == true' @change="${(e: Event) => { field.visibilityRule = (e.target as HTMLTextAreaElement).value || undefined; this.commitChange(); }}"></textarea></div>
            <div class="prop-row prop-row-full"><span class="prop-label" style="margin-bottom:2px;">Valor computado</span></div>
            <div class="prop-row prop-row-full"><textarea class="prop-input" rows="2" .value="${field.computedValue ?? ''}" placeholder='{precio} * {cantidad} * (1 + {iva}/100)' @change="${(e: Event) => { field.computedValue = (e.target as HTMLTextAreaElement).value || undefined; this.commitChange(); }}"></textarea></div>
            <div class="prop-divider"></div>
            <div class="prop-row"><span class="prop-label">Default</span><input class="prop-input" .value="${String(field.defaultValue ?? '')}" @change="${(e: Event) => { field.defaultValue = (e.target as HTMLInputElement).value || undefined; this.commitChange(); }}" /></div>
          ` : ''}
        </div>

        <!-- Data Source (API connection like report-designer) -->
        <div class="prop-section">
          <div class="prop-section-header" data-section="datasource" @click="${() => this.toggleSection('datasource')}">
            <span class="collapse-icon ${this.collapsedSections.has('datasource') ? 'collapse-icon--collapsed' : ''}">▾</span>
            <h4>Origen de Datos</h4>
          </div>
          ${!this.collapsedSections.has('datasource') ? html`
            <div class="prop-info">🔌 Conecta campos a APIs y endpoints</div>
            <div class="prop-row"><span class="prop-label">Endpoint</span><input class="prop-input" style="font-family:'SF Mono','Consolas',monospace;font-size:10px;" .value="${(field.props?.endpoint as string) ?? ''}" placeholder="/v1/clientes" @change="${(e: Event) => { if (!field.props) field.props = {}; field.props.endpoint = (e.target as HTMLInputElement).value || undefined; this.commitChange(); }}" /></div>
            <div class="prop-row"><span class="prop-label">Campo valor</span><input class="prop-input" .value="${(field.props?.valueField as string) ?? ''}" placeholder="id" @change="${(e: Event) => { if (!field.props) field.props = {}; field.props.valueField = (e.target as HTMLInputElement).value || undefined; this.commitChange(); }}" /></div>
            <div class="prop-row"><span class="prop-label">Campo label</span><input class="prop-input" .value="${(field.props?.displayField as string) ?? ''}" placeholder="nombre" @change="${(e: Event) => { if (!field.props) field.props = {}; field.props.displayField = (e.target as HTMLInputElement).value || undefined; this.commitChange(); }}" /></div>
            ${field.type === 'datagrid' || field.type === 'select' || field.type === 'lookup' ? html`
              <div class="prop-divider"></div>
              <div class="prop-row"><span class="prop-label">Data Source</span><input class="prop-input" .value="${(field.props?.dataSourceId as string) ?? ''}" placeholder="clientesList" @change="${(e: Event) => { if (!field.props) field.props = {}; field.props.dataSourceId = (e.target as HTMLInputElement).value || undefined; this.commitChange(); }}" /></div>
            ` : ''}
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderFormProperties() {
    if (!this.schema) return nothing;
    return html`
      <div class="prop-section">
        <div class="prop-section-header" data-section="form">
          <span class="collapse-icon">▾</span>
          <h4>Formulario</h4>
        </div>
        <div class="prop-row"><span class="prop-label">Titulo</span><input class="prop-input" .value="${this.schema.title}" @input="${(e: Event) => { this.schema!.title = (e.target as HTMLInputElement).value; this.emitChange(); }}" /></div>
        <div class="prop-divider"></div>
        <div class="prop-pos-grid">
          <div class="prop-pos-cell">
            <span class="prop-pos-label prop-pos-label--w">C</span>
            <input type="number" min="1" max="6" .value="${String(this.schema.layout.columns ?? 1)}" @change="${(e: Event) => { this.schema!.layout.columns = parseInt((e.target as HTMLInputElement).value) || 1; this.commitChange(); }}" />
          </div>
          <div class="prop-pos-cell">
            <span class="prop-pos-label prop-pos-label--y">G</span>
            <input type="number" min="0" .value="${String(this.schema.layout.gap ?? 16)}" @change="${(e: Event) => { this.schema!.layout.gap = parseInt((e.target as HTMLInputElement).value) || 16; this.commitChange(); }}" />
          </div>
        </div>
        <div style="font-size:9px;color:#bbb;margin-top:4px;display:flex;gap:12px;">
          <span>C = Columnas</span><span>G = Gap (px)</span>
        </div>
      </div>
    `;
  }

  // ─── API Panel (Data Sources) ──────────────────────

  @state() private showTemplateMenu = false;
  @state() private apiSources: { id: string; name: string; endpoint: string; method: string; fields: string[] }[] = [];
  @state() private apiLoading = false;
  @state() private apiBaseUrl = '';
  @state() private apiToken = '';
  @state() private apiUser = '';
  @state() private apiLoggedIn = false;
  @state() private apiLoginError = '';
  @state() private apiLoginLoading = false;
  @state() private apiCompany = '';
  @state() private apiBranch = '';

  private renderApiPanel() {
    return html`
      <div style="padding:4px;">
        <!-- Auth Section -->
        ${this.renderApiAuth()}

        <!-- Quick connect (only when logged in or no auth needed) -->
        <div style="padding:4px 8px;margin-top:4px;">
          <div style="font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;margin-bottom:4px;">Conectar Endpoint</div>
          <div style="display:flex;gap:4px;margin-bottom:6px;">
            <select id="api-method" style="width:70px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:10px;background:white;font-family:inherit;">
              <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
            </select>
            <input id="api-url" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:10px;font-family:'SF Mono','Consolas',monospace;background:#fafafa;" placeholder="/v1/clientes" />
          </div>
          <button style="width:100%;padding:6px;border:1px solid #ea580c;border-radius:5px;background:#fff7ed;color:#ea580c;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit;transition:all 0.15s;"
            @click="${this.fetchApiFields}"
          >${this.apiLoading ? 'Cargando...' : '🔌 Probar Conexion'}</button>
        </div>

        <!-- Fetched sources -->
        ${this.apiSources.length > 0 ? html`
          <div style="margin-top:8px;">
            ${this.apiSources.map(src => html`
              <div style="margin:4px;border:1px solid #eee;border-radius:6px;overflow:hidden;">
                <div style="padding:6px 8px;background:#f8f9fa;display:flex;align-items:center;gap:6px;border-bottom:1px solid #eee;">
                  <span style="background:#ea580c;color:white;font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;">${src.method}</span>
                  <span style="font-size:10px;font-weight:600;color:#333;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${src.name}</span>
                  <span style="font-size:9px;color:#aaa;">${src.fields.length} campos</span>
                </div>
                <div style="padding:2px 4px;max-height:150px;overflow-y:auto;">
                  ${src.fields.map(field => html`
                    <div style="display:flex;align-items:center;gap:6px;padding:4px 6px;font-size:11px;cursor:grab;border-radius:3px;transition:background 0.1s;"
                      draggable="true"
                      @dragstart="${(e: DragEvent) => { this.dragType = 'text' as FieldType; e.dataTransfer?.setData('text/plain', 'text'); e.dataTransfer?.setData('field-name', field); e.dataTransfer?.setData('ds-id', src.id); }}"
                      @dblclick="${() => {
                        // Auto-create a field bound to this API field
                        this.addField('text');
                        const lastField = this.schema?.sections[0]?.fields[this.schema.sections[0].fields.length - 1];
                        if (lastField) { lastField.field = field; lastField.label = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'); if (!lastField.props) lastField.props = {}; lastField.props.dataSourceId = src.id; this.commitChange(); }
                      }}"
                    >
                      <span style="color:#1976d2;font-size:10px;">⬡</span>
                      <span style="color:#555;">${field}</span>
                    </div>
                  `)}
                </div>
              </div>
            `)}
          </div>
        ` : ''}

        <!-- Zentto API shortcuts -->
        <div style="margin-top:12px;padding:4px 8px;">
          <div style="font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;margin-bottom:6px;">Accesos Rapidos Zentto</div>
          ${[
            { label: 'Clientes', endpoint: '/v1/clientes', icon: '👥' },
            { label: 'Articulos', endpoint: '/v1/articulos', icon: '📦' },
            { label: 'Facturas', endpoint: '/v1/documentos-venta', icon: '📄' },
            { label: 'Empleados', endpoint: '/v1/empleados', icon: '👷' },
            { label: 'Cuentas', endpoint: '/v1/plan-cuentas', icon: '🏛' },
            { label: 'Proveedores', endpoint: '/v1/proveedores', icon: '🏭' },
            { label: 'Bancos', endpoint: '/v1/bancos', icon: '🏦' },
            { label: 'Paises', endpoint: '/v1/config/countries', icon: '🌍' },
          ].map(api => html`
            <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;margin:2px 0;border-radius:5px;cursor:pointer;font-size:11px;transition:all 0.15s;border:1px solid transparent;"
              @click="${() => {
                const urlInput = this.shadowRoot?.querySelector('#api-url') as HTMLInputElement;
                if (urlInput) urlInput.value = api.endpoint;
              }}"
              @mouseenter="${(e: Event) => { (e.target as HTMLElement).style.background = '#fff7ed'; (e.target as HTMLElement).style.borderColor = '#fed7aa'; }}"
              @mouseleave="${(e: Event) => { (e.target as HTMLElement).style.background = ''; (e.target as HTMLElement).style.borderColor = 'transparent'; }}"
            >
              <span style="font-size:14px;">${api.icon}</span>
              <span style="flex:1;color:#555;">${api.label}</span>
              <span style="font-size:9px;color:#bbb;font-family:'SF Mono','Consolas',monospace;">${api.endpoint}</span>
            </div>
          `)}
        </div>

        <!-- Manual data source -->
        <div style="margin-top:8px;padding:4px 8px;">
          <div style="font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;margin-bottom:4px;">Datos Estaticos</div>
          <button style="width:100%;padding:6px;border:1px dashed #ccc;border-radius:5px;background:none;cursor:pointer;font-size:11px;color:#888;font-family:inherit;"
            @click="${() => {
              const src = { id: 'static_' + Date.now(), name: 'Datos Manuales', endpoint: '', method: 'STATIC', fields: ['campo1', 'campo2', 'campo3'] };
              this.apiSources = [...this.apiSources, src];
            }}"
          >+ Agregar Datos Estaticos</button>
        </div>
      </div>
    `;
  }

  // ─── Template Menu ─────────────────────────────────

  private renderTemplateMenu() {
    const templates: { id: string; icon: string; title: string; desc: string; schema: StudioSchema }[] = [
      {
        id: 'blank', icon: '📄', title: 'En Blanco', desc: '2 columnas, sin campos',
        schema: { id: 'blank', version: '1.0', title: 'Nuevo Formulario', layout: { type: 'grid', columns: 2, gap: 16 }, sections: [{ id: 'main', title: 'Datos', fields: [] }] },
      },
      {
        id: 'contact', icon: '👤', title: 'Contacto', desc: 'Nombre, email, telefono, pais',
        schema: { id: 'contact', version: '1.0', title: 'Ficha de Contacto', layout: { type: 'grid', columns: 2, gap: 16 }, sections: [
          { id: 's1', title: 'Datos Personales', fields: [
            { id: 'nombre', type: 'text', field: 'nombre', label: 'Nombre Completo', required: true },
            { id: 'email', type: 'email', field: 'email', label: 'Email', required: true },
            { id: 'telefono', type: 'phone', field: 'telefono', label: 'Telefono' },
            { id: 'pais', type: 'select', field: 'pais', label: 'Pais', props: { options: [{ value: 'VE', label: 'Venezuela' }, { value: 'CO', label: 'Colombia' }, { value: 'MX', label: 'Mexico' }, { value: 'ES', label: 'España' }, { value: 'US', label: 'EEUU' }] } },
            { id: 'notas', type: 'textarea', field: 'notas', label: 'Notas', colSpan: 2 },
          ]},
        ], actions: [{ id: 'save', type: 'submit', label: 'Guardar', variant: 'primary' }, { id: 'cancel', type: 'reset', label: 'Cancelar', variant: 'secondary' }] },
      },
      {
        id: 'client', icon: '🏢', title: 'Cliente Completo', desc: 'Datos personales, direccion, fiscal, tags',
        schema: { id: 'client', version: '1.0', title: 'Registro de Cliente', layout: { type: 'grid', columns: 2, gap: 16 }, sections: [
          { id: 's1', title: 'Datos del Cliente', fields: [
            { id: 'razon', type: 'text', field: 'razonSocial', label: 'Razon Social', required: true },
            { id: 'rif', type: 'text', field: 'rif', label: 'RIF / NIT', required: true },
            { id: 'email', type: 'email', field: 'email', label: 'Email' },
            { id: 'telefono', type: 'phone', field: 'telefono', label: 'Telefono' },
            { id: 'contacto', type: 'text', field: 'contacto', label: 'Persona de Contacto' },
            { id: 'tipo', type: 'select', field: 'tipo', label: 'Tipo', props: { options: [{ value: 'empresa', label: 'Empresa' }, { value: 'persona', label: 'Persona Natural' }] } },
          ]},
          { id: 's2', title: 'Direccion', fields: [
            { id: 'direccion', type: 'address', field: 'direccion', label: 'Direccion Fiscal', colSpan: 2 },
          ]},
          { id: 's3', title: 'Configuracion', fields: [
            { id: 'limite', type: 'currency', field: 'limiteCredito', label: 'Limite de Credito' },
            { id: 'plazo', type: 'number', field: 'plazoPago', label: 'Plazo de Pago (dias)' },
            { id: 'tags', type: 'chips', field: 'tags', label: 'Etiquetas', colSpan: 2, props: { allowCustom: true, colorMode: 'auto', options: [{ value: 'vip', label: 'VIP' }, { value: 'mayorista', label: 'Mayorista' }, { value: 'credito', label: 'Credito' }] } },
            { id: 'activo', type: 'switch', field: 'activo', label: 'Cliente Activo' },
          ]},
        ], actions: [{ id: 'save', type: 'submit', label: 'Guardar Cliente', variant: 'primary' }, { id: 'cancel', type: 'reset', label: 'Cancelar', variant: 'secondary' }] },
      },
      {
        id: 'employee', icon: '👷', title: 'Empleado', desc: 'Datos personales, laborales, salario',
        schema: { id: 'employee', version: '1.0', title: 'Ficha de Empleado', layout: { type: 'grid', columns: 3, gap: 16 }, sections: [
          { id: 's1', title: 'Datos Personales', fields: [
            { id: 'nombre', type: 'text', field: 'nombre', label: 'Nombre', required: true },
            { id: 'apellido', type: 'text', field: 'apellido', label: 'Apellido', required: true },
            { id: 'cedula', type: 'text', field: 'cedula', label: 'Cedula', required: true },
            { id: 'fechaNac', type: 'date', field: 'fechaNacimiento', label: 'Fecha Nacimiento' },
            { id: 'genero', type: 'select', field: 'genero', label: 'Genero', props: { options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }] } },
            { id: 'email', type: 'email', field: 'email', label: 'Email' },
          ]},
          { id: 's2', title: 'Datos Laborales', fields: [
            { id: 'fechaIngreso', type: 'date', field: 'fechaIngreso', label: 'Fecha Ingreso', required: true },
            { id: 'depto', type: 'text', field: 'departamento', label: 'Departamento' },
            { id: 'cargo', type: 'text', field: 'cargo', label: 'Cargo', required: true },
            { id: 'salario', type: 'currency', field: 'salario', label: 'Salario', required: true },
            { id: 'contrato', type: 'select', field: 'tipoContrato', label: 'Contrato', props: { options: [{ value: 'indefinido', label: 'Indefinido' }, { value: 'temporal', label: 'Temporal' }, { value: 'prueba', label: 'Prueba' }] } },
            { id: 'activo', type: 'switch', field: 'activo', label: 'Activo' },
          ]},
        ], actions: [{ id: 'save', type: 'submit', label: 'Guardar Empleado', variant: 'primary' }, { id: 'cancel', type: 'reset', label: 'Cancelar', variant: 'secondary' }] },
      },
      {
        id: 'invoice', icon: '📄', title: 'Factura', desc: 'Cabecera de factura con campos fiscales',
        schema: { id: 'invoice', version: '1.0', title: 'Factura de Venta', layout: { type: 'grid', columns: 3, gap: 16 }, sections: [
          { id: 's1', title: 'Datos de la Factura', fields: [
            { id: 'numero', type: 'text', field: 'numero', label: 'Numero', required: true, readOnly: true },
            { id: 'fecha', type: 'date', field: 'fecha', label: 'Fecha', required: true },
            { id: 'vencimiento', type: 'date', field: 'fechaVencimiento', label: 'Vencimiento' },
            { id: 'cliente', type: 'lookup', field: 'clienteId', label: 'Cliente', required: true, colSpan: 2, props: { placeholder: 'Buscar cliente...' } },
            { id: 'vendedor', type: 'select', field: 'vendedorId', label: 'Vendedor' },
          ]},
          { id: 's2', title: 'Totales', fields: [
            { id: 'subtotal', type: 'currency', field: 'subtotal', label: 'Subtotal', readOnly: true },
            { id: 'iva', type: 'currency', field: 'iva', label: 'IVA', readOnly: true },
            { id: 'total', type: 'currency', field: 'total', label: 'Total', readOnly: true },
            { id: 'observaciones', type: 'textarea', field: 'observaciones', label: 'Observaciones', colSpan: 3 },
          ]},
        ], actions: [{ id: 'save', type: 'submit', label: 'Guardar Factura', variant: 'primary' }, { id: 'cancel', type: 'reset', label: 'Cancelar', variant: 'secondary' }] },
      },
      {
        id: 'product', icon: '📦', title: 'Producto', desc: 'Articulo con precio, stock, imagen',
        schema: { id: 'product', version: '1.0', title: 'Ficha de Producto', layout: { type: 'grid', columns: 2, gap: 16 }, sections: [
          { id: 's1', title: 'Datos del Producto', fields: [
            { id: 'codigo', type: 'text', field: 'codigo', label: 'Codigo', required: true },
            { id: 'nombre', type: 'text', field: 'nombre', label: 'Nombre', required: true },
            { id: 'categoria', type: 'select', field: 'categoria', label: 'Categoria', props: { options: [{ value: 'hardware', label: 'Hardware' }, { value: 'software', label: 'Software' }, { value: 'servicio', label: 'Servicio' }] } },
            { id: 'precio', type: 'currency', field: 'precioVenta', label: 'Precio Venta', required: true },
            { id: 'costo', type: 'currency', field: 'costo', label: 'Costo' },
            { id: 'stock', type: 'number', field: 'stock', label: 'Stock Actual' },
            { id: 'desc', type: 'textarea', field: 'descripcion', label: 'Descripcion', colSpan: 2 },
            { id: 'activo', type: 'switch', field: 'activo', label: 'Activo' },
          ]},
        ], actions: [{ id: 'save', type: 'submit', label: 'Guardar Producto', variant: 'primary' }, { id: 'cancel', type: 'reset', label: 'Cancelar', variant: 'secondary' }] },
      },
      {
        id: 'survey', icon: '📋', title: 'Encuesta', desc: 'Formulario con rating, checkboxes, radio',
        schema: { id: 'survey', version: '1.0', title: 'Encuesta de Satisfaccion', layout: { type: 'grid', columns: 1, gap: 20 }, sections: [
          { id: 's1', title: 'Tu Opinion', fields: [
            { id: 'nombre', type: 'text', field: 'nombre', label: 'Tu Nombre' },
            { id: 'satisfaccion', type: 'rating', field: 'satisfaccion', label: 'Nivel de Satisfaccion', required: true, props: { mode: 'rating', maxRating: 5 } },
            { id: 'recomendaria', type: 'radio', field: 'recomendaria', label: 'Recomendarias nuestro servicio?', props: { mode: 'radio', horizontal: true, options: [{ value: 'si', label: 'Si' }, { value: 'no', label: 'No' }, { value: 'tal_vez', label: 'Tal vez' }] } },
            { id: 'aspectos', type: 'chips', field: 'aspectos', label: 'Que te gusto?', props: { allowCustom: false, colorMode: 'auto', options: [{ value: 'atencion', label: 'Atencion' }, { value: 'rapidez', label: 'Rapidez' }, { value: 'calidad', label: 'Calidad' }, { value: 'precio', label: 'Precio' }] } },
            { id: 'comentarios', type: 'textarea', field: 'comentarios', label: 'Comentarios adicionales', placeholder: 'Cuentanos mas...' },
          ]},
        ], actions: [{ id: 'send', type: 'submit', label: 'Enviar Encuesta', variant: 'primary' }] },
      },
    ];

    return html`
      <div style="position:absolute;top:100%;left:0;z-index:100;background:white;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,0.15);width:320px;max-height:400px;overflow-y:auto;margin-top:4px;">
        <div style="padding:10px 12px;border-bottom:1px solid #eee;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">
          Cargar Plantilla
        </div>
        ${templates.map(t => html`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;cursor:pointer;transition:background 0.1s;border-bottom:1px solid #f5f5f5;"
            @click="${() => {
              this.schema = structuredClone(t.schema);
              this.undoStack = [JSON.stringify(this.schema)];
              this.redoStack = [];
              this.selectedFieldId = null;
              this.showTemplateMenu = false;
              this.commitChange();
            }}"
            @mouseenter="${(e: Event) => { (e.currentTarget as HTMLElement).style.background = '#f0f7ff'; }}"
            @mouseleave="${(e: Event) => { (e.currentTarget as HTMLElement).style.background = ''; }}"
          >
            <span style="font-size:22px;margin-top:1px;">${t.icon}</span>
            <div>
              <div style="font-size:13px;font-weight:600;color:#333;">${t.title}</div>
              <div style="font-size:11px;color:#999;margin-top:1px;">${t.desc}</div>
            </div>
          </div>
        `)}
        <div style="padding:8px 14px;border-top:1px solid #eee;">
          <div style="font-size:10px;color:#bbb;text-align:center;">Clic en una plantilla para cargarla</div>
        </div>
      </div>
    `;
  }

  private renderApiAuth() {
    if (this.apiLoggedIn) {
      return html`
        <div style="margin:4px;padding:10px;background:linear-gradient(135deg,#e8f5e9,#f1f8e9);border:1px solid #c8e6c9;border-radius:8px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="width:28px;height:28px;border-radius:50%;background:#27ae60;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">✓</span>
            <div style="flex:1;">
              <div style="font-size:11px;font-weight:600;color:#2e7d32;">Conectado</div>
              <div style="font-size:10px;color:#66bb6a;">${this.apiUser}${this.apiCompany ? ` — ${this.apiCompany}` : ''}</div>
            </div>
            <button style="border:none;background:none;cursor:pointer;font-size:14px;color:#999;padding:2px;" title="Cerrar sesion"
              @click="${() => { this.apiLoggedIn = false; this.apiToken = ''; this.apiUser = ''; this.apiCompany = ''; this.apiBranch = ''; }}"
            >✕</button>
          </div>
          <div style="font-size:9px;color:#81c784;font-family:'SF Mono','Consolas',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${this.apiBaseUrl}">
            🔗 ${this.apiBaseUrl}
          </div>
        </div>
      `;
    }

    return html`
      <div style="margin:4px;padding:10px;background:#fafafa;border:1px solid #eee;border-radius:8px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <span style="font-size:14px;">🔐</span>
          <span style="font-size:11px;font-weight:600;color:#333;">Iniciar Sesion</span>
        </div>

        ${this.apiLoginError ? html`
          <div style="padding:6px 8px;background:#fde8e8;border:1px solid #f5c6cb;border-radius:5px;margin-bottom:8px;font-size:10px;color:#c62828;">
            ⚠ ${this.apiLoginError}
          </div>
        ` : ''}

        <div style="margin-bottom:6px;">
          <label style="font-size:9px;font-weight:600;color:#999;display:block;margin-bottom:2px;">URL Base</label>
          <input id="api-base-url" style="width:100%;padding:5px 8px;border:1px solid #ddd;border-radius:5px;font-size:10px;font-family:'SF Mono','Consolas',monospace;background:white;box-sizing:border-box;outline:none;transition:border-color 0.15s;"
            .value="${this.apiBaseUrl}" placeholder="Vacio = proxy local (recomendado)"
            @input="${(e: Event) => { this.apiBaseUrl = (e.target as HTMLInputElement).value; }}"
            @focus="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#1976d2'; }}"
            @blur="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#ddd'; }}"
          />
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px;">
          <div>
            <label style="font-size:9px;font-weight:600;color:#999;display:block;margin-bottom:2px;">Usuario</label>
            <input id="api-login-user" style="width:100%;padding:5px 8px;border:1px solid #ddd;border-radius:5px;font-size:11px;background:white;box-sizing:border-box;outline:none;font-family:inherit;"
              placeholder="SUP"
              @focus="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#1976d2'; }}"
              @blur="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#ddd'; }}"
            />
          </div>
          <div>
            <label style="font-size:9px;font-weight:600;color:#999;display:block;margin-bottom:2px;">Clave</label>
            <input id="api-login-pass" type="password" style="width:100%;padding:5px 8px;border:1px solid #ddd;border-radius:5px;font-size:11px;background:white;box-sizing:border-box;outline:none;font-family:inherit;"
              placeholder="••••"
              @focus="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#1976d2'; }}"
              @blur="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#ddd'; }}"
              @keydown="${(e: KeyboardEvent) => { if (e.key === 'Enter') this.doApiLogin(); }}"
            />
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;">
          <div>
            <label style="font-size:9px;font-weight:600;color:#999;display:block;margin-bottom:2px;">Empresa (cod)</label>
            <input id="api-login-company" style="width:100%;padding:5px 8px;border:1px solid #ddd;border-radius:5px;font-size:11px;background:white;box-sizing:border-box;outline:none;font-family:inherit;"
              placeholder="01" value="01"
              @focus="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#1976d2'; }}"
              @blur="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#ddd'; }}"
            />
          </div>
          <div>
            <label style="font-size:9px;font-weight:600;color:#999;display:block;margin-bottom:2px;">Sucursal</label>
            <input id="api-login-branch" style="width:100%;padding:5px 8px;border:1px solid #ddd;border-radius:5px;font-size:11px;background:white;box-sizing:border-box;outline:none;font-family:inherit;"
              placeholder="01" value="01"
              @focus="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#1976d2'; }}"
              @blur="${(e: Event) => { (e.target as HTMLElement).style.borderColor = '#ddd'; }}"
            />
          </div>
        </div>

        <button style="width:100%;padding:8px;border:none;border-radius:6px;background:#1976d2;color:white;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all 0.15s;${this.apiLoginLoading ? 'opacity:0.7;pointer-events:none;' : ''}"
          @click="${this.doApiLogin}"
          @mouseenter="${(e: Event) => { (e.target as HTMLElement).style.background = '#1565c0'; }}"
          @mouseleave="${(e: Event) => { (e.target as HTMLElement).style.background = '#1976d2'; }}"
        >${this.apiLoginLoading ? '⏳ Conectando...' : '🔑 Iniciar Sesion'}</button>

        <div style="margin-top:6px;font-size:9px;color:#bbb;text-align:center;">
          Usa las mismas credenciales de Zentto ERP
        </div>
      </div>
    `;
  }

  private async doApiLogin() {
    const userInput = this.shadowRoot?.querySelector('#api-login-user') as HTMLInputElement;
    const passInput = this.shadowRoot?.querySelector('#api-login-pass') as HTMLInputElement;
    const companyInput = this.shadowRoot?.querySelector('#api-login-company') as HTMLInputElement;
    const branchInput = this.shadowRoot?.querySelector('#api-login-branch') as HTMLInputElement;

    const user = userInput?.value?.trim();
    const pass = passInput?.value?.trim();
    if (!user || !pass) { this.apiLoginError = 'Usuario y clave son requeridos'; return; }

    this.apiLoginLoading = true;
    this.apiLoginError = '';

    try {
      // Use relative URL so Next.js proxy handles CORS, or provider's fetchData
      const loginUrl = this.apiBaseUrl ? `${this.apiBaseUrl}/v1/auth/login` : '/v1/auth/login';
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: user,
          clave: pass,
          empresa: companyInput?.value?.trim() || '01',
          sucursal: branchInput?.value?.trim() || '01',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.mensaje ?? errData?.message ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      this.apiToken = data.token ?? data.accessToken ?? data.jwt ?? '';
      this.apiUser = data.usuario ?? data.user?.nombre ?? user;
      this.apiCompany = data.empresa ?? companyInput?.value ?? '';
      this.apiBranch = data.sucursal ?? branchInput?.value ?? '';
      this.apiLoggedIn = true;

      // Emit for host app
      this.dispatchEvent(new CustomEvent('api-login', {
        detail: { token: this.apiToken, user: this.apiUser, company: this.apiCompany, baseUrl: this.apiBaseUrl },
        bubbles: true, composed: true,
      }));
    } catch (err) {
      this.apiLoginError = err instanceof Error ? err.message : 'Error de conexion';
    }

    this.apiLoginLoading = false;
  }

  private async fetchApiFields() {
    const urlInput = this.shadowRoot?.querySelector('#api-url') as HTMLInputElement;
    const methodSelect = this.shadowRoot?.querySelector('#api-method') as HTMLSelectElement;
    if (!urlInput?.value) return;

    const endpoint = urlInput.value;
    const method = methodSelect?.value ?? 'GET';
    this.apiLoading = true;

    try {
      // Use relative URL (proxied by Next.js) or absolute if base URL set
      const fullUrl = endpoint.startsWith('http') ? endpoint : this.apiBaseUrl ? `${this.apiBaseUrl}${endpoint}` : endpoint;

      // Build headers with auth token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(this.provider.getAuthHeaders?.() ?? {}),
      };
      if (this.apiToken) {
        headers['Authorization'] = `Bearer ${this.apiToken}`;
      }
      if (this.apiCompany) headers['x-empresa'] = this.apiCompany;
      if (this.apiBranch) headers['x-sucursal'] = this.apiBranch;

      let data: unknown;
      if (this.provider.fetchData) {
        data = await this.provider.fetchData(fullUrl, { method, headers });
      } else {
        const res = await fetch(fullUrl, { method, headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        data = await res.json();
      }

      // Extract fields from response
      const fields = this.extractFieldNames(data);
      const name = endpoint.split('/').filter(Boolean).pop() ?? 'API';

      const src = { id: 'api_' + Date.now(), name: name.charAt(0).toUpperCase() + name.slice(1), endpoint, method, fields };
      this.apiSources = [...this.apiSources, src];

      // Emit for host app
      this.dispatchEvent(new CustomEvent('api-connected', {
        detail: { source: src, data },
        bubbles: true, composed: true,
      }));
    } catch (err) {
      // Show error inline
      const src = { id: 'error_' + Date.now(), name: '⚠ Error: ' + (err instanceof Error ? err.message : 'Fallo la conexion'), endpoint, method, fields: [] };
      this.apiSources = [...this.apiSources, src];
    }

    this.apiLoading = false;
  }

  private extractFieldNames(data: unknown): string[] {
    if (!data) return [];
    // If array, take first item
    let sample: Record<string, unknown>;
    if (Array.isArray(data)) {
      if (data.length === 0) return [];
      sample = data[0] as Record<string, unknown>;
    } else if (typeof data === 'object') {
      // Check for common response wrappers
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.data)) return this.extractFieldNames(obj.data);
      if (Array.isArray(obj.rows)) return this.extractFieldNames(obj.rows);
      if (Array.isArray(obj.items)) return this.extractFieldNames(obj.items);
      if (Array.isArray(obj.results)) return this.extractFieldNames(obj.results);
      sample = obj;
    } else {
      return [];
    }

    return Object.keys(sample).filter(k => !k.startsWith('_'));
  }

  private renderToggle(label: string, value: boolean, onChange: (v: boolean) => void) {
    return html`
      <div class="prop-toggle">
        <button class="prop-switch ${value ? 'prop-switch--active' : ''}"
          @click="${() => onChange(!value)}"
        ></button>
        <span class="prop-toggle-label">${label}</span>
      </div>
    `;
  }

  private toggleSection(id: string) {
    const next = new Set(this.collapsedSections);
    if (next.has(id)) next.delete(id); else next.add(id);
    this.collapsedSections = next;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-page-designer': ZsPageDesigner;
  }
}
