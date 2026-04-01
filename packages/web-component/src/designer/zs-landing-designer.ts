// @zentto/studio — Landing Page Designer
// Visual section-level editor for landing pages (Figma-style IDE)
// Three-panel layout: Section Palette | Section List & Preview | Property Editor

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { studioTokens, fieldBaseStyles } from '../styles/tokens.js';
import type {
  AppConfig, LandingConfig, LandingSection, LandingSectionType,
  StudioSchema, FieldConfig, StudioProvider,
} from '@zentto/studio-core';
import { listLandingTemplates, getLandingTemplate } from '@zentto/studio-core';
import type { LandingTemplateMeta } from '@zentto/studio-core';

import '../zentto-studio-renderer.js';
import '../landing/zs-landing-page.js';

// ─── Section Palette Items ──────────────────────────────────────

interface SectionPaletteItem {
  type: LandingSectionType;
  icon: string;
  name: string;
  description: string;
}

const SECTION_PALETTE: SectionPaletteItem[] = [
  { type: 'hero', icon: '🎯', name: 'Hero', description: 'Banner principal con titular y CTA' },
  { type: 'features', icon: '⭐', name: 'Features', description: 'Grid de caracteristicas con iconos' },
  { type: 'pricing', icon: '💰', name: 'Pricing', description: 'Tabla comparativa de precios' },
  { type: 'testimonials', icon: '💬', name: 'Testimonials', description: 'Citas de clientes' },
  { type: 'cta', icon: '📢', name: 'CTA', description: 'Banner de llamada a la accion' },
  { type: 'stats', icon: '📊', name: 'Stats', description: 'Contadores de estadisticas' },
  { type: 'faq', icon: '❓', name: 'FAQ', description: 'Preguntas frecuentes' },
  { type: 'team', icon: '👥', name: 'Team', description: 'Tarjetas del equipo' },
  { type: 'gallery', icon: '🖼️', name: 'Gallery', description: 'Galeria de imagenes' },
  { type: 'logos', icon: '🏢', name: 'Logos', description: 'Franja de logos de confianza' },
  { type: 'content', icon: '📝', name: 'Content', description: 'Bloque texto + imagen' },
  { type: 'video', icon: '🎬', name: 'Video', description: 'Embed de video' },
  { type: 'contact', icon: '📬', name: 'Contact', description: 'Formulario de contacto' },
  { type: 'html', icon: '🔧', name: 'HTML', description: 'Bloque HTML raw' },
];

const SECTION_ICONS: Record<string, string> = {};
for (const item of SECTION_PALETTE) SECTION_ICONS[item.type] = item.icon;

// ─── Default config factory ─────────────────────────────────────

function createDefaultConfig(): AppConfig {
  return {
    id: `landing-${Date.now()}`,
    version: '1.0.0',
    appMode: 'landing',
    branding: { title: 'My Landing Page', homeSegment: 'home', primaryColor: '#6366f1' },
    landingConfig: {
      navbar: {
        title: 'My Site',
        links: [],
        ctaButton: { label: 'Get Started', href: '#' },
        sticky: true,
        transparent: true,
      },
      footer: {
        columns: [],
        copyright: '© 2026 My Site. All rights reserved.',
      },
    },
    navigation: [],
    pages: [{ id: 'home', segment: 'home', title: 'Home', content: 'landing', landingSections: [] }],
  };
}

