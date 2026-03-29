import { createComponent } from '@lit/react';
import { ZenttoStudioRenderer as RendererElement } from '@zentto/studio';
import React from 'react';

/**
 * React wrapper for <zentto-studio-renderer> web component.
 *
 * @example
 * ```tsx
 * import { ZenttoStudioRenderer } from '@zentto/studio-react';
 *
 * <ZenttoStudioRenderer
 *   schema={mySchema}
 *   data={{ nombre: 'Juan', email: 'juan@test.com' }}
 *   onStudioChange={(e) => console.log('Field changed:', e.detail)}
 *   onStudioSubmit={(e) => console.log('Form submitted:', e.detail.data)}
 * />
 * ```
 */
export const ZenttoStudioRenderer = createComponent({
  tagName: 'zentto-studio-renderer',
  elementClass: RendererElement,
  react: React,
  events: {
    onStudioChange: 'studio-change',
    onStudioSubmit: 'studio-submit',
    onStudioAction: 'studio-action',
  } as any,
});

// Re-export core types for convenience
export type {
  StudioSchema,
  FieldConfig,
  FieldType,
  Section,
  LayoutConfig,
  LayoutType,
  DataSourceConfig,
  ActionConfig,
  Rule,
  RuleAction,
  ValidationRule,
  ThemeConfig,
  Flavor,
  PermissionConfig,
  SelectOption,
  StudioBindingContext,
} from '@zentto/studio-core';

// Re-export core utilities
export {
  validateSchema,
  safeValidateSchema,
  evaluateExpression,
  evaluateCondition,
  DataModel,
  EventBus,
} from '@zentto/studio-core';
