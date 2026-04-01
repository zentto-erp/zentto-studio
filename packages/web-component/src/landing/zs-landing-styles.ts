// @zentto/studio — Shared CSS tokens for landing page components
// Prefix: --zl-* (Zentto Landing)

import { css } from 'lit';

export const landingTokens = css`
  :host {
    /* Base unit system */
    --zl-base-unit: 0.25rem;

    /* Layout */
    --zl-max-width: 1200px;
    --zl-section-padding-x: clamp(16px, 5vw, 80px);
    --zl-section-padding-y: clamp(48px, 8vh, 120px);
    --zl-section-gap: clamp(24px, 4vw, 48px);

    /* Typography */
    --zl-font-family: var(--zs-font-family, -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif);
    --zl-heading-font-family: var(--zl-font-family);
    --zl-heading-font-size: clamp(28px, 4vw, 56px);
    --zl-subheading-font-size: clamp(18px, 2.5vw, 28px);
    --zl-body-font-size: clamp(15px, 1.2vw, 18px);
    --zl-small-font-size: clamp(13px, 1vw, 15px);
    --zl-line-height: 1.6;
    --zl-heading-line-height: 1.2;

    /* Typography scale (base-unit multiples) */
    --zl-font-size-xs: 0.75rem;
    --zl-font-size-sm: 0.875rem;
    --zl-font-size-base: 1rem;
    --zl-font-size-lg: 1.25rem;
    --zl-font-size-xl: 1.5rem;
    --zl-font-size-2xl: 2rem;
    --zl-font-size-3xl: 2.5rem;
    --zl-font-size-4xl: 3rem;
    --zl-font-size-5xl: 4rem;

    /* Font weights */
    --zl-font-weight-light: 300;
    --zl-font-weight-normal: 400;
    --zl-font-weight-medium: 500;
    --zl-font-weight-semibold: 600;
    --zl-font-weight-bold: 700;
    --zl-font-weight-extrabold: 800;

    /* Colors */
    --zl-primary: var(--zs-primary, #e67e22);
    --zl-primary-hover: var(--zs-primary-hover, #d35400);
    --zl-primary-light: var(--zs-primary-light, #fdebd0);
    --zl-accent: var(--zs-accent, #3498db);
    --zl-bg: var(--zs-bg, #ffffff);
    --zl-bg-alt: var(--zs-bg-secondary, #f8f9fa);
    --zl-text: var(--zs-text, #212529);
    --zl-text-secondary: var(--zs-text-secondary, #6c757d);
    --zl-text-muted: var(--zs-text-muted, #adb5bd);
    --zl-border: var(--zs-border, #dee2e6);

    /* Primitive color scale (gray) */
    --zl-gray-1: #FFFFFF;
    --zl-gray-2: #F8F9FA;
    --zl-gray-3: #E9ECEF;
    --zl-gray-4: #DEE2E6;
    --zl-gray-5: #ADB5BD;
    --zl-gray-6: #6C757D;
    --zl-gray-7: #495057;
    --zl-gray-8: #343A40;
    --zl-gray-9: #212529;
    --zl-gray-10: #1A1A2E;

    /* Spacing scale (4px increments) */
    --zl-space-1: 0.25rem;
    --zl-space-2: 0.5rem;
    --zl-space-3: 0.75rem;
    --zl-space-4: 1rem;
    --zl-space-5: 1.25rem;
    --zl-space-6: 1.5rem;
    --zl-space-8: 2rem;
    --zl-space-10: 2.5rem;
    --zl-space-12: 3rem;
    --zl-space-16: 4rem;
    --zl-space-20: 5rem;
    --zl-space-24: 6rem;

    /* Content widths */
    --zl-content-narrow: 65ch;
    --zl-content-default: 1140px;
    --zl-content-wide: 1400px;

    /* Line heights */
    --zl-line-height-tight: 1.1;
    --zl-line-height-snug: 1.3;
    --zl-line-height-relaxed: 1.7;

    /* Radius */
    --zl-radius: 8px;
    --zl-radius-lg: 16px;
    --zl-radius-xl: 24px;

    /* Shadows */
    --zl-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
    --zl-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
    --zl-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
    --zl-shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.15);

    /* Transitions */
    --zl-transition: 200ms ease;
    --zl-transition-slow: 400ms ease;

    /* Button defaults */
    --zl-btn-padding: 12px 28px;
    --zl-btn-radius: 8px;
    --zl-btn-font-size: 16px;
    --zl-btn-font-weight: 600;
  }

  /* Dark mode support */
  :host([theme="dark"]) {
    --zl-bg: #1a1a1a;
    --zl-bg-alt: #2a2a2a;
    --zl-text: #f5f5f5;
    --zl-text-secondary: #b0b0b0;
    --zl-text-muted: #888888;
    --zl-border: #444444;
    --zl-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
    --zl-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --zl-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
  }
`;

