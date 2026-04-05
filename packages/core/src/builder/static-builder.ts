// @zentto/studio-core — Static site builder
// Generates a complete multi-page static site from an AppConfig

import type { AppConfig, PageConfig, SeoConfig } from '../app-types.js';

// ─── Public types ─────────────────────────────────────────────────

export interface StaticSiteOutput {
  files: Record<string, string>; // path → content (e.g. "index.html" → "<html>...")
}

export interface BuildOptions {
  baseUrl: string;              // e.g. "https://mi-sitio.zentto.net"
  studioVersion?: string;       // default "0.13.0"
  cdnBase?: string;             // default "https://esm.sh"
  includeAnalytics?: string;    // Umami script URL
  customHeadHtml?: string;      // extra HTML for <head>
  customBodyHtml?: string;      // extra HTML for <body>
}

// ─── Helpers ──────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escJsonInScript(json: string): string {
  // Prevent </script> injection inside JSON payloads
  return json.replace(/<\//g, '<\\/');
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site';
}

function toISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function trailingSlash(url: string): string {
  return url.endsWith('/') ? url : url + '/';
}

// ─── SEO meta builder ─────────────────────────────────────────────

function buildMetaTags(
  seo: SeoConfig | undefined,
  pageTitle: string,
  pageDescription: string,
  pageUrl: string,
  primaryColor: string,
): string {
  const title = seo?.title || pageTitle;
  const description = seo?.description || pageDescription;
  const ogImage = seo?.ogImage || '';
  const ogType = seo?.ogType || 'website';
  const twitterCard = seo?.twitterCard || 'summary_large_image';
  const canonical = seo?.canonicalUrl || pageUrl;
  const keywords = seo?.keywords?.join(', ') || '';

  const lines: string[] = [
    `<title>${escHtml(title)}</title>`,
    `<meta name="description" content="${escHtml(description)}">`,
    `<meta name="theme-color" content="${primaryColor}">`,
    canonical ? `<link rel="canonical" href="${escHtml(canonical)}">` : '',
    keywords ? `<meta name="keywords" content="${escHtml(keywords)}">` : '',
    // Open Graph
    `<meta property="og:title" content="${escHtml(title)}">`,
    `<meta property="og:description" content="${escHtml(description)}">`,
    `<meta property="og:type" content="${escHtml(ogType)}">`,
    `<meta property="og:url" content="${escHtml(pageUrl)}">`,
    ogImage ? `<meta property="og:image" content="${escHtml(ogImage)}">` : '',
    // Twitter Card
    `<meta name="twitter:card" content="${escHtml(twitterCard)}">`,
    `<meta name="twitter:title" content="${escHtml(title)}">`,
    `<meta name="twitter:description" content="${escHtml(description)}">`,
    ogImage ? `<meta name="twitter:image" content="${escHtml(ogImage)}">` : '',
  ];

  return lines.filter(Boolean).join('\n  ');
}

// ─── JSON-LD builder ──────────────────────────────────────────────

function buildJsonLd(
  seo: SeoConfig | undefined,
  pageTitle: string,
  pageDescription: string,
  pageUrl: string,
): string {
  const ld = seo?.jsonLd ?? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo?.title || pageTitle,
    description: seo?.description || pageDescription,
    url: seo?.canonicalUrl || pageUrl,
  };
  const json = JSON.stringify(ld, null, 2);
  return `<script type="application/ld+json">${escJsonInScript(json)}</script>`;
}

// ─── CSP meta tag ─────────────────────────────────────────────────

function buildCspMeta(cdnBase: string, analyticsUrl?: string): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    cdnBase,
  ];
  if (analyticsUrl) {
    try { scriptSrc.push(new URL(analyticsUrl).origin); } catch { /* ignore */ }
  }

  const policy = [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: https:`,
    `connect-src 'self' https:`,
    `frame-src 'self' https://www.youtube.com https://player.vimeo.com`,
  ].join('; ');

  return `<meta http-equiv="Content-Security-Policy" content="${escHtml(policy)}">`;
}

// ─── Page HTML builder ────────────────────────────────────────────

