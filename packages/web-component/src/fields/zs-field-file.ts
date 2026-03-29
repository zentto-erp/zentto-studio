// @zentto/studio — File upload field

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

@customElement('zs-field-file')
export class ZsFieldFile extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-dropzone {
      border: 2px dashed var(--zs-border);
      border-radius: var(--zs-radius-lg);
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all var(--zs-transition);
      background: var(--zs-bg-secondary);
    }
    .zs-dropzone:hover, .zs-dropzone--dragover {
      border-color: var(--zs-primary);
      background: var(--zs-primary-light);
    }
    .zs-dropzone-icon { font-size: 32px; margin-bottom: 8px; }
    .zs-dropzone-text {
      font-size: var(--zs-font-size);
      color: var(--zs-text-secondary);
    }
    .zs-dropzone-hint {
      font-size: var(--zs-font-size-sm);
      color: var(--zs-text-muted);
      margin-top: 4px;
    }
    .zs-file-list { margin-top: 8px; }
    .zs-file-item {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 10px; border-radius: var(--zs-radius);
      background: var(--zs-bg-secondary); margin-bottom: 4px;
      font-size: var(--zs-font-size-sm);
    }
    .zs-file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .zs-file-size { color: var(--zs-text-muted); }
    .zs-file-remove {
      cursor: pointer; color: var(--zs-danger); font-size: 16px;
      border: none; background: none; padding: 0;
    }
    .zs-preview-img {
      width: 100%; max-height: 200px; object-fit: contain;
      border-radius: var(--zs-radius); margin-top: 8px;
    }
    input[type="file"] { display: none; }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() helpText = '';
  @property() accept = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) multiple = false;
  @property({ type: Array }) errors: string[] = [];
  @state() private files: File[] = [];
  @state() private preview = '';
  @state() private dragover = false;

  private handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    this.files = this.multiple ? [...this.files, ...newFiles] : newFiles;

    // Preview for images
    if (this.accept.includes('image') && newFiles[0]) {
      const reader = new FileReader();
      reader.onload = () => { this.preview = reader.result as string; };
      reader.readAsDataURL(newFiles[0]);
    }

    this.dispatchEvent(new CustomEvent('field-change', {
      detail: {
        fieldId: this.fieldId,
        value: this.multiple ? this.files : this.files[0] ?? null,
      },
      bubbles: true, composed: true,
    }));
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    this.dragover = false;
    this.handleFiles(e.dataTransfer?.files ?? null);
  }

  private removeFile(index: number) {
    this.files = this.files.filter((_, i) => i !== index);
    if (this.files.length === 0) this.preview = '';
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: this.multiple ? this.files : null },
      bubbles: true, composed: true,
    }));
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;
    const dropzoneClass = `zs-dropzone ${this.dragover ? 'zs-dropzone--dragover' : ''}`;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <div
          class="${dropzoneClass}"
          @click="${() => this.shadowRoot?.querySelector('input')?.click()}"
          @dragover="${(e: DragEvent) => { e.preventDefault(); this.dragover = true; }}"
          @dragleave="${() => { this.dragover = false; }}"
          @drop="${this.handleDrop}"
        >
          <div class="zs-dropzone-icon">📁</div>
          <div class="zs-dropzone-text">Haga clic o arrastre archivos aqui</div>
          ${this.accept ? html`<div class="zs-dropzone-hint">Formatos: ${this.accept}</div>` : ''}
        </div>
        <input
          type="file"
          accept="${this.accept}"
          ?multiple="${this.multiple}"
          ?disabled="${this.disabled}"
          @change="${(e: Event) => this.handleFiles((e.target as HTMLInputElement).files)}"
        />
        ${this.preview ? html`<img class="zs-preview-img" src="${this.preview}" alt="Preview" />` : ''}
        ${this.files.length > 0 ? html`
          <div class="zs-file-list">
            ${this.files.map((f, i) => html`
              <div class="zs-file-item">
                <span class="zs-file-name">${f.name}</span>
                <span class="zs-file-size">${this.formatSize(f.size)}</span>
                <button class="zs-file-remove" @click="${() => this.removeFile(i)}">×</button>
              </div>
            `)}
          </div>
        ` : ''}
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-file': ZsFieldFile; } }
