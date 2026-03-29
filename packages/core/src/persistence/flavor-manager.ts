// @zentto/studio-core — Flavor manager (role-based UI customization)
// SAP Screen Personas equivalent: different "views" per user role

import type { Flavor, FlavorOverride, FieldConfig, PermissionConfig, Section, StudioSchema } from '../types.js';

/**
 * Find the applicable flavor for a user's roles.
 * Returns the first matching flavor, or the default flavor.
 */
export function resolveFlavor(
  permissions: PermissionConfig | undefined,
  userRoles: string[],
): Flavor | null {
  if (!permissions?.flavors || permissions.flavors.length === 0) return null;

  // Find first flavor matching any user role
  for (const flavor of permissions.flavors) {
    const matches = flavor.roles.some(role => userRoles.includes(role));
    if (matches) return flavor;
  }

  // Fallback to default flavor
  if (permissions.defaultFlavorId) {
    return permissions.flavors.find(f => f.id === permissions.defaultFlavorId) ?? null;
  }

  return null;
}

/**
 * Apply flavor overrides to a schema's sections (immutable — returns new sections).
 * Modifies field visibility, readOnly, disabled, defaultValue, label.
 */
export function applyFlavor(
  sections: Section[],
  flavor: Flavor | null,
): Section[] {
  if (!flavor || flavor.overrides.length === 0) return sections;

  const overrideMap = new Map<string, FlavorOverride>();
  for (const override of flavor.overrides) {
    overrideMap.set(override.fieldId, override);
  }

  return sections.map(section => ({
    ...section,
    fields: section.fields.map(field => {
      const override = overrideMap.get(field.id);
      if (!override) return field;

      return {
        ...field,
        hidden: override.hidden ?? field.hidden,
        readOnly: override.readOnly ?? field.readOnly,
        disabled: override.disabled ?? field.disabled,
        defaultValue: override.defaultValue ?? field.defaultValue,
        label: override.label ?? field.label,
      };
    }),
  }));
}

/**
 * Apply flavor to a full schema (convenience).
 * Returns a new schema with flavor-adjusted sections.
 */
export function applyFlavorToSchema(
  schema: StudioSchema,
  userRoles: string[],
): StudioSchema {
  const flavor = resolveFlavor(schema.permissions, userRoles);
  if (!flavor) return schema;

  return {
    ...schema,
    sections: applyFlavor(schema.sections, flavor),
  };
}