function buildPageHtml(
  config: AppConfig,
  page: PageConfig,
  options: BuildOptions,
  isHome: boolean,
): string {
  const version = options.studioVersion ?? '0.13.0';
  const cdnBase = options.cdnBase ?? 'https://esm.sh';
  const baseUrl = trailingSlash(options.baseUrl);

  const siteTitle = config.branding?.title
    || config.landingConfig?.navbar?.title
    || 'Mi Sitio';
  const pageTitle = isHome
    ? (page.seo?.title || siteTitle)
    : `${page.title} — ${siteTitle}`;
  const pageDescription = page.seo?.description
    || config.landingConfig?.seo?.description
    || `${siteTitle} — Creado con Zentto`;
  const primaryColor = config.branding?.primaryColor || '#6366f1';
  const pageUrl = isHome ? baseUrl : `${baseUrl}${page.segment}/`;
  const favicon = config.branding?.favicon
    || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>";
  const locale = config.locale || config.landingConfig?.locale || 'es';

  // Merge page-level SEO over global SEO
  const seo: SeoConfig = {
    ...config.landingConfig?.seo,
    ...page.seo,
  };

  const configJson = escJsonInScript(JSON.stringify(config, null, 2));

  const analyticsScript = options.includeAnalytics
    ? `\n  <script defer src="${escHtml(options.includeAnalytics)}"></script>`
    : '';

  const customHead = options.customHeadHtml ?? '';
  const customBody = options.customBodyHtml ?? '';

  return `<!DOCTYPE html>
<html lang="${escHtml(locale)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${buildCspMeta(cdnBase, options.includeAnalytics)}
  <meta name="generator" content="Zentto Studio ${version}">
  ${buildMetaTags(seo, pageTitle, pageDescription, pageUrl, primaryColor)}
  <link rel="icon" href="${escHtml(favicon)}">
  ${buildJsonLd(seo, pageTitle, pageDescription, pageUrl)}
  <style>
    *,*::before,*::after{box-sizing:border-box}
    html,body{margin:0;padding:0;min-height:100vh}
    body{font-family:system-ui,-apple-system,sans-serif}
    .zl-loading{display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;color:#6b7280}
    .zl-spinner{width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:${primaryColor};border-radius:50%;animation:zl-spin .8s linear infinite}
    @keyframes zl-spin{to{transform:rotate(360deg)}}
    zentto-studio-app:not(:defined){display:none}
  </style>${analyticsScript}
  ${customHead}
</head>
<body>
  <div class="zl-loading" id="zl-loader">
    <div class="zl-spinner"></div>
    <noscript>Este sitio requiere JavaScript.</noscript>
  </div>
  <zentto-studio-app id="zl-app" style="display:block;width:100%;min-height:100vh;"></zentto-studio-app>
  ${customBody}
  <script type="module">
    import '${cdnBase}/@zentto/studio@${version}/app';
    import '${cdnBase}/@zentto/studio@${version}/landing';
    const config = ${configJson};
    customElements.whenDefined('zentto-studio-app').then(() => {
      const app = document.getElementById('zl-app');
      if (app) app.config = config;
      document.getElementById('zl-loader')?.remove();
    });
  </script>
</body>
</html>`;
}

// ─── sitemap.xml ──────────────────────────────────────────────────

function buildSitemap(config: AppConfig, baseUrl: string): string {
  const base = trailingSlash(baseUrl);
  const lastmod = toISODate();
  const urls: string[] = [];

  for (const page of config.pages) {
    const isHome = page.segment === '' || page.segment === '/';
    const loc = isHome ? base : `${base}${page.segment}/`;
    const priority = isHome ? '1.0' : '0.8';
    urls.push(`  <url>
    <loc>${escHtml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// ─── robots.txt ───────────────────────────────────────────────────

function buildRobots(baseUrl: string): string {
  const base = trailingSlash(baseUrl);
  return `User-agent: *
Allow: /

Sitemap: ${base}sitemap.xml`;
}

// ─── manifest.json ────────────────────────────────────────────────

function buildManifest(config: AppConfig): string {
  const name = config.branding?.title || 'Zentto Site';
  const shortName = name.length > 12 ? name.slice(0, 12).trim() : name;
  const themeColor = config.branding?.primaryColor || '#6366f1';
  const bgColor = '#ffffff';

  const manifest = {
    name,
    short_name: shortName,
    start_url: '/',
    display: 'standalone' as const,
    background_color: bgColor,
    theme_color: themeColor,
    icons: [
      {
        src: config.branding?.favicon || '/favicon.ico',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: config.branding?.favicon || '/favicon.ico',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  return JSON.stringify(manifest, null, 2);
}

// ─── Main builder ─────────────────────────────────────────────────

/**
 * Generates a complete multi-page static site from an AppConfig.
 *
 * Returns a `StaticSiteOutput` with a `files` map where each key is a
 * relative path (e.g. `"index.html"`, `"about/index.html"`) and the value
 * is the full file content ready to be written to disk or uploaded.
 */
export function buildStaticSite(config: AppConfig, options: BuildOptions): StaticSiteOutput {
  const files: Record<string, string> = {};

  // Build HTML pages
  for (const page of config.pages) {
    const isHome = page.segment === '' || page.segment === '/';
    const path = isHome ? 'index.html' : `${page.segment}/index.html`;
    files[path] = buildPageHtml(config, page, options, isHome);
  }

  // If no pages exist, generate at least a homepage
  if (config.pages.length === 0) {
    const fallbackPage: PageConfig = {
      id: 'home',
      segment: '',
      title: config.branding?.title || 'Inicio',
      content: 'empty',
    };
    files['index.html'] = buildPageHtml(config, fallbackPage, options, true);
  }

  // Auxiliary files
  files['sitemap.xml'] = buildSitemap(config, options.baseUrl);
  files['robots.txt'] = buildRobots(options.baseUrl);
  files['manifest.json'] = buildManifest(config);

  return { files };
}
