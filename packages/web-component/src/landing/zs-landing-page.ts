// @zentto/studio — Landing page orchestrator
// Renders a sequence of landing sections with optional navbar and footer

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { landingTokens, landingResetStyles } from './zs-landing-styles.js';
import type {
  PageConfig, LandingConfig, LandingSection, SeoConfig,
} from '@zentto/studio-core';
import type { StudioProvider } from '@zentto/studio-core';

// Ensure section components are registered
import './zs-landing-navbar.js';
import './zs-landing-footer.js';
import './zs-section-hero.js';
import './zs-section-features.js';
import './zs-section-cta.js';
import './zs-section-pricing.js';
import './zs-section-testimonials.js';
import './zs-section-stats.js';
import './zs-section-faq.js';
import './zs-section-team.js';
import './zs-section-gallery.js';
import './zs-section-logos.js';
import './zs-section-content.js';
import './zs-section-video.js';
import './zs-section-contact.js';
import './zs-section-html.js';
import './zs-section-social-links.js';
import './zs-section-map.js';
import './zs-section-countdown.js';
import './zs-section-carousel.js';
import './zs-section-cta-form.js';
import './zs-section-comparison.js';
import './zs-section-timeline.js';
import './zs-section-tabs.js';
import './zs-section-social-proof.js';
import './zs-section-before-after.js';
import './zs-section-popup.js';
import './zs-section-blog-preview.js';
import './zs-section-social-feed.js';