function createDefaultSection(type: LandingSectionType): LandingSection {
  const id = `${type}-${Date.now()}`;
  const base: LandingSection = { id, type };

  switch (type) {
    case 'hero':
      base.heroConfig = {
        headline: 'Your headline here',
        subheadline: 'Subheadline',
        description: 'A short description of your product or service.',
        primaryCta: { label: 'Get Started', href: '#' },
        secondaryCta: { label: 'Learn More', href: '#' },
        alignment: 'center',
        minHeight: '80vh',
      };
      base.variant = 'centered';
      break;
    case 'features':
      base.featuresConfig = {
        headline: 'Our Features',
        subtitle: 'Everything you need',
        items: [
          { icon: '🚀', title: 'Fast', description: 'Lightning fast performance.' },
          { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security.' },
          { icon: '📊', title: 'Analytics', description: 'Actionable insights.' },
        ],
        columns: 3,
        variant: 'cards',
      };
      break;
    case 'pricing':
      base.pricingConfig = {
        headline: 'Pricing',
        subtitle: 'Choose your plan',
        plans: [
          { name: 'Basic', price: '$9', period: '/mo', features: ['Feature 1', 'Feature 2'], cta: { label: 'Start', href: '#' } },
          { name: 'Pro', price: '$29', period: '/mo', features: ['Everything in Basic', 'Feature 3'], cta: { label: 'Start', href: '#' }, highlighted: true },
        ],
        billingToggle: false,
      };
      break;
    case 'testimonials':
      base.testimonialsConfig = {
        headline: 'What people say',
        items: [
          { quote: 'Amazing product!', name: 'John Doe', title: 'CEO', company: 'Acme' },
        ],
        variant: 'grid',
      };
      break;
    case 'cta':
      base.ctaConfig = {
        headline: 'Ready to get started?',
        description: 'Join thousands of happy customers today.',
        primaryCta: { label: 'Start Now', href: '#' },
        variant: 'centered',
      };
      break;
    case 'stats':
      base.statsConfig = {
        headline: 'Our Impact',
        items: [
          { value: '100', label: 'Customers', suffix: '+' },
          { value: '99.9', label: 'Uptime', suffix: '%' },
        ],
      };
      break;
    case 'faq':
      base.faqConfig = {
        headline: 'FAQ',
        subtitle: 'Common questions answered',
        items: [
          { question: 'How does it work?', answer: 'It just works.' },
        ],
        variant: 'accordion',
      };
      break;
    case 'team':
      base.teamConfig = {
        headline: 'Our Team',
        subtitle: 'Meet the people behind the product',
        members: [
          { name: 'Jane Doe', role: 'CEO' },
        ],
        columns: 3,
      };
      break;
    case 'gallery':
      base.galleryConfig = {
        headline: 'Gallery',
        images: [
          { src: 'https://placehold.co/600x400/e2e8f0/475569?text=Image+1', alt: 'Image 1' },
        ],
        columns: 3,
        variant: 'grid',
      };
      break;
    case 'logos':
      base.logosConfig = {
        headline: 'Trusted by leading companies',
        logos: [
          { src: '', alt: 'Company 1' },
          { src: '', alt: 'Company 2' },
        ],
        grayscale: true,
      };
      break;
    case 'content':
      base.contentConfig = {
        headline: 'About Us',
        body: '<p>Tell your story here.</p>',
        imagePosition: 'right',
        bodyFormat: 'html',
      };
      break;
    case 'video':
      base.videoConfig = {
        headline: 'Watch our demo',
        subtitle: 'See how it works',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        provider: 'youtube',
      };
      break;
    case 'contact':
      base.contactConfig = {
        headline: 'Contact Us',
        subtitle: 'We would love to hear from you',
      };
      break;
    case 'html':
      base.htmlContent = '<div style="padding:40px;text-align:center;"><h2>Custom HTML</h2><p>Edit this block.</p></div>';
      break;
  }
  return base;
}

// ─── Schema builders for property editor ────────────────────────

function f(id: string, type: string, label: string, extra?: Record<string, unknown>): FieldConfig {
  const { options, ...rest } = extra ?? {};
  const fc: FieldConfig = { id, field: id, type: type as FieldConfig['type'], label, ...rest as Partial<FieldConfig> };
  if (options) {
    if (!fc.props) fc.props = {};
    fc.props['options'] = options;
  }
  return fc;
}

function buildSectionSchema(section: LandingSection): StudioSchema {
  const fields: FieldConfig[] = [];

  // Section-level props
  fields.push(
    f('_anchor', 'text', 'Anchor', { placeholder: 'e.g. features' }),
    f('_padding', 'select', 'Padding', { options: [
      { value: '', label: 'Default' }, { value: 'none', label: 'None' },
      { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' },
      { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' },
    ]}),
    f('_animation', 'select', 'Animacion', { options: [
      { value: '', label: 'Ninguna' }, { value: 'fade-up', label: 'Fade Up' },
      { value: 'fade-in', label: 'Fade In' }, { value: 'slide-left', label: 'Slide Left' },
    ]}),
    f('_bgType', 'select', 'Fondo tipo', { options: [
      { value: '', label: 'Ninguno' }, { value: 'color', label: 'Color' },
      { value: 'gradient', label: 'Gradiente' }, { value: 'image', label: 'Imagen' },
    ]}),
    f('_bgValue', 'text', 'Fondo valor', { placeholder: '#f8fafc o URL' }),
    f('_bgOverlay', 'text', 'Fondo overlay', { placeholder: 'rgba(0,0,0,0.5)' }),
  );

  // Type-specific fields
  switch (section.type) {
    case 'hero':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subheadline', 'text', 'Subheadline'),
        f('description', 'textarea', 'Descripcion'),
        f('primaryCtaLabel', 'text', 'CTA Primario - Label'),
        f('primaryCtaHref', 'text', 'CTA Primario - Href'),
        f('secondaryCtaLabel', 'text', 'CTA Secundario - Label'),
        f('secondaryCtaHref', 'text', 'CTA Secundario - Href'),
        f('alignment', 'select', 'Alineacion', { options: [
          { value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' },
        ]}),
        f('minHeight', 'text', 'Altura minima', { placeholder: '80vh' }),
        f('variant', 'select', 'Variante', { options: [
          { value: 'centered', label: 'Centered' }, { value: 'split', label: 'Split' },
        ]}),
      );
      break;
    case 'features':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subtitle', 'text', 'Subtitulo'),
        f('variant', 'select', 'Variante', { options: [
          { value: 'cards', label: 'Cards' }, { value: 'icons', label: 'Icons' },
          { value: 'list', label: 'List' }, { value: 'alternating', label: 'Alternating' },
        ]}),
        f('columns', 'select', 'Columnas', { options: [
          { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
        ]}),
      );
      break;
    case 'pricing':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subtitle', 'text', 'Subtitulo'),
        f('billingToggle', 'switch', 'Toggle mensual/anual'),
      );
      break;
    case 'cta':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('description', 'textarea', 'Descripcion'),
        f('variant', 'select', 'Variante', { options: [
          { value: 'banner', label: 'Banner' }, { value: 'centered', label: 'Centered' }, { value: 'split', label: 'Split' },
        ]}),
        f('primaryCtaLabel', 'text', 'CTA Primario - Label'),
        f('primaryCtaHref', 'text', 'CTA Primario - Href'),
      );
      break;
    case 'stats':
      fields.push(
        f('headline', 'text', 'Headline'),
      );
      break;
    case 'faq':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subtitle', 'text', 'Subtitulo'),
        f('variant', 'select', 'Variante', { options: [
          { value: 'accordion', label: 'Accordion' }, { value: 'two-column', label: 'Two Column' },
        ]}),
      );
      break;
    case 'team':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subtitle', 'text', 'Subtitulo'),
        f('columns', 'select', 'Columnas', { options: [
          { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
        ]}),
      );
      break;
    case 'gallery':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('columns', 'select', 'Columnas', { options: [
          { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
        ]}),
        f('variant', 'select', 'Variante', { options: [
          { value: 'grid', label: 'Grid' }, { value: 'masonry', label: 'Masonry' }, { value: 'carousel', label: 'Carousel' },
        ]}),
      );
      break;
    case 'logos':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('grayscale', 'switch', 'Escala de grises'),
      );
      break;
    case 'content':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('imagePosition', 'select', 'Posicion de imagen', { options: [
          { value: 'left', label: 'Izquierda' }, { value: 'right', label: 'Derecha' },
        ]}),
        f('bodyFormat', 'select', 'Formato del body', { options: [
          { value: 'html', label: 'HTML' }, { value: 'markdown', label: 'Markdown' },
        ]}),
      );
      break;
    case 'video':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subtitle', 'text', 'Subtitulo'),
        f('videoUrl', 'text', 'URL del video'),
        f('provider', 'select', 'Proveedor', { options: [
          { value: 'youtube', label: 'YouTube' }, { value: 'vimeo', label: 'Vimeo' }, { value: 'self', label: 'Self-hosted' },
        ]}),
      );
      break;
    case 'contact':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('subtitle', 'text', 'Subtitulo'),
      );
      break;
    case 'testimonials':
      fields.push(
        f('headline', 'text', 'Headline'),
        f('variant', 'select', 'Variante', { options: [
          { value: 'carousel', label: 'Carousel' }, { value: 'grid', label: 'Grid' }, { value: 'masonry', label: 'Masonry' },
        ]}),
      );
      break;
    case 'html':
      fields.push(
        f('htmlContent', 'textarea', 'Contenido HTML'),
      );
      break;
  }

  return {
    id: `section-editor-${section.id}`,
    version: '1.0',
    title: `Editar: ${SECTION_ICONS[section.type] ?? ''} ${section.type}`,
    layout: { type: 'form' },
    sections: [
      { id: 'type-props', title: 'Propiedades', fields: fields.filter(fc => !fc.id.startsWith('_')) },
      { id: 'section-props', title: 'Seccion', fields: fields.filter(fc => fc.id.startsWith('_')), collapsed: true },
    ],
  };
}

