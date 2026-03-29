// @zentto/studio — Composite address field

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

interface AddressValue {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

@customElement('zs-field-address')
export class ZsFieldAddress extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-address-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .zs-address-row {
      display: grid;
      gap: 8px;
    }
    .zs-address-row--2 { grid-template-columns: 1fr 1fr; }
    .zs-address-row--3 { grid-template-columns: 2fr 1fr 1fr; }
    .zs-address-mini-label {
      font-size: 11px; color: var(--zs-text-muted);
      margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.3px;
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() helpText = '';
  @property({ type: Object }) value: AddressValue = {};
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readOnly = false;
  @property({ type: Array }) errors: string[] = [];

  private handleChange(subfield: string, e: Event) {
    const input = e.target as HTMLInputElement;
    const newValue = { ...this.value, [subfield]: input.value };
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: newValue },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;
    const inputClass = `zs-input ${hasError ? 'zs-input--error' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <div class="zs-address-grid">
          <div>
            <div class="zs-address-mini-label">Direccion</div>
            <input class="${inputClass}" .value="${this.value.street ?? ''}"
              placeholder="Calle, numero, piso"
              ?disabled="${this.disabled}" ?readonly="${this.readOnly}"
              @input="${(e: Event) => this.handleChange('street', e)}" />
          </div>
          <div class="zs-address-row zs-address-row--3">
            <div>
              <div class="zs-address-mini-label">Ciudad</div>
              <input class="${inputClass}" .value="${this.value.city ?? ''}"
                placeholder="Ciudad"
                ?disabled="${this.disabled}" ?readonly="${this.readOnly}"
                @input="${(e: Event) => this.handleChange('city', e)}" />
            </div>
            <div>
              <div class="zs-address-mini-label">Estado/Provincia</div>
              <input class="${inputClass}" .value="${this.value.state ?? ''}"
                placeholder="Estado"
                ?disabled="${this.disabled}" ?readonly="${this.readOnly}"
                @input="${(e: Event) => this.handleChange('state', e)}" />
            </div>
            <div>
              <div class="zs-address-mini-label">C.P.</div>
              <input class="${inputClass}" .value="${this.value.zip ?? ''}"
                placeholder="Codigo postal"
                ?disabled="${this.disabled}" ?readonly="${this.readOnly}"
                @input="${(e: Event) => this.handleChange('zip', e)}" />
            </div>
          </div>
          <div>
            <div class="zs-address-mini-label">Pais</div>
            <input class="${inputClass}" .value="${this.value.country ?? ''}"
              placeholder="Pais"
              ?disabled="${this.disabled}" ?readonly="${this.readOnly}"
              @input="${(e: Event) => this.handleChange('country', e)}" />
          </div>
        </div>
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-address': ZsFieldAddress; } }
