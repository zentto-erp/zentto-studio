// @zentto/studio-core — CSS Grid layout solver
// Converts layout config + sections into CSS Grid template strings

import type { FieldConfig, LayoutConfig, ResponsiveBreakpoint, Section } from '../types.js';

export interface GridLayoutResult {
  containerStyle: Record<string, string>;
  fieldStyles: Map<string, Record<string, string>>;
}

/**
 * Compute CSS Grid styles for a form layout.
 */
export function solveGridLayout(
  layout: LayoutConfig,
  sections: Section[],
): GridLayoutResult {
  const columns = layout.columns ?? 1;
  const gap = layout.gap ?? 16;

  const containerStyle: Record<string, string> = {
    display: 'grid',
    'grid-template-columns': `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  const fieldStyles = new Map<string, Record<string, string>>();

  for (const section of sections) {
    for (const field of section.fields) {
      const style: Record<string, string> = {};

      // Column span
      const span = Math.min(field.colSpan ?? 1, columns);
      if (span > 1) {
        style['grid-column'] = `span ${span}`;
      }

      // Full width for certain field types
      if (['separator', 'heading', 'html', 'datagrid', 'report'].includes(field.type)) {
        style['grid-column'] = `1 / -1`; // full width
      }

      // Custom width
      if (field.width) {
        style['width'] = typeof field.width === 'number' ? `${field.width}px` : field.width;
      }

      if (Object.keys(style).length > 0) {
        fieldStyles.set(field.id, style);
      }
    }
  }

  return { containerStyle, fieldStyles };
}

/**
 * Get the number of columns for a given viewport width.
 */
export function getResponsiveColumns(
  layout: LayoutConfig,
  viewportWidth: number,
): number {
  const breakpoints = layout.responsive ?? [];
  const columns = layout.columns ?? 1;

  // Sort breakpoints ascending by maxWidth
  const sorted = [...breakpoints].sort((a, b) => a.maxWidth - b.maxWidth);

  for (const bp of sorted) {
    if (viewportWidth <= bp.maxWidth) {
      return bp.columns;
    }
  }

  return columns;
}

/**
 * Generate CSS media query string for responsive breakpoints.
 */
export function generateResponsiveCSS(
  layout: LayoutConfig,
  containerSelector: string,
): string {
  const breakpoints = layout.responsive ?? [];
  if (breakpoints.length === 0) return '';

  const gap = layout.gap ?? 16;
  let css = '';

  for (const bp of breakpoints) {
    css += `@media (max-width: ${bp.maxWidth}px) {\n`;
    css += `  ${containerSelector} {\n`;
    css += `    grid-template-columns: repeat(${bp.columns}, 1fr);\n`;
    css += `    gap: ${gap}px;\n`;
    css += `  }\n`;
    css += `}\n`;
  }

  return css;
}
