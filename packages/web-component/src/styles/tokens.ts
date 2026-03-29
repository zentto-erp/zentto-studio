// @zentto/studio — CSS custom properties (design tokens)
// Prefix: --zs-* (Zentto Studio)

import { css } from 'lit';

export const studioTokens = css`
  :host {
    /* Colors */
    --zs-primary: #e67e22;
    --zs-primary-hover: #d35400;
    --zs-primary-light: #fdebd0;
    --zs-accent: #3498db;
    --zs-danger: #e74c3c;
    --zs-success: #27ae60;
    --zs-warning: #f39c12;
    --zs-info: #2980b9;

    /* Neutrals */
    --zs-bg: #ffffff;
    --zs-bg-secondary: #f8f9fa;
    --zs-bg-hover: #f1f3f5;
    --zs-text: #212529;
    --zs-text-secondary: #6c757d;
    --zs-text-muted: #adb5bd;
    --zs-border: #dee2e6;
    --zs-border-focus: var(--zs-primary);
    --zs-shadow: rgba(0, 0, 0, 0.08);

    /* Typography */
    --zs-font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    --zs-font-size: 14px;
    --zs-font-size-sm: 12px;
    --zs-font-size-lg: 16px;
    --zs-font-size-xl: 20px;
    --zs-line-height: 1.5;

    /* Spacing */
    --zs-spacing-xs: 4px;
    --zs-spacing-sm: 8px;
    --zs-spacing-md: 16px;
    --zs-spacing-lg: 24px;
    --zs-spacing-xl: 32px;

    /* Border */
    --zs-radius: 6px;
    --zs-radius-sm: 4px;
    --zs-radius-lg: 8px;

    /* Input */
    --zs-input-height: 38px;
    --zs-input-padding: 8px 12px;
    --zs-input-border: 1px solid var(--zs-border);
    --zs-input-bg: var(--zs-bg);

    /* Label */
    --zs-label-font-size: 13px;
    --zs-label-font-weight: 500;
    --zs-label-color: var(--zs-text);
    --zs-label-margin: 0 0 4px 0;

    /* Transitions */
    --zs-transition: 150ms ease;
  }

  :host([theme="dark"]) {
    --zs-bg: #1a1a2e;
    --zs-bg-secondary: #16213e;
    --zs-bg-hover: #0f3460;
    --zs-text: #eaeaea;
    --zs-text-secondary: #a0a0a0;
    --zs-text-muted: #666;
    --zs-border: #333;
    --zs-shadow: rgba(0, 0, 0, 0.3);
    --zs-input-bg: #16213e;
  }
`;

export const fieldBaseStyles = css`
  .zs-field {
    display: flex;
    flex-direction: column;
    font-family: var(--zs-font-family);
    font-size: var(--zs-font-size);
    color: var(--zs-text);
  }

  .zs-field--horizontal {
    flex-direction: row;
    align-items: center;
    gap: var(--zs-spacing-sm);
  }

  .zs-label {
    font-size: var(--zs-label-font-size);
    font-weight: var(--zs-label-font-weight);
    color: var(--zs-label-color);
    margin: var(--zs-label-margin);
    user-select: none;
  }

  .zs-label--required::after {
    content: ' *';
    color: var(--zs-danger);
  }

  .zs-input {
    height: var(--zs-input-height);
    padding: var(--zs-input-padding);
    border: var(--zs-input-border);
    border-radius: var(--zs-radius);
    background: var(--zs-input-bg);
    color: var(--zs-text);
    font-family: var(--zs-font-family);
    font-size: var(--zs-font-size);
    outline: none;
    transition: border-color var(--zs-transition), box-shadow var(--zs-transition);
    box-sizing: border-box;
    width: 100%;
  }

  .zs-input:focus {
    border-color: var(--zs-border-focus);
    box-shadow: 0 0 0 3px var(--zs-primary-light);
  }

  .zs-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--zs-bg-secondary);
  }

  .zs-input::placeholder {
    color: var(--zs-text-muted);
  }

  .zs-input--error {
    border-color: var(--zs-danger);
  }

  .zs-input--error:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15);
  }

  .zs-error {
    font-size: var(--zs-font-size-sm);
    color: var(--zs-danger);
    margin-top: 2px;
  }

  .zs-help {
    font-size: var(--zs-font-size-sm);
    color: var(--zs-text-muted);
    margin-top: 2px;
  }

  .zs-textarea {
    min-height: 80px;
    resize: vertical;
    height: auto;
  }
`;
