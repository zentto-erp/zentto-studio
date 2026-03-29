// @zentto/studio-core — Codegen utilities

/**
 * Convert a title string to a valid PascalCase component name.
 * "Mi Formulario" → "MiFormulario"
 * "customer-list" → "CustomerList"
 */
export function toComponentName(title: string): string {
  if (!title) return 'StudioComponent';
  return title
    .replace(/[^a-zA-Z0-9\s\-_áéíóúñÁÉÍÓÚÑ]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => {
      // Strip accents for valid JS identifiers
      const clean = word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    })
    .join('');
}

/**
 * Pretty-print a JSON object with configurable indent,
 * adding the given base indent to every line after the first.
 */
export function formatJson(obj: unknown, indent: number = 2, baseIndent: number = 0): string {
  const raw = JSON.stringify(obj, null, indent);
  if (baseIndent === 0) return raw;
  const pad = ' '.repeat(baseIndent);
  return raw
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n');
}

/**
 * Escape a string for safe embedding inside JSX/TSX.
 */
export function escapeForJsx(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
}