@customElement('zs-landing-page')
export class ZsLandingPage extends LitElement {
  static styles = [landingTokens, landingResetStyles, css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--zl-bg);
      color: var(--zl-text);
      font-family: var(--zl-font-family);
    }

    .landing-main {
      width: 100%;
    }

    /* Padding overrides per section */
    .section-wrapper { position: relative; }
    .section-wrapper[data-padding="none"] { --zl-section-padding-y: 0; }
    .section-wrapper[data-padding="sm"] { --zl-section-padding-y: 32px; }
    .section-wrapper[data-padding="md"] { --zl-section-padding-y: 64px; }
    .section-wrapper[data-padding="lg"] { --zl-section-padding-y: 96px; }
    .section-wrapper[data-padding="xl"] { --zl-section-padding-y: 128px; }

    /* Lazy-load placeholder */
    .section-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Background overrides */
    .section-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .section-wrapper > :not(.section-bg) { position: relative; z-index: 1; }
  `];

  @property({ type: Object }) page!: PageConfig;
  @property({ type: Object }) landingConfig?: LandingConfig;
  @property({ type: Object }) provider?: StudioProvider;
  @property({ type: Object }) data: Record<string, unknown> = {};

  @state() private visibleSections = new Set<string>();

  private observer?: IntersectionObserver;

  connectedCallback() {
    super.connectedCallback();
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger animation
          entry.target.classList.add('zl-animate--visible');
          // Track visible sections for lazy-load
          const id = entry.target.getAttribute('id');
          if (id && !this.visibleSections.has(id)) {
            this.visibleSections = new Set([...this.visibleSections, id]);
          }
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    this.emitSeo();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('page') || changed.has('landingConfig')) {
      this.emitSeo();
    }
    // Observe animated and placeholder sections
    this.shadowRoot?.querySelectorAll('.zl-animate, .section-placeholder').forEach(el => {
      this.observer?.observe(el);
    });
  }

  /** Scroll smoothly to a section by its anchor id */
  scrollToSection(sectionId: string) {
    const el = this.shadowRoot?.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private emitSeo() {
    const seo: SeoConfig = {
      ...this.landingConfig?.seo,
      ...this.page?.seo,
    };

    if (seo.title || seo.description) {
      // Let the provider handle it if available
      if (this.provider && 'updateSeo' in this.provider) {
        (this.provider as { updateSeo: (s: SeoConfig) => void }).updateSeo(seo);
      }

      // Also emit event for host apps
      this.dispatchEvent(new CustomEvent('landing-seo', {
        detail: seo,
        bubbles: true,
        composed: true,
      }));
    }
  }

  private renderSection(section: LandingSection, index: number): TemplateResult {
    const sectionId = section.anchor ?? section.id;

    // Lazy-load: first 2 sections always render; others wait until near viewport
    const isEager = index < 2;
    const isVisible = isEager || this.visibleSections.has(sectionId);

    // Resolve background
    let bgStyle = '';
    let overlayStyle = '';
    if (section.background) {
      const bg = section.background;
      if (bg.type === 'color') bgStyle = bg.value;
      else if (bg.type === 'gradient') bgStyle = bg.value;
      else if (bg.type === 'image') bgStyle = bg.value; // passed to component
      if (bg.overlay) overlayStyle = bg.overlay;
    }

    const isImageBg = section.background?.type === 'image';
    const wrapperStyle = (!isImageBg && bgStyle)
      ? (section.background?.type === 'gradient' ? `background:${bgStyle}` : `background-color:${bgStyle}`)
      : '';

    // If not visible yet, render a lightweight placeholder
    if (!isVisible) {
      return html`<div class="section-wrapper section-placeholder" id="${sectionId}" data-padding="${section.padding ?? ''}" style="min-height:200px;${wrapperStyle}"></div>`;
    }

    const sectionContent = (() => {
      switch (section.type) {
        case 'hero':
          return html`<zs-section-hero
            .config="${section.heroConfig!}"
            .variant="${section.variant ?? 'centered'}"
            .backgroundCss="${isImageBg ? bgStyle : ''}"
            .overlayCss="${overlayStyle}"
          ></zs-section-hero>`;

        case 'features':
          return html`<zs-section-features
            .config="${section.featuresConfig!}"
          ></zs-section-features>`;

        case 'cta':
          return html`<zs-section-cta
            .config="${section.ctaConfig!}"
          ></zs-section-cta>`;

        case 'pricing':
          return html`<zs-section-pricing
            .config="${section.pricingConfig!}"
          ></zs-section-pricing>`;

        case 'testimonials':
          return html`<zs-section-testimonials
            .config="${section.testimonialsConfig!}"
          ></zs-section-testimonials>`;

        case 'stats':
          return html`<zs-section-stats
            .config="${section.statsConfig!}"
          ></zs-section-stats>`;

        case 'faq':
          return html`<zs-section-faq
            .config="${section.faqConfig!}"
          ></zs-section-faq>`;

        case 'team':
          return html`<zs-section-team
            .config="${section.teamConfig!}"
          ></zs-section-team>`;

        case 'gallery':
          return html`<zs-section-gallery
            .config="${section.galleryConfig!}"
          ></zs-section-gallery>`;

        case 'logos':
          return html`<zs-section-logos
            .config="${section.logosConfig!}"
          ></zs-section-logos>`;

        case 'content':
          return html`<zs-section-content
            .config="${section.contentConfig!}"
          ></zs-section-content>`;

        case 'video':
          return html`<zs-section-video
            .config="${section.videoConfig!}"
          ></zs-section-video>`;

        case 'contact':
          return html`<zs-section-contact
            .config="${section.contactConfig!}"
          ></zs-section-contact>`;

        case 'html':
          return html`<zs-section-html
            .content="${section.htmlContent ?? ''}"
          ></zs-section-html>`;

        case 'social-links':
          return html`<zs-section-social-links
            .config="${section.socialLinksConfig!}"
          ></zs-section-social-links>`;

        case 'map':
          return html`<zs-section-map
            .config="${section.mapConfig!}"
          ></zs-section-map>`;

        case 'countdown':
          return html`<zs-section-countdown
            .config="${section.countdownConfig!}"
          ></zs-section-countdown>`;

        case 'carousel':
          return html`<zs-section-carousel
            .config="${section.carouselConfig!}"
          ></zs-section-carousel>`;

        case 'cta-form':
          return html`<zs-section-cta-form
            .config="${section.ctaFormConfig!}"
          ></zs-section-cta-form>`;

        case 'comparison':
          return html`<zs-section-comparison
            .config="${section.comparisonConfig!}"
          ></zs-section-comparison>`;

        case 'timeline':
          return html`<zs-section-timeline
            .config="${section.timelineConfig!}"
          ></zs-section-timeline>`;

        case 'tabs':
          return html`<zs-section-tabs
            .config="${section.tabsSectionConfig!}"
          ></zs-section-tabs>`;

        case 'social-proof':
          return html`<zs-section-social-proof
            .config="${section.socialProofConfig!}"
          ></zs-section-social-proof>`;

        case 'before-after':
          return html`<zs-section-before-after
            .config="${section.beforeAfterConfig!}"
          ></zs-section-before-after>`;

        case 'popup':
          return html`<zs-section-popup
            .config="${section.popupConfig!}"
          ></zs-section-popup>`;

        case 'blog-preview':
          return html`<zs-section-blog-preview
            .config="${section.blogPreviewConfig!}"
          ></zs-section-blog-preview>`;

        case 'social-feed':
          return html`<zs-section-social-feed
            .config="${section.socialFeedConfig!}"
          ></zs-section-social-feed>`;

        default:
          return nothing;
      }
    })();

    // Animation class
    const animClass = section.animation && section.animation !== 'none'
      ? `zl-animate${section.animation === 'slide-left' ? ' zl-animate--slide-left' : section.animation === 'fade-in' ? ' zl-animate--fade-in' : ''}`
      : '';

    return html`
      <div
        class="section-wrapper ${animClass}"
        id="${sectionId}"
        data-padding="${section.padding ?? ''}"
        style="${wrapperStyle}"
      >
        ${sectionContent}
      </div>
    `;
  }

  render() {
    if (!this.page) return nothing;

    const sections = this.page.landingSections ?? [];
    const lc = this.landingConfig;

    return html`
      ${lc?.navbar ? html`<zs-landing-navbar .config="${lc.navbar}"
        @landing-scroll-to="${(e: CustomEvent) => this.scrollToSection(e.detail.anchor)}"
      ></zs-landing-navbar>` : ''}
      <main class="landing-main" role="main"
        @landing-scroll-to="${(e: CustomEvent) => this.scrollToSection(e.detail.anchor)}"
      >
        ${sections.map((s, i) => this.renderSection(s, i))}
      </main>
      ${lc?.footer ? html`<zs-landing-footer .config="${lc.footer}"
        @landing-scroll-to="${(e: CustomEvent) => this.scrollToSection(e.detail.anchor)}"
      ></zs-landing-footer>` : ''}
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'zs-landing-page': ZsLandingPage; } }
