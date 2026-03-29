// @zentto/studio-core — Code generation from StudioSchema / AppConfig
// Generates React/Next.js components that embed the schema and use
// <zentto-studio-renderer> / <zentto-studio-app> web components.

import type { StudioSchema } from '../types.js';
import type { AppConfig } from '../app-types.js';
import { toComponentName, formatJson } from './utils.js';

// ─── Options ──────────────────────────────────────────────────────

export interface CodegenOptions {
  /** Component name (default: derived from schema.title) */
  componentName?: string;
  /** Emit TypeScript (default: true) */
  typescript?: boolean;
  /** Add "use client" directive for Next.js (default: true) */
  useClientDirective?: boolean;
  /** API base URL for data sources (default: '/api') */
  apiBaseUrl?: string;
  /** Include TypeScript type annotations (default: true) */
  includeTypes?: boolean;
  /** Target framework (default: 'nextjs') */
  framework?: 'react' | 'nextjs';
}

const DEFAULT_OPTIONS: Required<CodegenOptions> = {
  componentName: '',
  typescript: true,
  useClientDirective: true,
  apiBaseUrl: '/api',
  includeTypes: true,
  framework: 'nextjs',
};

function resolveOptions(opts?: CodegenOptions): Required<CodegenOptions> {
  return { ...DEFAULT_OPTIONS, ...opts };
}

// ─── React Component ──────────────────────────────────────────────

/**
 * Generate a React/Next.js client component that renders a StudioSchema
 * via <zentto-studio-renderer>.
 */
export function generateReactComponent(
  schema: StudioSchema,
  options?: CodegenOptions,
): string {
  const o = resolveOptions(options);
  const name = o.componentName || toComponentName(schema.title) || 'StudioForm';
  const useClient = o.framework === 'nextjs' && o.useClientDirective;
  const refType = o.typescript && o.includeTypes ? '<any>' : '';

  const schemaJson = formatJson(schema, 2, 4);

  const lines: string[] = [];

  if (useClient) lines.push('"use client";', '');

  lines.push(
    'import { useEffect, useState, useRef } from "react";',
    '',
    `export default function ${name}() {`,
    `  const [ready, setReady] = useState(false);`,
    `  const ref = useRef${refType}(null);`,
    '',
    '  useEffect(() => {',
    '    import("@zentto/studio").then(() => setReady(true));',
    '  }, []);',
    '',
    '  useEffect(() => {',
    '    if (!ready || !ref.current) return;',
    `    ref.current.schema = ${schemaJson};`,
    '  }, [ready]);',
    '',
    '  return ready',
    '    ? <zentto-studio-renderer ref={ref} />',
    '    : <div>Cargando...</div>;',
    '}',
  );

  return lines.join('\n');
}

// ─── Next.js Page ─────────────────────────────────────────────────

/**
 * Generate a Next.js page.tsx that exports metadata and renders the
 * schema component.
 */
export function generateNextPage(
  schema: StudioSchema,
  options?: CodegenOptions,
): string {
  const o = resolveOptions({ ...options, framework: 'nextjs', useClientDirective: true });
  const name = o.componentName || toComponentName(schema.title) || 'StudioForm';
  const refType = o.typescript && o.includeTypes ? '<any>' : '';

  const metaTitle = schema.title || name;
  const metaDesc = schema.description || `Pagina generada por Zentto Studio`;

  const schemaJson = formatJson(schema, 2, 6);

  const lines: string[] = [];

  // Metadata export (server part — re-exported from client file as static)
  lines.push(
    '"use client";',
    '',
    'import { useEffect, useState, useRef } from "react";',
    '',
    `// Metadata — move to a separate layout.tsx or use generateMetadata()`,
    `// if you need server-side metadata:`,
    `// export const metadata = { title: "${metaTitle}", description: "${metaDesc}" };`,
    '',
    `export default function ${name}Page() {`,
    `  const [ready, setReady] = useState(false);`,
    `  const ref = useRef${refType}(null);`,
    '',
    '  useEffect(() => {',
    '    import("@zentto/studio").then(() => setReady(true));',
    '  }, []);',
    '',
    '  useEffect(() => {',
    '    if (!ready || !ref.current) return;',
    `    ref.current.schema = ${schemaJson};`,
    '  }, [ready]);',
    '',
    '  return (',
    '    <main>',
    `      <h1>${metaTitle}</h1>`,
    '      {ready',
    '        ? <zentto-studio-renderer ref={ref} />',
    '        : <div>Cargando...</div>',
    '      }',
    '    </main>',
    '  );',
    '}',
  );

  return lines.join('\n');
}

// ─── App Page (AppConfig) ─────────────────────────────────────────

/**
 * Generate a React/Next.js component that renders a full AppConfig
 * via <zentto-studio-app>.
 */
export function generateAppPage(
  config: AppConfig,
  options?: CodegenOptions,
): string {
  const o = resolveOptions(options);
  const name = o.componentName
    || toComponentName(config.branding?.title || '') || 'StudioApp';
  const useClient = o.framework === 'nextjs' && o.useClientDirective;
  const refType = o.typescript && o.includeTypes ? '<any>' : '';

  const configJson = formatJson(config, 2, 4);

  const lines: string[] = [];

  if (useClient) lines.push('"use client";', '');

  lines.push(
    'import { useEffect, useState, useRef } from "react";',
    '',
    `export default function ${name}() {`,
    `  const [ready, setReady] = useState(false);`,
    `  const ref = useRef${refType}(null);`,
    '',
    '  useEffect(() => {',
    '    import("@zentto/studio").then(() => setReady(true));',
    '  }, []);',
    '',
    '  useEffect(() => {',
    '    if (!ready || !ref.current) return;',
    `    ref.current.config = ${configJson};`,
    '  }, [ready]);',
    '',
    '  return ready',
    '    ? <zentto-studio-app ref={ref} />',
    '    : <div>Cargando aplicacion...</div>;',
    '}',
  );

  return lines.join('\n');
}

// Re-export utilities
export { toComponentName, formatJson, escapeForJsx } from './utils.js';
