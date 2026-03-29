// @zentto/studio-core — Data response transformation utilities

/**
 * Flatten a nested API response to a simple key-value object.
 * Useful for mapping API responses to form fields.
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  separator = '.',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}${separator}${key}` : key;

    if (value != null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey, separator));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Unflatten a flat key-value object to nested structure.
 */
export function unflattenObject(
  obj: Record<string, unknown>,
  separator = '.',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(separator);
    let current: Record<string, unknown> = result;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

/**
 * Pick specific fields from a data object.
 * Supports dot notation paths.
 */
export function pickFields(
  data: Record<string, unknown>,
  fields: string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const parts = field.split('.');
    let value: unknown = data;
    for (const part of parts) {
      if (value == null || typeof value !== 'object') { value = undefined; break; }
      value = (value as Record<string, unknown>)[part];
    }
    if (value !== undefined) result[field] = value;
  }

  return result;
}
