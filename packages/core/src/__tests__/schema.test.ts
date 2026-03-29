import { describe, it, expect } from 'vitest';
import { validateSchema, safeValidateSchema } from '../schema/studio-schema.js';

describe('Schema Validation', () => {
  const validSchema = {
    id: 'test-form',
    version: '1.0.0',
    title: 'Test Form',
    layout: { type: 'form' },
    sections: [{
      id: 'main',
      title: 'Datos Principales',
      fields: [
        { id: 'name', type: 'text', field: 'name', label: 'Nombre', required: true },
        { id: 'email', type: 'email', field: 'email', label: 'Email' },
        { id: 'age', type: 'number', field: 'age', label: 'Edad' },
      ],
    }],
    actions: [
      { id: 'submit', type: 'submit', label: 'Guardar', variant: 'primary' },
    ],
  };

  it('validates a correct schema', () => {
    const result = safeValidateSchema(validSchema);
    expect(result.success).toBe(true);
  });

  it('rejects schema without id', () => {
    const result = safeValidateSchema({ ...validSchema, id: '' });
    expect(result.success).toBe(false);
  });

  it('rejects schema without sections', () => {
    const result = safeValidateSchema({ ...validSchema, sections: [] });
    expect(result.success).toBe(false);
  });

  it('rejects invalid field type', () => {
    const result = safeValidateSchema({
      ...validSchema,
      sections: [{
        id: 's1',
        fields: [{ id: 'f1', type: 'invalid_type', field: 'x' }],
      }],
    });
    expect(result.success).toBe(false);
  });

  it('validates schema with all layout types', () => {
    for (const type of ['form', 'grid', 'tabs', 'wizard', 'accordion', 'dashboard', 'master-detail']) {
      const result = safeValidateSchema({
        ...validSchema,
        layout: { type },
      });
      expect(result.success).toBe(true);
    }
  });

  it('validates schema with rules', () => {
    const result = safeValidateSchema({
      ...validSchema,
      rules: [{
        id: 'r1',
        condition: '{age} >= 18',
        actions: [{ type: 'show', target: 'license' }],
      }],
    });
    expect(result.success).toBe(true);
  });

  it('validates schema with data sources', () => {
    const result = safeValidateSchema({
      ...validSchema,
      dataSources: [{
        id: 'ds1', name: 'Countries', type: 'rest',
        url: '/api/countries', method: 'GET',
      }],
    });
    expect(result.success).toBe(true);
  });

  it('validates schema with permissions', () => {
    const result = safeValidateSchema({
      ...validSchema,
      permissions: {
        flavors: [{
          id: 'admin-view', name: 'Vista Admin',
          roles: ['admin'],
          overrides: [{ fieldId: 'secret', hidden: false }],
        }],
      },
    });
    expect(result.success).toBe(true);
  });

  it('parseSchema throws on invalid', () => {
    expect(() => validateSchema({})).toThrow();
  });
});
