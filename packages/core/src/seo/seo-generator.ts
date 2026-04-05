// @zentto/studio-core — SEO artifact generators
// Generates sitemap, robots.txt, JSON-LD, Open Graph, Twitter Cards, and meta tags
// from an AppConfig definition.

import type { AppConfig, LandingSection, PageConfig } from '../app-types.js';

// ─── Sitemap ──────────────────────────────────────────────────────

/**
 * Generates an XML sitemap string from all pages and blog posts in the config.
 */
export function generateSitemap(config: AppConfig, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

  // Home page
  urls.push({ loc: base + '/', lastmod: today, changefreq: 'daily', priority: '1.0' });

  // All pages
  for (const page of config.pages) {
    if (page.segment === '/' || page.segment === '') continue;
    const seg = page.segment.startsWith('/') ? page.segment : '/' + page.segment;
    const priority = page.content === 'landing' ? '0.9' : '0.7';
    const changefreq = page.content === 'blog-list' ? 'daily' : 'weekly';
    urls.push({ loc: base + seg, lastmod: today, changefreq, priority });
  }

  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

// ─── robots.txt ───────────────────────────────────────────────────

/**
 * Generates a robots.txt that allows all crawlers and references the sitemap.
 */
export function generateRobotsTxt(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
}

// ─── JSON-LD ──────────────────────────────────────────────────────

/**
 * Generates an array of JSON-LD structured data objects based on the config.
 * - WebSite (always)
 * - Organization (if branding has logo/title)
 * - FAQPage (if any page has a FAQ section)
 * - Product (if any page has a pricing section)
 * - LocalBusiness (if any page has a contact or map section)
 */
export function generateJsonLd(config: AppConfig, baseUrl: string): object[] {
  const base = baseUrl.replace(/\/$/, '');
  const seo = config.landingConfig?.seo;
  const results: object[] = [];

  // WebSite — always present
  results.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seo?.title || config.branding.title || config.id,
    url: base,
    ...(seo?.description ? { description: seo.description } : {}),
  });

  // Organization — if branding has logo or title
  if (config.branding.logo || config.branding.title) {
    const org: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.branding.title || config.id,
      url: base,
    };
    if (config.branding.logo) {
      org.logo = config.branding.logo.startsWith('http')
        ? config.branding.logo
        : base + '/' + config.branding.logo.replace(/^\//, '');
    }
    results.push(org);
  }

  // Collect all landing sections across every page
  const allSections = collectLandingSections(config);

  // FAQPage
  const faqSections = allSections.filter((s) => s.type === 'faq' && s.faqConfig?.items?.length);
  if (faqSections.length > 0) {
    const allItems = faqSections.flatMap((s) => s.faqConfig!.items);
    results.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  // Product — from pricing sections
  const pricingSections = allSections.filter((s) => s.type === 'pricing' && s.pricingConfig?.plans?.length);
  for (const section of pricingSections) {
    for (const plan of section.pricingConfig!.plans) {
      results.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: plan.name,
        ...(plan.description ? { description: plan.description } : {}),
        offers: {
          '@type': 'Offer',
          price: plan.price.replace(/[^0-9.,]/g, '') || plan.price,
          priceCurrency: 'USD',
          ...(plan.period ? { billingPeriod: plan.period } : {}),
        },
      });
    }
  }

  // LocalBusiness — from contact or map sections
  const contactSections = allSections.filter((s) => s.type === 'contact' && s.contactConfig);
  const mapSections = allSections.filter((s) => s.type === 'map' && s.mapConfig);
  if (contactSections.length > 0 || mapSections.length > 0) {
    const mapCfg = mapSections[0]?.mapConfig;
    const business: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: config.branding.title || config.id,
      url: base,
    };
    if (mapCfg?.address) business.address = mapCfg.address;
    if (mapCfg?.phone) business.telephone = mapCfg.phone;
    if (mapCfg?.email) business.email = mapCfg.email;
    if (mapCfg?.lat && mapCfg?.lng) {
      business.geo = {
        '@type': 'GeoCoordinates',
        latitude: mapCfg.lat,
        longitude: mapCfg.lng,
      };
    }
    if (mapCfg?.hours) business.openingHours = mapCfg.hours;
    results.push(business);
  }

  return results;
}

// ─── Open Graph Tags ──────────────────────────────────────────────

/**
 * Generates Open Graph meta tag key-value pairs.
 */
export function generateOpenGraphTags(config: AppConfig, pageUrl: string): Record<string, string> {
  const seo = resolveSeo(config, pageUrl);
  const tags: Record<string, string> = {
    'og:type': seo.ogType || 'website',
    'og:url': pageUrl,
  };
  if (seo.title) tags['og:title'] = seo.title;
  if (seo.description) tags['og:description'] = seo.description;
  if (seo.ogImage) tags['og:image'] = seo.ogImage;
  return tags;
}

