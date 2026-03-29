// @zentto/studio-core — Runtime field validation engine

import type { FieldConfig, StudioBindingContext, ValidationRule } from '../types.js';
import { evaluateCondition } from './expression.js';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

/**
 * Validate a single field value against its validation rules.
 */
export function validateField(
  field: FieldConfig,
  value: unknown,
  context: StudioBindingContext,
): ValidationResult {
  const errors: string[] = [];
  const rules = field.validation ?? [];

  // Check required (built-in from field.required + explicit rule)
  if (field.required) {
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
      errors.push(field.label ? `${field.label} es requerido` : 'Campo requerido');
    }
  }

  for (const rule of rules) {
    const err = validateRule(rule, value, context);
    if (err) errors.push(err);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a single rule against a value.
 */
function validateRule(
  rule: ValidationRule,
  value: unknown,
  context: StudioBindingContext,
): string | null {
  const strVal = value == null ? '' : String(value);
  const numVal = typeof value === 'number' ? value : parseFloat(strVal);

  switch (rule.type) {
    case 'required':
      if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return rule.message ?? 'Campo requerido';
      }
      return null;

    case 'min':
      if (value != null && value !== '' && !isNaN(numVal) && numVal < Number(rule.value)) {
        return rule.message ?? `El valor minimo es ${rule.value}`;
      }
      return null;

    case 'max':
      if (value != null && value !== '' && !isNaN(numVal) && numVal > Number(rule.value)) {
        return rule.message ?? `El valor maximo es ${rule.value}`;
      }
      return null;

    case 'minLength':
      if (strVal.length > 0 && strVal.length < Number(rule.value)) {
        return rule.message ?? `Minimo ${rule.value} caracteres`;
      }
      return null;

    case 'maxLength':
      if (strVal.length > Number(rule.value)) {
        return rule.message ?? `Maximo ${rule.value} caracteres`;
      }
      return null;

    case 'pattern':
      if (strVal.length > 0 && rule.value) {
        try {
          const regex = new RegExp(String(rule.value));
          if (!regex.test(strVal)) {
            return rule.message ?? 'Formato invalido';
          }
        } catch {
          // Invalid regex — skip
        }
      }
      return null;

    case 'email':
      if (strVal.length > 0 && !EMAIL_REGEX.test(strVal)) {
        return rule.message ?? 'Email invalido';
      }
      return null;

    case 'url':
      if (strVal.length > 0 && !URL_REGEX.test(strVal)) {
        return rule.message ?? 'URL invalida';
      }
      return null;

    case 'custom':
      if (rule.expression) {
        const passes = evaluateCondition(rule.expression, context);
        if (!passes) {
          return rule.message ?? 'Validacion fallida';
        }
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validate all fields in a schema.
 * Returns a map of fieldId → errors.
 */
export function validateAllFields(
  fields: FieldConfig[],
  context: StudioBindingContext,
): Map<string, string[]> {
  const results = new Map<string, string[]>();

  for (const field of fields) {
    const value = resolveFieldValue(field.field, context.formData);
    const result = validateField(field, value, context);
    if (!result.valid) {
      results.set(field.id, result.errors);
    }
  }

  return results;
}

function resolveFieldValue(path: string, data: Record<string, unknown>): unknown {
  const parts = path.split('.');
  let current: unknown = data;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
