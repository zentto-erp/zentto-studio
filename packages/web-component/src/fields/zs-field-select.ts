// @zentto/studio — Select field web component
// Handles: select, multiselect, tags

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

@customElement('zs-field-select')
export class ZsFieldSelect extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-select {
      height: var(--zs-input-height);
      padding: var(--zs-input-padding);
      border: var(--zs-input-border);
      border-radius: var(--zs-radius);
      background: var(--zs-input-bg);
      color: var(--zs-text);
      font-family: var(--zs-font-family);
      font-size: var(--zs-font-size);
      outline: none;
      width: 100%;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
      transition: border-color var(--zs-transition), box-shadow var(--zs-transition);
    }
    .zs-select:focus {
      border-color: var(--zs-border-focus);
      box-shadow: 0 0 0 3px var(--zs-primary-light);
    }
    .zs-select:disabled { opacity: 0.6; cursor: not-allowed; }
    .zs-select--error { border-color: var(--zs-danger); }
    .zs-select--multiple { height: auto; min-height: 80px; }
    .zs-tags {
      display: flex; flex-wrap: wrap; gap: 4px;
      padding: 4px; border: var(--zs-input-border); border-radius: var(--zs-radius);
      background: var(--zs-input-bg); min-height: var(--zs-input-height);
      align-items: center; cursor: text;
    }
    .zs-tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; border-radius: 12px;
      background: var(--zs-primary-light); color: var(--zs-primary);
      font-size: var(--zs-font-size-sm);
    }
    .zs-tag-remove {
      cursor: pointer; font-size: 14px; line-height: 1;
      color: var(--zs-primary-hover);
    }
    .zs-tag-input {
      border: none; outline: none; flex: 1; min-width: 60px;
      font-family: var(--zs-font-family); font-size: var(--zs-font-size);
      background: transparent; color: var(--zs-text);
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() value: string | number | (string | number)[] = '';
  @property() placeholder = 'Seleccione...';
  @property() helpText = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) multiple = false;
  @property() mode: 'select' | 'tags' = 'select';
  @property({ type: Array }) options: SelectOption[] = [];
  @property({ type: Array }) errors: string[] = [];

  private handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    let value: string | number | (string | number)[];

    if (this.multiple) {
      value = Array.from(select.selectedOptions).map(o => o.value);
    } else {
      value = select.value;
    }

    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value },
      bubbles: true, composed: true,
    }));
  }

  private removeTag(tagValue: string | number) {
    if (this.disabled) return;
    const currentValues = Array.isArray(this.value) ? this.value : [];
    const newValues = currentValues.filter(v => v !== tagValue);
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: newValues },
      bubbles: true, composed: true,
    }));
  }

  private handleTagInput(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const tag = input.value.trim();
    if (!tag) return;

    const currentValues = Array.isArray(this.value) ? [...this.value] : [];
    if (!currentValues.includes(tag)) {
      currentValues.push(tag);
      this.dispatchEvent(new CustomEvent('field-change', {
        detail: { fieldId: this.fieldId, value: currentValues },
        bubbles: true, composed: true,
      }));
    }
    input.value = '';
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        ${this.mode === 'tags' ? this.renderTags() : this.renderSelect(hasError)}
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }

  private renderSelect(hasError: boolean) {
    const classes = [
      'zs-select',
      hasError ? 'zs-select--error' : '',
      this.multiple ? 'zs-select--multiple' : '',
    ].filter(Boolean).join(' ');

    const selectedValues = Array.isArray(this.value) ? this.value.map(String) : [String(this.value)];

    // Group options
    const groups = new Map<string, SelectOption[]>();
    const ungrouped: SelectOption[] = [];
    for (const opt of this.options) {
      if (opt.group) {
        if (!groups.has(opt.group)) groups.set(opt.group, []);
        groups.get(opt.group)!.push(opt);
      } else {
        ungrouped.push(opt);
      }
    }

    return html`
      <select
        class="${classes}"
        ?disabled="${this.disabled}"
        ?multiple="${this.multiple}"
        @change="${this.handleChange}"
      >
        ${!this.multiple ? html`<option value="" ?selected="${!this.value}">${this.placeholder}</option>` : ''}
        ${ungrouped.map(opt => html`
          <option
            value="${opt.value}"
            ?selected="${selectedValues.includes(String(opt.value))}"
            ?disabled="${opt.disabled}"
          >${opt.label}</option>
        `)}
        ${Array.from(groups).map(([group, opts]) => html`
          <optgroup label="${group}">
            ${opts.map(opt => html`
              <option
                value="${opt.value}"
                ?selected="${selectedValues.includes(String(opt.value))}"
                ?disabled="${opt.disabled}"
              >${opt.label}</option>
            `)}
          </optgroup>
        `)}
      </select>
    `;
  }

  private renderTags() {
    const tags = Array.isArray(this.value) ? this.value : [];
    return html`
      <div class="zs-tags">
        ${tags.map(tag => html`
          <span class="zs-tag">
            ${tag}
            <span class="zs-tag-remove" @click="${() => this.removeTag(tag)}">×</span>
          </span>
        `)}
        <input
          class="zs-tag-input"
          placeholder="${tags.length === 0 ? this.placeholder : ''}"
          ?disabled="${this.disabled}"
          @keydown="${this.handleTagInput}"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-field-select': ZsFieldSelect;
  }
}
