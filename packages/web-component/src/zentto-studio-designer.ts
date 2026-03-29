// @zentto/studio — Designer web component (placeholder for Phase 5)
// <zentto-studio-designer> provides visual drag-drop form building

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { studioTokens } from './styles/tokens.js';
import type { StudioSchema } from '@zentto/studio-core';

@customElement('zentto-studio-designer')
export class ZenttoStudioDesigner extends LitElement {
  static styles = [studioTokens, css`
    :host { display: block; font-family: var(--zs-font-family); }
    .zs-designer {
      display: grid; grid-template-columns: 240px 1fr 280px;
      height: 100%; min-height: 500px;
      border: 1px solid var(--zs-border); border-radius: var(--zs-radius-lg);
      overflow: hidden;
    }
    .zs-designer-panel {
      border-right: 1px solid var(--zs-border); padding: var(--zs-spacing-md);
      overflow-y: auto; background: var(--zs-bg-secondary);
    }
    .zs-designer-panel:last-child { border-right: none; }
    .zs-designer-canvas {
      padding: var(--zs-spacing-lg); overflow-y: auto; background: var(--zs-bg);
    }
    .zs-designer-placeholder {
      display: flex; align-items: center; justify-content: center;
      height: 100%; color: var(--zs-text-muted); font-size: var(--zs-font-size-lg);
      text-align: center; padding: var(--zs-spacing-xl);
    }
    .zs-panel-title {
      font-size: var(--zs-font-size-sm); font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px;
      color: var(--zs-text-secondary); margin: 0 0 var(--zs-spacing-sm) 0;
    }
  `];

  @property({ type: Object }) schema: StudioSchema | null = null;

  render() {
    return html`
      <div class="zs-designer">
        <div class="zs-designer-panel">
          <h4 class="zs-panel-title">Componentes</h4>
          <div class="zs-designer-placeholder">
            Toolbox de campos<br/>(Fase 5)
          </div>
        </div>
        <div class="zs-designer-canvas">
          <div class="zs-designer-placeholder">
            Canvas de diseño<br/>Arrastra campos aquí<br/>(Fase 5)
          </div>
        </div>
        <div class="zs-designer-panel">
          <h4 class="zs-panel-title">Propiedades</h4>
          <div class="zs-designer-placeholder">
            Panel de propiedades<br/>(Fase 5)
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zentto-studio-designer': ZenttoStudioDesigner;
  }
}
