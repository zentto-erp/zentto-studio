// @zentto/studio — Number field web component
// Handles: number, currency, percentage, slider, rating

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

@customElement('zs-field-number')
export class ZsFieldNumber extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-number-wrapper { position: relative; }
    .zs-prefix, .zs-suffix {
      position: absolute; top: 50%; transform: translateY(-50%);
      color: var(--zs-text-muted); font-size: var(--zs-font-size-sm);
      pointer-events: none;
    }
    .zs-prefix { left: 12px; }
    .zs-suffix { right: 12px; }
    .zs-input--has-prefix { padding-left: 28px; }
    .zs-input--has-suffix { padding-right: 28px; }
    .zs-slider { width: 100%; accent-color: var(--zs-primary); height: 6px; cursor: pointer; }
    .zs-slider-value { font-size: var(--zs-font-size-sm); color: var(--zs-text-secondary); text-align: right; }
    .zs-rating { display: flex; gap: 2px; cursor: pointer; }
    .zs-star { font-size: 24px; color: var(--zs-border); transition: color var(--zs-transition); }
    .zs-star--active { color: #f1c40f; }
    .zs-star:hover { color: #f39c12; }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property({ type: Number }) value: number | null = null;
  @property() placeholder = '';
  @property() helpText = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readOnly = false;
  @property({ type: Boolean }) isCurrency = false;
  @property({ type: Boolean }) isPercentage = false;
  @property() currencySymbol = '$';
  @property() mode: 'input' | 'slider' | 'rating' = 'input';
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) maxRating = 5;
  @property({ type: Array }) errors: string[] = [];

  private emitChange(value: number | null) {
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value },
      bubbles: true, composed: true,
    }));
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const val = input.value === '' ? null : parseFloat(input.value);
    this.emitChange(val);
  }

  private handleSlider(e: Event) {
    const input = e.target as HTMLInputElement;
    this.emitChange(parseFloat(input.value));
  }

  private handleRating(star: number) {
    if (this.disabled || this.readOnly) return;
    this.emitChange(star === this.value ? 0 : star);
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        ${this.mode === 'slider' ? this.renderSlider() :
          this.mode === 'rating' ? this.renderRating() :
          this.renderInput(hasError)}
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }

  private renderInput(hasError: boolean) {
    const classes = [
      'zs-input',
      hasError ? 'zs-input--error' : '',
      this.isCurrency ? 'zs-input--has-prefix' : '',
      this.isPercentage ? 'zs-input--has-suffix' : '',
    ].filter(Boolean).join(' ');

    return html`
      <div class="zs-number-wrapper">
        ${this.isCurrency ? html`<span class="zs-prefix">${this.currencySymbol}</span>` : ''}
        <input
          class="${classes}"
          type="number"
          .value="${this.value != null ? String(this.value) : ''}"
          placeholder="${this.placeholder}"
          step="${this.step}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readOnly}"
          @input="${this.handleInput}"
        />
        ${this.isPercentage ? html`<span class="zs-suffix">%</span>` : ''}
      </div>
    `;
  }

  private renderSlider() {
    return html`
      <input
        class="zs-slider"
        type="range"
        .value="${String(this.value ?? this.min)}"
        min="${this.min}" max="${this.max}" step="${this.step}"
        ?disabled="${this.disabled}"
        @input="${this.handleSlider}"
      />
      <div class="zs-slider-value">${this.value ?? this.min}</div>
    `;
  }

  private renderRating() {
    const stars = Array.from({ length: this.maxRating }, (_, i) => i + 1);
    return html`
      <div class="zs-rating">
        ${stars.map(s => html`
          <span
            class="zs-star ${s <= (this.value ?? 0) ? 'zs-star--active' : ''}"
            @click="${() => this.handleRating(s)}"
          >★</span>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-number': ZsFieldNumber;
  }
}
