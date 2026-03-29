import { describe, it, expect } from 'vitest';
import { validateField } from '../engine/validation.js';
import type { FieldConfig, StudioBindingContext } from '../types.js';

const ctx: StudioBindingContext = { formData: {}, dataSources: {} };

const textField = (overrides: Partial<FieldConfig> = {}): FieldConfig => ({
  id: 'f1', type: 'text', field: 'name', ...overrides,
});

describe('Validation Engine', () => {
  it('validates required fields', () => {
    const result = validateField(textField({ required: true, label: 'Nombre' }), '', ctx);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('requerido');
  });

  it('passes when required field has value', () => {
    const result = validateField(textField({ required: true }), 'Juan', ctx);
    expect(result.valid).toBe(true);
  });

  it('validates min value', () => {
    const field = textField({ validation: [{ type: 'min', value: 10 }] });
    expect(validateField(field, 5, ctx).valid).toBe(false);
    expect(validateField(field, 15, ctx).valid).toBe(true);
  });

  it('validates max value', () => {
    const field = textField({ validation: [{ type: 'max', value: 100 }] });
    expect(validateField(field, 150, ctx).valid).toBe(false);
    expect(validateField(field, 50, ctx).valid).toBe(true);
  });

  it('validates minLength', () => {
    const field = textField({ validation: [{ type: 'minLength', value: 3 }] });
    expect(validateField(field, 'ab', ctx).valid).toBe(false);
    expect(validateField(field, 'abc', ctx).valid).toBe(true);
  });

  it('validates maxLength', () => {
    const field = textField({ validation: [{ type: 'maxLength', value: 5 }] });
    expect(validateField(field, 'abcdef', ctx).valid).toBe(false);
    expect(validateField(field, 'abc', ctx).valid).toBe(true);
  });

  it('validates email', () => {
    const field = textField({ validation: [{ type: 'email' }] });
    expect(validateField(field, 'invalid', ctx).valid).toBe(false);
    expect(validateField(field, 'test@test.com', ctx).valid).toBe(true);
  });

  it('validates url', () => {
    const field = textField({ validation: [{ type: 'url' }] });
    expect(validateField(field, 'not-a-url', ctx).valid).toBe(false);
    expect(validateField(field, 'https://zentto.net', ctx).valid).toBe(true);
  });

  it('validates pattern', () => {
    const field = textField({ validation: [{ type: 'pattern', value: '^[A-Z]+$' }] });
    expect(validateField(field, 'abc', ctx).valid).toBe(false);
    expect(validateField(field, 'ABC', ctx).valid).toBe(true);
  });

  it('validates custom expression', () => {
    const field = textField({
      validation: [{
        type: 'custom',
        expression: '{cantidad} > 0',
        message: 'Cantidad debe ser positiva',
      }],
    });
    const failCtx = { formData: { cantidad: -1 }, dataSources: {} };
    const passCtx = { formData: { cantidad: 5 }, dataSources: {} };
    expect(validateField(field, -1, failCtx).valid).toBe(false);
    expect(validateField(field, 5, passCtx).valid).toBe(true);
  });

  it('skips validation on empty non-required fields', () => {
    const field = textField({ validation: [{ type: 'email' }] });
    expect(validateField(field, '', ctx).valid).toBe(true);
  });
});