// ─── Twitter Card Tags ───────────────────────────────────────────

/**
 * Generates Twitter Card meta tag key-value pairs.
 */
export function generateTwitterCardTags(config: AppConfig, pageUrl: string): Record<string, string> {
  const seo = resolveSeo(config, pageUrl);
  const tags: Record<string, string> = {
    'twitter:card': seo.twitterCard || 'summary_large_image',
  };
  if (seo.title) tags['twitter:title'] = seo.title;
  if (seo.description) tags['twitter:description'] = seo.description;
  if (seo.ogImage) tags['twitter:image'] = seo.ogImage;
  return tags;
}

// ─── Canonical URL ────────────────────────────────────────────────

/**
 * Generates a canonical URL from base + page path.
 */
export function generateCanonicalUrl(baseUrl: string, pagePath: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const path = pagePath.startsWith('/') ? pagePath : '/' + pagePath;
  return base + path;
}

// ─── Hreflang Tags ───────────────────────────────────────────────

/**
 * Generates hreflang entries if the config has i18n locales defined.
 */
export function generateHreflangTags(
  config: AppConfig,
  baseUrl: string,
): { lang: string; href: string }[] {
  const base = baseUrl.replace(/\/$/, '');
  const i18n = config.landingConfig?.i18n;
  if (!i18n) return [];

  const locales = Object.keys(i18n);
  if (locales.length === 0) return [];

  const results: { lang: string; href: string }[] = [];
  for (const locale of locales) {
    results.push({ lang: locale, href: `${base}/${locale}` });
  }

  // x-default points to the active locale or first available
  const defaultLocale = config.landingConfig?.locale || config.locale || locales[0];
  results.push({ lang: 'x-default', href: `${base}/${defaultLocale}` });

  return results;
}

// ─── Full Meta Tags HTML ──────────────────────────────────────────

/**
 * Returns a complete HTML string with all SEO meta tags:
 * Open Graph, Twitter Card, canonical, hreflang, keywords, and JSON-LD scripts.
 */
export function generateMetaTagsHtml(
  config: AppConfig,
  baseUrl: string,
  pagePath?: string,
): string {
  const base = baseUrl.replace(/\/$/, '');
  const path = pagePath || '/';
  const pageUrl = generateCanonicalUrl(base, path);
  const seo = resolveSeo(config, pageUrl);
  const lines: string[] = [];

  // Basic meta
  if (seo.title) lines.push(`<title>${escapeHtml(seo.title)}</title>`);
  if (seo.description) {
    lines.push(`<meta name="description" content="${escapeAttr(seo.description)}">`);
  }
  if (seo.keywords?.length) {
    lines.push(`<meta name="keywords" content="${escapeAttr(seo.keywords.join(', '))}">`);
  }

  // Canonical
  lines.push(`<link rel="canonical" href="${escapeAttr(pageUrl)}">`);

  // Hreflang
  const hreflangs = generateHreflangTags(config, base);
  for (const hl of hreflangs) {
    lines.push(`<link rel="alternate" hreflang="${escapeAttr(hl.lang)}" href="${escapeAttr(hl.href)}">`);
  }

  // Open Graph
  const ogTags = generateOpenGraphTags(config, pageUrl);
  for (const [key, value] of Object.entries(ogTags)) {
    lines.push(`<meta property="${escapeAttr(key)}" content="${escapeAttr(value)}">`);
  }

  // Twitter Card
  const twTags = generateTwitterCardTags(config, pageUrl);
  for (const [key, value] of Object.entries(twTags)) {
    lines.push(`<meta name="${escapeAttr(key)}" content="${escapeAttr(value)}">`);
  }

  // JSON-LD
  const jsonLd = generateJsonLd(config, base);
  for (const obj of jsonLd) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(obj)}</script>`);
  }

  return lines.join('\n');
}

// ─── Internal helpers ─────────────────────────────────────────────

/** Collect all landing sections from all pages + top-level landingConfig pages */
function collectLandingSections(config: AppConfig): LandingSection[] {
  const sections: LandingSection[] = [];
  for (const page of config.pages) {
    if (page.landingSections) {
      sections.push(...page.landingSections);
    }
  }
  return sections;
}

/** Resolve SEO config: page-level overrides landing-level */
function resolveSeo(config: AppConfig, pageUrl: string): NonNullable<AppConfig['landingConfig']>['seo'] & Record<string, unknown> {
  const global = config.landingConfig?.seo || {};
  // Try to find page-specific SEO by matching URL segment
  const urlPath = new URL(pageUrl, 'http://localhost').pathname.replace(/^\//, '').replace(/\/$/, '');
  let pageSeo: PageConfig['seo'] | undefined;
  for (const page of config.pages) {
    const seg = page.segment.replace(/^\//, '').replace(/\/$/, '');
    if (seg === urlPath) {
      pageSeo = page.seo;
      break;
    }
  }
  return { ...global, ...pageSeo };
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
