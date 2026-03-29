// @zentto/studio — Tree View field component
// Recursive tree with expand/collapse, selection, icons, drag-drop ready

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fieldBaseStyles } from '../styles/tokens.js';

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  disabled?: boolean;
  data?: unknown;
}

@customElement('zs-field-treeview')
export class ZsFieldTreeView extends LitElement {
  static styles = [fieldBaseStyles, css`
    :host { display: block; }
    .zs-tree {
      font-family: var(--zs-font-family, sans-serif);
      font-size: var(--zs-font-size, 14px);
      color: var(--zs-text, #212529);
      border: 1px solid var(--zs-border, #dee2e6);
      border-radius: var(--zs-radius, 6px);
      padding: 8px;
      max-height: 400px;
      overflow-y: auto;
      background: var(--zs-bg, white);
    }
    .zs-tree-node { user-select: none; }
    .zs-tree-row {
      display: flex; align-items: center; gap: 4px;
      padding: 4px 6px; border-radius: 4px;
      cursor: pointer; transition: background 100ms;
    }
    .zs-tree-row:hover { background: var(--zs-bg-hover, #f1f3f5); }
    .zs-tree-row--selected {
      background: var(--zs-primary-light, #fdebd0);
      color: var(--zs-primary, #e67e22);
    }
    .zs-tree-row--disabled { opacity: 0.5; cursor: not-allowed; }
    .zs-tree-toggle {
      width: 20px; height: 20px; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; font-size: 10px;
      color: var(--zs-text-muted, #adb5bd); transition: transform 150ms;
    }
    .zs-tree-toggle--expanded { transform: rotate(90deg); }
    .zs-tree-toggle--leaf { visibility: hidden; }
    .zs-tree-icon { flex-shrink: 0; font-size: 16px; }
    .zs-tree-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .zs-tree-children { padding-left: 20px; }
    .zs-tree-search {
      margin-bottom: 8px;
    }
    .zs-tree-search input {
      width: 100%; padding: 6px 10px; border: 1px solid var(--zs-border, #dee2e6);
      border-radius: 4px; font-size: 13px; outline: none;
      background: var(--zs-bg-secondary, #f8f9fa);
    }
    .zs-tree-search input:focus {
      border-color: var(--zs-primary, #e67e22);
    }
    .zs-tree-count {
      font-size: 11px; color: var(--zs-text-muted, #adb5bd);
      margin-top: 4px; text-align: right;
    }
    .zs-tree-checkbox {
      accent-color: var(--zs-primary, #e67e22);
      width: 15px; height: 15px; flex-shrink: 0;
    }
  `];

  @property() fieldId = '';
  @property() label = '';
  @property() helpText = '';
  @property({ type: Array }) nodes: TreeNode[] = [];
  @property({ type: Array }) value: string[] = []; // selected node IDs
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) multiSelect = false;
  @property({ type: Boolean }) showCheckboxes = false;
  @property({ type: Boolean }) searchable = false;
  @property({ type: Array }) errors: string[] = [];

  @state() private expanded = new Set<string>();
  @state() private searchQuery = '';

  private toggleExpand(nodeId: string) {
    const next = new Set(this.expanded);
    if (next.has(nodeId)) next.delete(nodeId);
    else next.add(nodeId);
    this.expanded = next;
  }

  private selectNode(node: TreeNode) {
    if (node.disabled || this.disabled) return;

    let newValue: string[];
    if (this.multiSelect) {
      newValue = this.value.includes(node.id)
        ? this.value.filter(v => v !== node.id)
        : [...this.value, node.id];
    } else {
      newValue = this.value.includes(node.id) ? [] : [node.id];
    }

    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { fieldId: this.fieldId, value: this.multiSelect ? newValue : (newValue[0] ?? null) },
      bubbles: true, composed: true,
    }));

    this.dispatchEvent(new CustomEvent('tree-select', {
      detail: { fieldId: this.fieldId, nodeId: node.id, node },
      bubbles: true, composed: true,
    }));
  }

  private matchesSearch(node: TreeNode): boolean {
    if (!this.searchQuery) return true;
    const q = this.searchQuery.toLowerCase();
    if (node.label.toLowerCase().includes(q)) return true;
    return node.children?.some(c => this.matchesSearch(c)) ?? false;
  }

  private countNodes(nodes: TreeNode[]): number {
    let count = 0;
    for (const n of nodes) {
      count++;
      if (n.children) count += this.countNodes(n.children);
    }
    return count;
  }

  render() {
    const hasError = this.errors.length > 0;
    const labelClass = `zs-label ${this.required ? 'zs-label--required' : ''}`;
    const filtered = this.searchQuery ? this.nodes.filter(n => this.matchesSearch(n)) : this.nodes;

    return html`
      <div class="zs-field">
        ${this.label ? html`<label class="${labelClass}">${this.label}</label>` : ''}
        <div class="zs-tree">
          ${this.searchable ? html`
            <div class="zs-tree-search">
              <input type="text" placeholder="Buscar..." .value="${this.searchQuery}"
                @input="${(e: Event) => { this.searchQuery = (e.target as HTMLInputElement).value; }}" />
            </div>
          ` : ''}
          ${filtered.map(node => this.renderNode(node, 0))}
          <div class="zs-tree-count">${this.countNodes(this.nodes)} elementos</div>
        </div>
        ${hasError ? html`<span class="zs-error">${this.errors[0]}</span>` : ''}
        ${this.helpText && !hasError ? html`<span class="zs-help">${this.helpText}</span>` : ''}
      </div>
    `;
  }

  private renderNode(node: TreeNode, depth: number): unknown {
    if (this.searchQuery && !this.matchesSearch(node)) return '';

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expanded.has(node.id);
    const isSelected = this.value.includes(node.id);
    const selectedValues = Array.isArray(this.value) ? this.value : [this.value];

    const rowClasses = [
      'zs-tree-row',
      isSelected ? 'zs-tree-row--selected' : '',
      node.disabled ? 'zs-tree-row--disabled' : '',
    ].filter(Boolean).join(' ');

    const toggleClass = [
      'zs-tree-toggle',
      hasChildren ? (isExpanded ? 'zs-tree-toggle--expanded' : '') : 'zs-tree-toggle--leaf',
    ].filter(Boolean).join(' ');

    return html`
      <div class="zs-tree-node">
        <div class="${rowClasses}" @click="${() => this.selectNode(node)}">
          <span class="${toggleClass}" @click="${(e: Event) => { e.stopPropagation(); this.toggleExpand(node.id); }}">▶</span>
          ${this.showCheckboxes ? html`
            <input type="checkbox" class="zs-tree-checkbox"
              .checked="${selectedValues.includes(node.id)}"
              ?disabled="${node.disabled || this.disabled}"
              @click="${(e: Event) => e.stopPropagation()}"
              @change="${() => this.selectNode(node)}" />
          ` : ''}
          ${node.icon ? html`<span class="zs-tree-icon">${node.icon}</span>` : ''}
          <span class="zs-tree-label">${node.label}</span>
        </div>
        ${hasChildren && isExpanded ? html`
          <div class="zs-tree-children">
            ${node.children!.map(child => this.renderNode(child, depth + 1))}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-field-treeview': ZsFieldTreeView; } }
