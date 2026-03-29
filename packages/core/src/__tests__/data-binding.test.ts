import { describe, it, expect } from 'vitest';
import { DataModel, getDeepValue, setDeepValue } from '../engine/data-binding.js';
import { EventBus } from '../events/event-bus.js';
import type { StudioSchema } from '../types.js';

describe('getDeepValue', () => {
  it('resolves simple paths', () => {
    expect(getDeepValue({ name: 'Juan' }, 'name')).toBe('Juan');
  });

  it('resolves nested paths', () => {
    expect(getDeepValue({ customer: { address: { city: 'Madrid' } } }, 'customer.address.city')).toBe('Madrid');
  });

  it('resolves array notation', () => {
    expect(getDeepValue({ items: [{ name: 'A' }, { name: 'B' }] }, 'items[1].name')).toBe('B');
  });

  it('returns undefined for missing paths', () => {
    expect(getDeepValue({}, 'a.b.c')).toBeUndefined();
  });
});

describe('setDeepValue', () => {
  it('sets simple values', () => {
    const obj: Record<string, unknown> = {};
    setDeepValue(obj, 'name', 'Juan');
    expect(obj.name).toBe('Juan');
  });

  it('sets nested values (creates intermediates)', () => {
    const obj: Record<string, unknown> = {};
    setDeepValue(obj, 'customer.address.city', 'Madrid');
    expect((obj.customer as any).address.city).toBe('Madrid');
  });

  it('sets array values', () => {
    const obj: Record<string, unknown> = { items: [{ name: 'A' }] };
    setDeepValue(obj, 'items[0].name', 'B');
    expect((obj.items as any[])[0].name).toBe('B');
  });
});

describe('DataModel', () => {
  const bus = new EventBus();

  const schema: StudioSchema = {
    id: 'test', version: '1.0', title: 'Test',
    layout: { type: 'form' },
    sections: [{
      id: 's1', fields: [
        { id: 'f1', type: 'text', field: 'name', label: 'Nombre', required: true },
        { id: 'f2', type: 'number', field: 'age', label: 'Edad', defaultValue: 18 },
      ],
    }],
  };

  it('initializes from schema with defaults', () => {
    const model = new DataModel({}, bus);
    model.initializeFromSchema(schema);
    expect(model.getValue('age')).toBe(18);
  });

  it('sets and gets values', () => {
    const model = new DataModel({ name: 'Juan' }, bus);
    model.initializeFromSchema(schema);
    expect(model.getValue('name')).toBe('Juan');

    model.setValue('f1', 'name', 'Pedro');
    expect(model.getValue('name')).toBe('Pedro');
  });

  it('emits field:change events', () => {
    const eventBus = new EventBus();
    const model = new DataModel({ name: 'Juan' }, eventBus);
    model.initializeFromSchema(schema);

    let received: any = null;
    eventBus.on('field:change', (payload) => { received = payload; });

    model.setValue('f1', 'name', 'Pedro');
    expect(received).not.toBeNull();
    expect(received.fieldId).toBe('f1');
    expect(received.value).toBe('Pedro');
    expect(received.previousValue).toBe('Juan');
  });

  it('tracks dirty state', () => {
    const model = new DataModel({ name: 'Juan' }, bus);
    model.initializeFromSchema(schema);
    expect(model.isDirty()).toBe(false);

    model.setValue('f1', 'name', 'Pedro');
    expect(model.isDirty()).toBe(true);
  });

  it('resets to initial data', () => {
    const model = new DataModel({ name: 'Juan' }, bus);
    model.initializeFromSchema(schema);
    model.setValue('f1', 'name', 'Pedro');

    model.reset();
    expect(model.getValue('name')).toBe('Juan');
  });
});