// Get config key for section type
function getConfigKey(type: LandingSectionType): string {
  const map: Record<LandingSectionType, string> = {
    hero: 'heroConfig', features: 'featuresConfig', pricing: 'pricingConfig',
    testimonials: 'testimonialsConfig', cta: 'ctaConfig', stats: 'statsConfig',
    faq: 'faqConfig', team: 'teamConfig', gallery: 'galleryConfig',
    logos: 'logosConfig', content: 'contentConfig', video: 'videoConfig',
    contact: 'contactConfig', html: 'htmlContent',
  };
  return map[type];
}

// Extract flat values from a section for the property editor
function extractSectionValues(section: LandingSection): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  // Section-level
  values['_anchor'] = section.anchor ?? '';
  values['_padding'] = section.padding ?? '';
  values['_animation'] = section.animation ?? '';
  values['_bgType'] = section.background?.type ?? '';
  values['_bgValue'] = section.background?.value ?? '';
  values['_bgOverlay'] = section.background?.overlay ?? '';

  const configKey = getConfigKey(section.type);
  if (section.type === 'html') {
    values['htmlContent'] = section.htmlContent ?? '';
    return values;
  }

  const config = (section as unknown as Record<string, unknown>)[configKey] as Record<string, unknown> | undefined;
  if (!config) return values;

  // Extract variant from section level
  values['variant'] = section.variant ?? config['variant'] ?? '';

  // Flatten config props
  for (const [key, val] of Object.entries(config)) {
    if (key === 'primaryCta' && typeof val === 'object' && val) {
      values['primaryCtaLabel'] = (val as { label?: string }).label ?? '';
      values['primaryCtaHref'] = (val as { href?: string }).href ?? '';
    } else if (key === 'secondaryCta' && typeof val === 'object' && val) {
      values['secondaryCtaLabel'] = (val as { label?: string }).label ?? '';
      values['secondaryCtaHref'] = (val as { href?: string }).href ?? '';
    } else if (typeof val !== 'object' || val === null) {
      values[key] = val ?? '';
    }
    // Arrays/objects like items, plans etc. are not edited via form — use JSON editor
  }

  // columns may be number, coerce to string for select
  if (typeof values['columns'] === 'number') values['columns'] = String(values['columns']);

  return values;
}