export const landingResetStyles = css`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; height: auto; display: block; }
  ul, ol { list-style: none; }
`;

export const landingButtonStyles = css`
  .zl-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: var(--zl-btn-padding);
    border: 2px solid transparent;
    border-radius: var(--zl-btn-radius);
    font-family: var(--zl-font-family);
    font-size: var(--zl-btn-font-size);
    font-weight: var(--zl-btn-font-weight);
    cursor: pointer;
    transition: all var(--zl-transition);
    text-decoration: none;
    line-height: 1;
    white-space: nowrap;
  }

  .zl-btn--primary {
    background: var(--zl-primary);
    color: #fff;
    border-color: var(--zl-primary);
  }
  .zl-btn--primary:hover {
    background: var(--zl-primary-hover);
    border-color: var(--zl-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--zl-shadow-md);
  }

  .zl-btn--secondary {
    background: transparent;
    color: var(--zl-primary);
    border-color: var(--zl-primary);
  }
  .zl-btn--secondary:hover {
    background: var(--zl-primary-light);
    transform: translateY(-1px);
  }

  .zl-btn--outline {
    background: transparent;
    color: var(--zl-primary);
    border-color: var(--zl-primary);
  }
  .zl-btn--outline:hover {
    background: var(--zl-primary);
    color: #fff;
  }

  .zl-btn--ghost {
    background: transparent;
    color: var(--zl-text);
    border-color: transparent;
  }
  .zl-btn--ghost:hover {
    background: rgba(0,0,0,0.05);
  }

  /* Button sizes */
  .zl-btn--sm { padding: 8px 16px; font-size: 14px; }
  .zl-btn--lg { padding: 16px 36px; font-size: 18px; }

  /* Focus visible */
  .zl-btn:focus-visible {
    outline: 2px solid var(--zl-primary);
    outline-offset: 2px;
  }

  /* Active press */
  .zl-btn:active {
    transform: translateY(1px);
  }
`;

export const landingSectionStyles = css`
  .zl-section {
    position: relative;
    width: 100%;
    padding: var(--zl-section-padding-y) var(--zl-section-padding-x);
    font-family: var(--zl-font-family);
    color: var(--zl-text);
    overflow: hidden;
  }

  .zl-section--alt { background: var(--zl-bg-alt); }

  .zl-container {
    max-width: var(--zl-max-width);
    margin: 0 auto;
    width: 100%;
  }

  .zl-section-header {
    text-align: center;
    margin-bottom: var(--zl-section-gap);
  }

  .zl-section-headline {
    font-family: var(--zl-heading-font-family);
    font-size: var(--zl-subheading-font-size);
    font-weight: 700;
    color: var(--zl-text);
    line-height: var(--zl-heading-line-height);
    margin-bottom: 12px;
  }

  .zl-section-subtitle {
    font-size: var(--zl-body-font-size);
    color: var(--zl-text-secondary);
    max-width: 640px;
    margin: 0 auto;
    line-height: var(--zl-line-height);
  }

  /* Animation classes */
  .zl-animate {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .zl-animate--visible {
    opacity: 1;
    transform: translateY(0);
  }
  .zl-animate--fade-in {
    transform: none;
  }
  .zl-animate--slide-left {
    transform: translateX(-24px);
  }
  .zl-animate--slide-left.zl-animate--visible {
    transform: translateX(0);
  }

  /* Staggered animation for children */
  .zl-animate--stagger > *:nth-child(1) { transition-delay: 0.1s; }
  .zl-animate--stagger > *:nth-child(2) { transition-delay: 0.2s; }
  .zl-animate--stagger > *:nth-child(3) { transition-delay: 0.3s; }
  .zl-animate--stagger > *:nth-child(4) { transition-delay: 0.4s; }
  .zl-animate--stagger > *:nth-child(5) { transition-delay: 0.5s; }
  .zl-animate--stagger > *:nth-child(6) { transition-delay: 0.6s; }

  /* Hover lift utility */
  .zl-hover-lift {
    transition: transform var(--zl-transition), box-shadow var(--zl-transition);
  }
  .zl-hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: var(--zl-shadow-lg);
  }
`;
