// @zentto/studio-core — Content-Security-Policy & security headers generator
// Builds CSP directives and security headers from AppConfig.

import type { AppConfig, LandingSection } from '../app-types.js';

// ─── CSP Generator ────────────────────────────────────────────────

/**
 * Generates a Content-Security-Policy header value based on the AppConfig.
 *
 * Directives:
 * - default-src: 'self'
 * - script-src: 'self' + esm.sh (CDN) + integration scripts (GA, Pixel, etc.)
 * - style-src: 'self' 'unsafe-inline' (needed for Lit / web components)
 * - img-src: 'self' data: https: (allow external images)
 * - font-src: 'self' fonts.googleapis.com fonts.gstatic.com
 * - connect-src: 'self' + API endpoints from dataSources
 * - frame-src: media/map providers if video/map sections are present
 */
export function generateCSP(config: AppConfig): string {
  const directives: Record<string, Set<string>> = {
    'default-src': new Set(["'self'"]),
    'script-src': new Set(["'self'", 'https://esm.sh']),
    'style-src': new Set(["'self'", "'unsafe-inline'"]),
    'img-src': new Set(["'self'", 'data:', 'https:']),
    'font-src': new Set(["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com']),
    'connect-src': new Set(["'self'"]),
    'frame-src': new Set(["'self'"]),
  };

  // Add API endpoints from global data sources
  if (config.dataSources) {
    for (const ds of config.dataSources) {
      if (ds.type === 'rest' && ds.url) {
        addOrigin(directives['connect-src'], ds.url);
      }
    }
  }

  // Add API endpoints from page-level data sources
  for (const page of config.pages) {
    if (page.dataSources) {
      for (const ds of page.dataSources) {
        if (ds.type === 'rest' && ds.url) {
          addOrigin(directives['connect-src'], ds.url);
        }
      }
    }
  }

  // Collect all landing sections
  const allSections = collectSections(config);

  // Check for video sections — add frame-src for providers
  const hasVideo = allSections.some((s) => s.type === 'video' && s.videoConfig);
  const hasMap = allSections.some((s) => s.type === 'map' && s.mapConfig);

  if (hasVideo) {
    directives['frame-src'].add('https://www.youtube.com');
    directives['frame-src'].add('https://player.vimeo.com');
    directives['frame-src'].add('https://open.spotify.com');
  }

  if (hasMap) {
    directives['frame-src'].add('https://maps.google.com');
    directives['frame-src'].add('https://www.google.com');
    directives['frame-src'].add('https://*.openstreetmap.org');
  }

  // Check for common integrations in iframe pages
  for (const page of config.pages) {
    if (page.content === 'iframe' && page.iframeUrl) {
      addOrigin(directives['frame-src'], page.iframeUrl);
    }
  }

  // Build the header value
  const parts: string[] = [];
  for (const [directive, values] of Object.entries(directives)) {
    if (values.size > 0) {
      parts.push(`${directive} ${[...values].join(' ')}`);
    }
  }

  return parts.join('; ');
}

// ─── Security Headers ─────────────────────────────────────────────

/**
 * Returns a complete set of recommended security headers including CSP.
 */
export function generateSecurityHeaders(config: AppConfig): Record<string, string> {
  return {
    'Content-Security-Policy': generateCSP(config),
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=(self)',
  };
}

// ─── Internal helpers ─────────────────────────────────────────────

/** Extract the origin from a URL and add it to the set */
function addOrigin(set: Set<string>, url: string): void {
  try {
    const parsed = new URL(url);
    set.add(parsed.origin);
  } catch {
    // If it's a relative URL or invalid, skip
  }
}

/** Collect all landing sections from all pages */
function collectSections(config: AppConfig): LandingSection[] {
  const sections: LandingSection[] = [];
  for (const page of config.pages) {
    if (page.landingSections) {
      sections.push(...page.landingSections);
    }
  }
  return sections;
}