// Apply flat values back onto a section
function applySectionValues(section: LandingSection, values: Record<string, unknown>): void {
  // Section-level
  section.anchor = values['_anchor'] as string || undefined;
  section.padding = (values['_padding'] as LandingSection['padding']) || undefined;
  section.animation = (values['_animation'] as LandingSection['animation']) || undefined;

  const bgType = values['_bgType'] as string;
  if (bgType) {
    section.background = {
      type: bgType as 'color' | 'gradient' | 'image',
      value: (values['_bgValue'] as string) || '',
      overlay: (values['_bgOverlay'] as string) || undefined,
    };
  } else {
    section.background = undefined;
  }

  if (section.type === 'html') {
    section.htmlContent = values['htmlContent'] as string ?? '';
    return;
  }

  const configKey = getConfigKey(section.type);
  const config = (section as unknown as Record<string, unknown>)[configKey] as Record<string, unknown> | undefined;
  if (!config) return;

  // variant lives on section AND config
  if (values['variant'] !== undefined) {
    section.variant = (values['variant'] as string) || undefined;
    config['variant'] = values['variant'] || undefined;
  }

  // Apply scalar fields
  const skipKeys = new Set(['_anchor', '_padding', '_animation', '_bgType', '_bgValue', '_bgOverlay',
    'primaryCtaLabel', 'primaryCtaHref', 'secondaryCtaLabel', 'secondaryCtaHref', 'variant', 'htmlContent']);

  for (const [key, val] of Object.entries(values)) {
    if (skipKeys.has(key)) continue;
    if (key === 'columns' && typeof val === 'string' && val) {
      config[key] = parseInt(val, 10);
    } else if (key === 'billingToggle' || key === 'grayscale') {
      config[key] = val === true || val === 'true';
    } else {
      config[key] = val;
    }
  }

  // CTA fields
  if (values['primaryCtaLabel'] !== undefined || values['primaryCtaHref'] !== undefined) {
    if (!config['primaryCta']) config['primaryCta'] = { label: '', href: '' };
    const cta = config['primaryCta'] as { label: string; href: string };
    if (values['primaryCtaLabel'] !== undefined) cta.label = values['primaryCtaLabel'] as string;
    if (values['primaryCtaHref'] !== undefined) cta.href = values['primaryCtaHref'] as string;
  }
  if (values['secondaryCtaLabel'] !== undefined || values['secondaryCtaHref'] !== undefined) {
    if (!config['secondaryCta']) config['secondaryCta'] = { label: '', href: '' };
    const cta = config['secondaryCta'] as { label: string; href: string };
    if (values['secondaryCtaLabel'] !== undefined) cta.label = values['secondaryCtaLabel'] as string;
    if (values['secondaryCtaHref'] !== undefined) cta.href = values['secondaryCtaHref'] as string;
  }
}

// ─── Component ──────────────────────────────────────────────────

const MAX_HISTORY = 30;

@customElement('zs-landing-designer')
export class ZsLandingDesigner extends LitElement {
  static styles = [studioTokens, fieldBaseStyles, css`
    :host {
      display: block; height: 100%;
      font-family: var(--zs-font-family);
    }

    /* ─── Layout ──────────────────────────────── */
    .designer {
      display: grid;
      grid-template-rows: auto 1fr;
      grid-template-columns: 220px 1fr 280px;
      height: 100%;
      background: var(--zs-bg-secondary);
      overflow: hidden;
    }

    /* ─── Top Bar ─────────────────────────────── */
    .topbar {
      grid-column: 1 / -1;
      display: flex; align-items: center; gap: 8px;
      padding: 6px 12px; min-height: 40px;
      background: var(--zs-bg);
      border-bottom: 1px solid var(--zs-border);
      flex-wrap: wrap;
    }
    .topbar-sep { width: 1px; height: 20px; background: var(--zs-border); margin: 0 4px; }
    .topbar-spacer { flex: 1; }
    .tb-btn {
      background: none; border: 1px solid var(--zs-border);
      border-radius: var(--zs-radius-sm); padding: 4px 10px;
      cursor: pointer; font-size: 12px; color: var(--zs-text);
      font-family: inherit; transition: background 0.15s;
      white-space: nowrap; display: flex; align-items: center; gap: 4px;
    }
    .tb-btn:hover { background: var(--zs-bg-hover); }
    .tb-btn:disabled { opacity: 0.4; cursor: default; }
    .tb-btn--active { background: var(--zs-primary); color: white; border-color: var(--zs-primary); }
    .tb-select {
      border: 1px solid var(--zs-border); border-radius: var(--zs-radius-sm);
      padding: 4px 8px; font-size: 12px; font-family: inherit;
      background: var(--zs-bg); color: var(--zs-text); cursor: pointer;
    }

    /* ─── Left Panel (Section Palette) ────────── */
    .left-panel {
      background: var(--zs-bg);
      border-right: 1px solid var(--zs-border);
      display: flex; flex-direction: column; overflow: hidden;
    }
    .panel-header {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: var(--zs-text-muted);
      padding: 12px 12px 8px; border-bottom: 1px solid var(--zs-border);
    }
    .palette-list {
      flex: 1; overflow-y: auto; padding: 4px;
    }
    .palette-list::-webkit-scrollbar { width: 6px; }
    .palette-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    .palette-item {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 10px; margin: 2px 0;
      border: 1px solid transparent; border-radius: var(--zs-radius);
      cursor: grab; user-select: none;
      transition: all 0.15s; background: transparent;
    }
    .palette-item:hover {
      background: var(--zs-primary-light); border-color: var(--zs-border);
    }
    .palette-item:active { cursor: grabbing; opacity: 0.7; }
    .palette-icon {
      font-size: 18px; width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      border-radius: var(--zs-radius); background: var(--zs-bg-secondary);
      border: 1px solid var(--zs-border); flex-shrink: 0;
    }
    .palette-item:hover .palette-icon {
      background: var(--zs-primary); border-color: var(--zs-primary);
    }
    .palette-text { flex: 1; min-width: 0; }
    .palette-name { font-size: 12px; font-weight: 600; color: var(--zs-text); }
    .palette-desc { font-size: 10px; color: var(--zs-text-muted); line-height: 1.2; }

    /* ─── Center Panel ────────────────────────── */
    .center-panel {
      display: flex; flex-direction: column; overflow: hidden;
    }
    .section-list {
      flex: 1; overflow-y: auto; padding: 12px;
      min-height: 120px;
    }
    .section-list::-webkit-scrollbar { width: 6px; }
    .section-list::-webkit-scrollbar-thumb { background: #bbb; border-radius: 3px; }

    .section-item {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; margin-bottom: 4px;
      background: var(--zs-bg); border: 2px solid var(--zs-border);
      border-radius: var(--zs-radius-lg); cursor: pointer;
      transition: all 0.15s; user-select: none;
    }
    .section-item:hover { border-color: var(--zs-primary); }
    .section-item--selected { border-color: var(--zs-primary); background: var(--zs-primary-light); }
    .section-item--drag-over { border-color: var(--zs-accent); border-style: dashed; }
    .section-drag-handle {
      cursor: grab; font-size: 16px; color: var(--zs-text-muted);
      padding: 0 2px; flex-shrink: 0;
    }
    .section-drag-handle:active { cursor: grabbing; }
    .section-icon { font-size: 18px; flex-shrink: 0; }
    .section-info { flex: 1; min-width: 0; }
    .section-title {
      font-size: 13px; font-weight: 600; color: var(--zs-text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .section-type { font-size: 10px; color: var(--zs-text-muted); text-transform: uppercase; }
    .section-delete {
      background: none; border: none; cursor: pointer;
      font-size: 16px; color: var(--zs-text-muted);
      padding: 2px 6px; border-radius: var(--zs-radius-sm);
      transition: all 0.1s; flex-shrink: 0;
    }
    .section-delete:hover { background: #ffebee; color: var(--zs-danger); }

    .drop-zone {
      border: 2px dashed var(--zs-border); border-radius: var(--zs-radius-lg);
      padding: 20px; text-align: center; color: var(--zs-text-muted);
      font-size: 13px; margin-top: 8px;
      transition: all 0.15s;
    }
    .drop-zone--active { border-color: var(--zs-primary); background: var(--zs-primary-light); color: var(--zs-primary); }

    /* Preview area */
    .preview-area {
      border-top: 1px solid var(--zs-border);
      flex: 1; overflow: auto; min-height: 200px;
      background: #e0e0e0;
    }
    .preview-area zs-landing-page {
      transform-origin: top left;
    }

    /* ─── Right Panel (Property Editor) ───────── */
    .right-panel {
      background: var(--zs-bg);
      border-left: 1px solid var(--zs-border);
      display: flex; flex-direction: column; overflow: hidden;
    }
    .right-panel-header {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: var(--zs-text-muted);
      padding: 12px 12px 8px; border-bottom: 1px solid var(--zs-border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .right-panel-content {
      flex: 1; overflow-y: auto; padding: 8px;
    }
    .right-panel-content::-webkit-scrollbar { width: 6px; }
    .right-panel-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    .right-panel-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 40px 20px; color: var(--zs-text-muted); text-align: center;
      height: 100%;
    }
    .right-panel-empty-icon { font-size: 40px; margin-bottom: 12px; }

    /* ─── JSON Editor ─────────────────────────── */
    .json-editor {
      flex: 1; display: flex; flex-direction: column;
      grid-column: 2 / 4;
    }
    .json-textarea {
      flex: 1; border: none; resize: none; padding: 16px;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 12px; line-height: 1.5;
      background: var(--zs-bg-secondary); color: var(--zs-text);
      outline: none;
    }
    .json-error {
      padding: 8px 16px; background: #ffebee; color: var(--zs-danger);
      font-size: 12px; border-top: 1px solid var(--zs-border);
    }

    /* ─── Modal overlay ──────────────────────── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.5); display: flex;
      align-items: center; justify-content: center;
    }
    .modal {
      background: var(--zs-bg); border-radius: 12px;
      width: 90%; max-width: 600px; max-height: 80vh;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--zs-border);
    }
    .modal-header h3 { margin: 0; font-size: 16px; }
    .modal-body { flex: 1; overflow: auto; padding: 20px; }
    .modal-footer {
      display: flex; gap: 8px; justify-content: flex-end;
      padding: 12px 20px; border-top: 1px solid var(--zs-border);
    }
    .form-group { margin-bottom: 16px; }
    .form-label { font-size: 13px; font-weight: 500; color: var(--zs-text); margin-bottom: 4px; display: block; }
  `];

