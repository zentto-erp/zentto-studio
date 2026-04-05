// @zentto/studio — Tabs section component

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles, landingSectionStyles } from './zs-landing-styles.js';
import type { TabsSectionConfig } from '@zentto/studio-core';

@customElement('zs-section-tabs')
export class ZsSectionTabs extends LitElement {
  static styles = [landingTokens, landingResetStyles, landingSectionStyles, css`
    :host { display: block; }

    /* ── Tab bar ── */
    .tabs-bar {
      display: flex;
      gap: 4px;
      margin-bottom: 32px;
      position: relative;
    }

    .tabs-bar--top {
      border-bottom: 2px solid var(--zl-border);
    }

    .tabs-bar--pills {
      gap: 8px;
    }

    .tabs-bar--underline {
      gap: 0;
    }

    .tab-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-family: var(--zl-heading-font-family);
      font-size: 15px;
      font-weight: 500;
      color: var(--zl-text-secondary);
      transition: all var(--zl-transition);
      white-space: nowrap;
    }

    .tab-btn:focus-visible {
      outline: 2px solid var(--zl-primary);
      outline-offset: 2px;
    }

    .tab-btn:hover {
      color: var(--zl-primary);
    }

    /* top variant */
    .tabs-bar--top .tab-btn {
      margin-bottom: -2px;
      border-bottom: 2px solid transparent;
    }

    .tabs-bar--top .tab-btn--active {
      color: var(--zl-primary);
      border-bottom-color: var(--zl-primary);
    }

    /* pills variant */
    .tabs-bar--pills .tab-btn {
      border-radius: 999px;
      padding: 10px 24px;
      background: var(--zl-bg-alt);
    }

    .tabs-bar--pills .tab-btn--active {
      background: var(--zl-primary);
      color: #fff;
    }

    /* underline variant */
    .tabs-bar--underline .tab-btn {
      padding: 12px 24px;
    }

    .tabs-bar--underline .tab-btn--active {
      color: var(--zl-primary);
    }

    .underline-indicator {
      position: absolute;
      bottom: 0;
      height: 2px;
      background: var(--zl-primary);
      transition: left 0.3s ease, width 0.3s ease;
    }

    .tab-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* ── Content area ── */
    .tabs-content {
      position: relative;
      min-height: 100px;
    }

    .tab-panel {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      display: none;
    }

    .tab-panel--active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    .tab-panel-inner {
      font-size: var(--zl-body-font-size);
      color: var(--zl-text);
      line-height: var(--zl-line-height);
    }

    /* ── Mobile accordion ── */
    @media (max-width: 639px) {
      .tabs-bar { display: none; }
      .tabs-content { display: none; }

      .tabs-accordion { display: block; }

      .accordion-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 16px 0;
        border: none;
        border-bottom: 1px solid var(--zl-border);
        background: none;
        cursor: pointer;
        font-family: var(--zl-heading-font-family);
        font-size: 15px;
        font-weight: 600;
        color: var(--zl-text);
        text-align: left;
        transition: color var(--zl-transition);
      }

      .accordion-trigger:hover { color: var(--zl-primary); }
      .accordion-trigger--active { color: var(--zl-primary); }

      .accordion-chevron {
        width: 18px;
        height: 18px;
        transition: transform var(--zl-transition);
        color: var(--zl-text-secondary);
        flex-shrink: 0;
      }

      .accordion-chevron--open { transform: rotate(180deg); }

      .accordion-panel {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.3s ease-out;
      }

      .accordion-panel--open {
        max-height: 2000px;
      }

      .accordion-panel-inner {
        padding: 12px 0 24px;
        font-size: var(--zl-body-font-size);
        color: var(--zl-text);
        line-height: var(--zl-line-height);
      }
    }

    @media (min-width: 640px) {
      .tabs-accordion { display: none; }
    }
  `];

  @property({ type: Object }) config!: TabsSectionConfig;
  @state() private activeIndex = 0;
  @state() private openAccordion: Set<number> = new Set([0]);

  private handleKeydown(e: KeyboardEvent) {
    const tabs = this.config.tabs;
    if (!tabs?.length) return;

    let newIndex = this.activeIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (this.activeIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (this.activeIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    }

    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;
      // Focus the new tab button
      const btns = this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.tab-btn');
      btns?.[newIndex]?.focus();
    }
  }

  private toggleAccordion(index: number) {
    const next = new Set(this.openAccordion);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    this.openAccordion = next;
  }

  private renderTabBar() {
    const variant = this.config.variant ?? 'top';
    const tabs = this.config.tabs;

    return html`
      <div
        class="tabs-bar tabs-bar--${variant}"
        role="tablist"
        @keydown="${this.handleKeydown}"
      >
        ${tabs.map((tab, i) => html`
          <button
            class="tab-btn ${i === this.activeIndex ? 'tab-btn--active' : ''}"
            role="tab"
            aria-selected="${i === this.activeIndex}"
            tabindex="${i === this.activeIndex ? 0 : -1}"
            @click="${() => { this.activeIndex = i; }}"
          >
            ${tab.icon ? html`<span class="tab-icon">${unsafeHTML(tab.icon)}</span>` : ''}
            ${tab.label}
          </button>
        `)}
        ${variant === 'underline' ? html`<div class="underline-indicator" style="left:0;width:0" id="underline"></div>` : ''}
      </div>
    `;
  }

  private renderContent() {
    const tabs = this.config.tabs;
    return html`
      <div class="tabs-content">
        ${tabs.map((tab, i) => html`
          <div
            class="tab-panel ${i === this.activeIndex ? 'tab-panel--active' : ''}"
            role="tabpanel"
            aria-hidden="${i !== this.activeIndex}"
          >
            <div class="tab-panel-inner">${unsafeHTML(tab.content)}</div>
          </div>
        `)}
      </div>
    `;
  }

  private renderAccordion() {
    const tabs = this.config.tabs;
    return html`
      <div class="tabs-accordion">
        ${tabs.map((tab, i) => {
          const isOpen = this.openAccordion.has(i);
          return html`
            <div>
              <button
                class="accordion-trigger ${isOpen ? 'accordion-trigger--active' : ''}"
                @click="${() => this.toggleAccordion(i)}"
                aria-expanded="${isOpen}"
              >
                <span>${tab.icon ? html`<span class="tab-icon">${unsafeHTML(tab.icon)}</span>` : ''}${tab.label}</span>
                <svg class="accordion-chevron ${isOpen ? 'accordion-chevron--open' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="accordion-panel ${isOpen ? 'accordion-panel--open' : ''}">
                <div class="accordion-panel-inner">${unsafeHTML(tab.content)}</div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  render() {
    const c = this.config;
    if (!c?.tabs?.length) return nothing;

    return html`
      <section class="zl-section" role="region">
        <div class="zl-container">
          ${c.headline ? html`
            <div class="zl-section-header">
              <h2 class="zl-section-headline">${c.headline}</h2>
            </div>
          ` : ''}
          ${this.renderTabBar()}
          ${this.renderContent()}
          ${this.renderAccordion()}
        </div>
      </section>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-section-tabs': ZsSectionTabs; } }
