// @zentto/studio — Signature pad field

import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

@customElement('zs-field-signature')
export class ZsFieldSignature extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-sig-wrapper { position: relative; }
    canvas {
      border: 1px solid var(--zs-border); border-radius: var(--zs-radius);
      cursor: crosshair; touch-action: none; background: white;
      width: 100%; height: 150px;
    }
    .zs-sig-actions {
      display: flex; gap: 8px; margin-top: 6px; justify-content: flex-end;
    }
    .zs-sig-btn {
      border: 1px solid var(--zs-border); background: var(--zs-bg);
      padding: 4px 12px; border-radius: var(--zs-radius);
      cursor: pointer; font-size: var(--zs-font-size-sm);
      color: var(--zs-text-secondary); transition: all var(--zs-transition);
    }
    .zs-sig-btn:hover { background: var(--zs-bg-hover); color: var(--zs-text); }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() helpText = '';
  @property() value = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) penWidth = 2;
  @property() penColor = '#000000';
  @property({ type: Array }) errors: string[] = [];

  @state() private drawing = false;
  @query('canvas') private canvas!: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private lastX = 0;
  private lastY = 0;

  firstUpdated() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    if (this.value) this.loadSignature();

    // Handle resize
    const ro = new ResizeObserver(() => this.resizeCanvas());
    ro.observe(this.canvas);
  }

  private resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    if (this.value) this.loadSignature();
  }

  private loadSignature() {
    if (!this.ctx || !this.value) return;
    const img = new Image();
    img.onload = () => { this.ctx!.drawImage(img, 0, 0); };
    img.src = this.value;
  }

  private getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private startDraw(e: MouseEvent | TouchEvent) {
    if (this.disabled) return;
    e.preventDefault();
    this.drawing = true;
    const pos = this.getPos(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
  }

  private draw(e: MouseEvent | TouchEvent) {
    if (!this.drawing || !this.ctx) return;
    e.preventDefault();
    const pos = this.getPos(e);
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.lastX = pos.x;
    this.lastY = pos.y;
  }

  private endDraw() {
    if (!this.drawing) return;
    this.drawing = false;
    this.emitValue();
  }

  private emitValue() {
    const dataUrl = this.canvas?.toDataURL('image/png') ?? '';
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: dataUrl },
      bubbles: true, composed: true,
    }));
  }

  private clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: '' },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <div class="zs-sig-wrapper">
          <canvas
            @mousedown="${this.startDraw}"
            @mousemove="${this.draw}"
            @mouseup="${this.endDraw}"
            @mouseleave="${this.endDraw}"
            @touchstart="${this.startDraw}"
            @touchmove="${this.draw}"
            @touchend="${this.endDraw}"
          ></canvas>
          <div class="zs-sig-actions">
            <button class="zs-sig-btn" @click="${this.clear}" ?disabled="${this.disabled}">Limpiar</button>
          </div>
        </div>
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-signature': ZsFieldSignature; } }