  // ─── Properties ────────────────────────────────

  @property({ type: Object }) config!: AppConfig;
  @property({ type: Object }) provider?: StudioProvider;
  @property({ type: Number }) autoSaveMs = 5000;

  // ─── Internal state ────────────────────────────

  @state() private selectedSectionIndex = -1;
  @state() private showPreview = true;
  @state() private showJson = false;
  @state() private jsonText = '';
  @state() private jsonError = '';
  @state() private editingNavbar = false;
  @state() private editingFooter = false;
  @state() private dragOverIndex = -1;
  @state() private dragSourceIndex = -1;
  @state() private paletteDragType: LandingSectionType | null = null;

  // Undo/redo
  private history: string[] = [];
  private historyIndex = -1;
  private skipHistory = false;

  // Autosave
  private autoSaveTimer?: ReturnType<typeof setInterval>;
  private dirty = false;

  // Navbar/footer temp edits
  @state() private navbarJson = '';
  @state() private footerJson = '';

  // ─── Lifecycle ─────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    if (!this.config) {
      this.config = createDefaultConfig();
    }
    this.pushHistory();
    this.startAutoSave();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoSave();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('config') && !this.skipHistory) {
      // External config set
      this.pushHistory();
    }
  }

  private startAutoSave() {
    this.stopAutoSave();
    if (this.autoSaveMs > 0) {
      this.autoSaveTimer = setInterval(() => {
        if (this.dirty) {
          this.dirty = false;
          this.dispatchEvent(new CustomEvent('auto-save', {
            detail: { config: structuredClone(this.config) },
            bubbles: true, composed: true,
          }));
        }
      }, this.autoSaveMs);
    }
  }

  private stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = undefined;
    }
  }

  // ─── Sections accessor ────────────────────────

  private get sections(): LandingSection[] {
    const page = this.config?.pages?.[0];
    return page?.landingSections ?? [];
  }

  private set sections(val: LandingSection[]) {
    if (this.config?.pages?.[0]) {
      this.config.pages[0].landingSections = val;
    }
  }

  private get landingConfig(): LandingConfig {
    if (!this.config.landingConfig) {
      this.config.landingConfig = { navbar: { title: '', links: [] }, footer: { columns: [] } };
    }
    return this.config.landingConfig;
  }

  // ─── History (undo/redo) ──────────────────────

  private pushHistory() {
    const snapshot = JSON.stringify(this.config);
    // Avoid duplicate snapshots
    if (this.history.length > 0 && this.history[this.historyIndex] === snapshot) return;

    // Truncate forward history
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(snapshot);
    if (this.history.length > MAX_HISTORY) this.history.shift();
    this.historyIndex = this.history.length - 1;
  }

  private undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.applyHistory();
  }

  private redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this.applyHistory();
  }

  private applyHistory() {
    this.skipHistory = true;
    this.config = JSON.parse(this.history[this.historyIndex]);
    this.emitChange();
    this.skipHistory = false;
    this.requestUpdate();
  }

  // ─── Mutations ────────────────────────────────

  private mutate(fn: () => void) {
    this.config = structuredClone(this.config);
    fn();
    this.pushHistory();
    this.emitChange();
    this.dirty = true;
    this.requestUpdate();
  }

  private emitChange() {
    this.dispatchEvent(new CustomEvent('config-change', {
      detail: { config: structuredClone(this.config) },
      bubbles: true, composed: true,
    }));
  }

  // ─── Section operations ───────────────────────

  private addSection(type: LandingSectionType) {
    this.mutate(() => {
      const section = createDefaultSection(type);
      this.sections = [...this.sections, section];
      this.selectedSectionIndex = this.sections.length - 1;
    });
  }

  private deleteSection(index: number) {
    this.mutate(() => {
      const newSections = [...this.sections];
      newSections.splice(index, 1);
      this.sections = newSections;
      if (this.selectedSectionIndex >= newSections.length) {
        this.selectedSectionIndex = newSections.length - 1;
      }
    });
  }

  private moveSection(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    this.mutate(() => {
      const newSections = [...this.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      this.sections = newSections;
      this.selectedSectionIndex = toIndex;
    });
  }

  // ─── Drag & Drop (section reorder) ────────────

  private onSectionDragStart(e: DragEvent, index: number) {
    this.dragSourceIndex = index;
    this.paletteDragType = null;
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', String(index));
  }

  private onSectionDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    this.dragOverIndex = index;
  }

  private onSectionDrop(e: DragEvent, index: number) {
    e.preventDefault();
    this.dragOverIndex = -1;
    if (this.paletteDragType) {
      // Dropped from palette
      this.mutate(() => {
        const section = createDefaultSection(this.paletteDragType!);
        const newSections = [...this.sections];
        newSections.splice(index, 0, section);
        this.sections = newSections;
        this.selectedSectionIndex = index;
      });
      this.paletteDragType = null;
    } else if (this.dragSourceIndex >= 0) {
      this.moveSection(this.dragSourceIndex, index);
    }
    this.dragSourceIndex = -1;
  }

  private onSectionDragEnd() {
    this.dragOverIndex = -1;
    this.dragSourceIndex = -1;
    this.paletteDragType = null;
  }

  // Drop zone at end of list
  private onDropZoneDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    this.dragOverIndex = this.sections.length;
  }

  private onDropZoneDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOverIndex = -1;
    if (this.paletteDragType) {
      this.addSection(this.paletteDragType);
      this.paletteDragType = null;
    } else if (this.dragSourceIndex >= 0) {
      this.moveSection(this.dragSourceIndex, this.sections.length - 1);
    }
    this.dragSourceIndex = -1;
  }

  // Palette drag
  private onPaletteDragStart(e: DragEvent, type: LandingSectionType) {
    this.paletteDragType = type;
    this.dragSourceIndex = -1;
    e.dataTransfer!.effectAllowed = 'copy';
    e.dataTransfer!.setData('text/plain', type);
  }

  // ─── Template loading ─────────────────────────

  @state() private selectedTemplateId = '';

  private loadTemplate() {
    if (!this.selectedTemplateId) return;
    try {
      const tpl = getLandingTemplate(this.selectedTemplateId);
      this.config = tpl;
      this.selectedSectionIndex = -1;
      this.pushHistory();
      this.emitChange();
      this.requestUpdate();
    } catch { /* ignore */ }
  }

  // ─── Property editor change handler ───────────

  private onPropertyChange(e: CustomEvent) {
    const section = this.sections[this.selectedSectionIndex];
    if (!section) return;

    const values = e.detail?.data ?? e.detail?.values ?? e.detail;
    if (!values || typeof values !== 'object') return;

    this.mutate(() => {
      const sec = this.sections[this.selectedSectionIndex];
      applySectionValues(sec, values);
    });
  }

  // ─── JSON editor ──────────────────────────────

  private openJsonEditor() {
    this.showJson = true;
    this.jsonText = JSON.stringify(this.config, null, 2);
    this.jsonError = '';
  }

  private closeJsonEditor() {
    this.showJson = false;
  }

  private applyJson() {
    try {
      const parsed = JSON.parse(this.jsonText);
      this.config = parsed;
      this.pushHistory();
      this.emitChange();
      this.jsonError = '';
      this.showJson = false;
      this.requestUpdate();
    } catch (err) {
      this.jsonError = `JSON invalido: ${(err as Error).message}`;
    }
  }

  // ─── Navbar/Footer editors ────────────────────

  private openNavbarEditor() {
    this.editingNavbar = true;
    this.navbarJson = JSON.stringify(this.landingConfig.navbar ?? {}, null, 2);
  }

  private saveNavbar() {
    try {
      const parsed = JSON.parse(this.navbarJson);
      this.mutate(() => {
        this.config.landingConfig!.navbar = parsed;
      });
      this.editingNavbar = false;
    } catch { /* ignore */ }
  }

  private openFooterEditor() {
    this.editingFooter = true;
    this.footerJson = JSON.stringify(this.landingConfig.footer ?? {}, null, 2);
  }

  private saveFooter() {
    try {
      const parsed = JSON.parse(this.footerJson);
      this.mutate(() => {
        this.config.landingConfig!.footer = parsed;
      });
      this.editingFooter = false;
    } catch { /* ignore */ }
  }

  // ─── Section headline helper ──────────────────

  private getSectionHeadline(section: LandingSection): string {
    if (section.type === 'html') return 'Custom HTML';
    const configKey = getConfigKey(section.type);
    const config = (section as unknown as Record<string, unknown>)[configKey] as Record<string, unknown> | undefined;
    return (config?.['headline'] as string) || (config?.['title'] as string) || section.type;
  }

  // ─── Render ───────────────────────────────────

  render() {
    const templates = listLandingTemplates();
    const sections = this.sections;
    const selectedSection = this.selectedSectionIndex >= 0 && this.selectedSectionIndex < sections.length
      ? sections[this.selectedSectionIndex] : null;

    return html`
      <div class="designer">
        <!-- TOP BAR -->
        <div class="topbar">
          <select class="tb-select" .value="${this.selectedTemplateId}"
            @change="${(e: Event) => { this.selectedTemplateId = (e.target as HTMLSelectElement).value; }}">
            <option value="">-- Plantilla --</option>
            ${templates.map(t => html`<option value="${t.id}">${t.icon} ${t.title}</option>`)}
          </select>
          <button class="tb-btn" @click="${this.loadTemplate}" ?disabled="${!this.selectedTemplateId}">Cargar</button>

          <div class="topbar-sep"></div>

          <button class="tb-btn" @click="${this.undo}" ?disabled="${this.historyIndex <= 0}" title="Deshacer">↩ Undo</button>
          <button class="tb-btn" @click="${this.redo}" ?disabled="${this.historyIndex >= this.history.length - 1}" title="Rehacer">↪ Redo</button>

          <div class="topbar-sep"></div>

          <button class="tb-btn ${this.showPreview ? 'tb-btn--active' : ''}"
            @click="${() => { this.showPreview = !this.showPreview; this.requestUpdate(); }}">
            ${this.showPreview ? '👁️ Preview ON' : '👁️ Preview'}
          </button>
          <button class="tb-btn ${this.showJson ? 'tb-btn--active' : ''}"
            @click="${() => this.showJson ? this.closeJsonEditor() : this.openJsonEditor()}">
            { } JSON
          </button>

          <div class="topbar-sep"></div>

          <button class="tb-btn" @click="${this.openNavbarEditor}">Navbar</button>
          <button class="tb-btn" @click="${this.openFooterEditor}">Footer</button>

          <div class="topbar-spacer"></div>

          <span style="font-size:11px;color:var(--zs-text-muted);">${sections.length} secciones</span>
        </div>

        <!-- LEFT PANEL: Section Palette -->
        <div class="left-panel">
          <div class="panel-header">Secciones</div>
          <div class="palette-list">
            ${SECTION_PALETTE.map(item => html`
              <div class="palette-item"
                draggable="true"
                @dragstart="${(e: DragEvent) => this.onPaletteDragStart(e, item.type)}"
                @dragend="${this.onSectionDragEnd}"
                @dblclick="${() => this.addSection(item.type)}">
                <div class="palette-icon">${item.icon}</div>
                <div class="palette-text">
                  <div class="palette-name">${item.name}</div>
                  <div class="palette-desc">${item.description}</div>
                </div>
              </div>
            `)}
          </div>
        </div>

        ${this.showJson ? this.renderJsonEditor() : html`
          <!-- CENTER PANEL: Section List & Preview -->
          <div class="center-panel">
            <div class="section-list"
            @dragover="${(e: DragEvent) => { e.preventDefault(); e.dataTransfer!.dropEffect = this.paletteDragType ? 'copy' : 'move'; }}"
            @drop="${(e: DragEvent) => { if (this.paletteDragType) { e.preventDefault(); this.addSection(this.paletteDragType); this.paletteDragType = null; this.dragSourceIndex = -1; this.dragOverIndex = -1; } }}">
              ${sections.length === 0 ? html`
                <div class="drop-zone drop-zone--active" style="min-height:120px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
                  <div style="font-size:36px;">📄</div>
                  <div style="font-size:14px;">No hay secciones.</div>
                  <div style="font-size:12px;">Arrastra una seccion aqui o doble-clic en el panel izquierdo.</div>
                </div>
              ` : nothing}

              ${sections.map((section, i) => html`
                <div class="section-item ${i === this.selectedSectionIndex ? 'section-item--selected' : ''} ${i === this.dragOverIndex ? 'section-item--drag-over' : ''}"
                  draggable="true"
                  @dragstart="${(e: DragEvent) => this.onSectionDragStart(e, i)}"
                  @dragover="${(e: DragEvent) => this.onSectionDragOver(e, i)}"
                  @drop="${(e: DragEvent) => this.onSectionDrop(e, i)}"
                  @dragend="${this.onSectionDragEnd}"
                  @click="${() => { this.selectedSectionIndex = i; this.requestUpdate(); }}">
                  <span class="section-drag-handle">⠿</span>
                  <span class="section-icon">${SECTION_ICONS[section.type] ?? '📦'}</span>
                  <div class="section-info">
                    <div class="section-title">${this.getSectionHeadline(section)}</div>
                    <div class="section-type">${section.type}${section.anchor ? ` #${section.anchor}` : ''}</div>
                  </div>
                  <button class="section-delete" @click="${(e: Event) => { e.stopPropagation(); this.deleteSection(i); }}" title="Eliminar seccion">✕</button>
                </div>
              `)}

              <div class="drop-zone ${this.dragOverIndex === sections.length ? 'drop-zone--active' : ''}"
                @dragover="${this.onDropZoneDragOver}"
                @drop="${this.onDropZoneDrop}"
                @dragleave="${() => { this.dragOverIndex = -1; }}">
                Soltar seccion aqui o doble-clic en el panel izquierdo
              </div>
            </div>

            ${this.showPreview ? html`
              <div class="preview-area">
                <zs-landing-page
                  .page="${this.config?.pages?.[0] ?? { id: 'home', segment: 'home', title: 'Home', content: 'landing', landingSections: [] }}"
                  .landingConfig="${this.config?.landingConfig}"
                  .provider="${this.provider}"
                ></zs-landing-page>
              </div>
            ` : nothing}
          </div>

          <!-- RIGHT PANEL: Property Editor -->
          <div class="right-panel">
            <div class="right-panel-header">
              <span>Propiedades</span>
              ${selectedSection ? html`<span style="font-size:10px;color:var(--zs-text-muted);">${selectedSection.type}</span>` : nothing}
            </div>
            <div class="right-panel-content">
              ${selectedSection ? this.renderPropertyEditor(selectedSection) : html`
                <div class="right-panel-empty">
                  <div class="right-panel-empty-icon">🖱️</div>
                  <div style="font-size:13px;">Selecciona una seccion para editar sus propiedades</div>
                </div>
              `}
            </div>
          </div>
        `}
      </div>

      ${this.editingNavbar ? this.renderNavbarModal() : nothing}
      ${this.editingFooter ? this.renderFooterModal() : nothing}
    `;
  }

  // ─── Property Editor ──────────────────────────

  private renderPropertyEditor(section: LandingSection) {
    const schema = buildSectionSchema(section);
    const values = extractSectionValues(section);

    return html`
      <zentto-studio-renderer
        .schema="${schema}"
        .data="${values}"
        .provider="${this.provider}"
        @data-change="${this.onPropertyChange}"
      ></zentto-studio-renderer>
    `;
  }

  // ─── JSON Editor Panel ────────────────────────

  private renderJsonEditor() {
    return html`
      <div class="json-editor">
        <div style="padding:8px 12px;display:flex;gap:8px;border-bottom:1px solid var(--zs-border);background:var(--zs-bg);">
          <button class="tb-btn" @click="${this.applyJson}">Aplicar JSON</button>
          <button class="tb-btn" @click="${this.closeJsonEditor}">Cerrar</button>
          ${this.jsonError ? html`<span style="color:var(--zs-danger);font-size:12px;align-self:center;">${this.jsonError}</span>` : nothing}
        </div>
        <textarea class="json-textarea"
          .value="${this.jsonText}"
          @input="${(e: Event) => { this.jsonText = (e.target as HTMLTextAreaElement).value; }}"
        ></textarea>
      </div>
    `;
  }

  // ─── Navbar Modal ─────────────────────────────

  private renderNavbarModal() {
    return html`
      <div class="modal-overlay" @keydown="${(e: KeyboardEvent) => { if (e.key === 'Escape') this.editingNavbar = false; }}">
        <div class="modal">
          <div class="modal-header">
            <h3>Editar Navbar</h3>
            <button class="tb-btn" @click="${() => { this.editingNavbar = false; }}">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size:12px;color:var(--zs-text-muted);margin-top:0;">
              Edita la configuracion del navbar en formato JSON. Propiedades: title, logo, links[], ctaButton, sticky, transparent.
            </p>
            <textarea class="zs-input" rows="18"
              style="font-family:monospace;font-size:12px;resize:vertical;width:100%;box-sizing:border-box;"
              .value="${this.navbarJson}"
              @input="${(e: Event) => { this.navbarJson = (e.target as HTMLTextAreaElement).value; }}"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button class="tb-btn" @click="${() => { this.editingNavbar = false; }}">Cancelar</button>
            <button class="tb-btn tb-btn--active" @click="${this.saveNavbar}">Guardar</button>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Footer Modal ─────────────────────────────

  private renderFooterModal() {
    return html`
      <div class="modal-overlay" @keydown="${(e: KeyboardEvent) => { if (e.key === 'Escape') this.editingFooter = false; }}">
        <div class="modal">
          <div class="modal-header">
            <h3>Editar Footer</h3>
            <button class="tb-btn" @click="${() => { this.editingFooter = false; }}">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size:12px;color:var(--zs-text-muted);margin-top:0;">
              Edita la configuracion del footer en formato JSON. Propiedades: copyright, columns[], socialLinks[].
            </p>
            <textarea class="zs-input" rows="18"
              style="font-family:monospace;font-size:12px;resize:vertical;width:100%;box-sizing:border-box;"
              .value="${this.footerJson}"
              @input="${(e: Event) => { this.footerJson = (e.target as HTMLTextAreaElement).value; }}"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button class="tb-btn" @click="${() => { this.editingFooter = false; }}">Cancelar</button>
            <button class="tb-btn tb-btn--active" @click="${this.saveFooter}">Guardar</button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zs-landing-designer': ZsLandingDesigner;
  }
}
