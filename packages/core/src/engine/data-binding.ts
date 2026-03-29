// @zentto/studio-core — Two-way data binding engine
// Uses Proxy for change detection, emits events on mutations

import type { FieldConfig, FieldState, FormState, StudioSchema } from '../types.js';
import { EventBus } from '../events/event-bus.js';

/**
 * Resolve a deep path in an object using dot notation.
 * Supports array notation: "items[0].name"
 */
export function getDeepValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    const arrMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrMatch) {
      const arr = (current as Record<string, unknown>)[arrMatch[1]];
      if (!Array.isArray(arr)) return undefined;
      current = arr[parseInt(arrMatch[2], 10)];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }
  return current;
}

/**
 * Set a deep value in an object using dot notation.
 * Creates intermediate objects/arrays as needed.
 */
export function setDeepValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const arrMatch = part.match(/^(\w+)\[(\d+)\]$/);

    if (arrMatch) {
      const key = arrMatch[1];
      const idx = parseInt(arrMatch[2], 10);
      if (!Array.isArray(current[key])) current[key] = [];
      const arr = current[key] as unknown[];
      while (arr.length <= idx) arr.push({});
      current = arr[idx] as Record<string, unknown>;
    } else {
      if (current[part] == null || typeof current[part] !== 'object') {
        // Peek ahead to determine if next part needs array or object
        const next = parts[i + 1];
        current[part] = next && /^\d+$/.test(next) ? [] : {};
      }
      current = current[part] as Record<string, unknown>;
    }
  }

  const lastPart = parts[parts.length - 1];
  const lastArrMatch = lastPart.match(/^(\w+)\[(\d+)\]$/);
  if (lastArrMatch) {
    const key = lastArrMatch[1];
    const idx = parseInt(lastArrMatch[2], 10);
    if (!Array.isArray(current[key])) current[key] = [];
    (current[key] as unknown[])[idx] = value;
  } else {
    current[lastPart] = value;
  }
}

// ─── Data Model ────────────────────────────────────────────────────

export class DataModel {
  private data: Record<string, unknown>;
  private fieldStates: Map<string, FieldState>;
  private eventBus: EventBus;
  private initialData: Record<string, unknown>;

  constructor(initialData: Record<string, unknown>, eventBus: EventBus) {
    this.initialData = structuredClone(initialData);
    this.data = structuredClone(initialData);
    this.fieldStates = new Map();
    this.eventBus = eventBus;
  }

  /** Get form data (shallow copy) */
  getData(): Record<string, unknown> {
    return { ...this.data };
  }

  /** Get the raw data reference (for expression context) */
  getRawData(): Record<string, unknown> {
    return this.data;
  }

  /** Get a single field value */
  getValue(path: string): unknown {
    return getDeepValue(this.data, path);
  }

  /** Set a field value and emit change event */
  setValue(fieldId: string, path: string, value: unknown): void {
    const previousValue = getDeepValue(this.data, path);
    if (previousValue === value) return; // no-op

    setDeepValue(this.data, path, value);

    // Update field state
    const state = this.getFieldState(fieldId);
    state.value = value;
    state.dirty = true;
    state.touched = true;
    this.fieldStates.set(fieldId, state);

    this.eventBus.emit('field:change', { fieldId, field: path, value, previousValue });
  }

  /** Initialize field states from schema */
  initializeFromSchema(schema: StudioSchema): void {
    for (const section of schema.sections) {
      for (const field of section.fields) {
        const value = getDeepValue(this.data, field.field);
        const defaultVal = value !== undefined ? value : field.defaultValue;

        if (defaultVal !== undefined && value === undefined) {
          setDeepValue(this.data, field.field, defaultVal);
        }

        this.fieldStates.set(field.id, {
          value: defaultVal ?? null,
          errors: [],
          touched: false,
          dirty: false,
          visible: !field.hidden,
          enabled: !field.disabled,
          required: field.required ?? false,
          readOnly: field.readOnly ?? false,
        });
      }
    }
  }

  /** Get field state (creates default if not exists) */
  getFieldState(fieldId: string): FieldState {
    if (!this.fieldStates.has(fieldId)) {
      this.fieldStates.set(fieldId, {
        value: null, errors: [], touched: false, dirty: false,
        visible: true, enabled: true, required: false, readOnly: false,
      });
    }
    return { ...this.fieldStates.get(fieldId)! };
  }

  /** Update field state properties */
  updateFieldState(fieldId: string, updates: Partial<FieldState>): void {
    const current = this.getFieldState(fieldId);
    this.fieldStates.set(fieldId, { ...current, ...updates });
  }

  /** Set validation errors for a field */
  setFieldErrors(fieldId: string, errors: string[]): void {
    this.updateFieldState(fieldId, { errors });
    this.eventBus.emit('field:validate', { fieldId, errors });
  }

  /** Check if form is dirty */
  isDirty(): boolean {
    for (const [, state] of this.fieldStates) {
      if (state.dirty) return true;
    }
    return false;
  }

  /** Check if form is valid (no errors on any field) */
  isValid(): boolean {
    for (const [, state] of this.fieldStates) {
      if (state.errors.length > 0) return true;
    }
    return false;
  }

  /** Reset form to initial data */
  reset(): void {
    this.data = structuredClone(this.initialData);
    for (const [id] of this.fieldStates) {
      const value = getDeepValue(this.data, id);
      this.fieldStates.set(id, {
        value: value ?? null, errors: [], touched: false, dirty: false,
        visible: true, enabled: true, required: false, readOnly: false,
      });
    }
    this.eventBus.emit('form:reset', {});
  }

  /** Get form state summary */
  getFormState(): FormState {
    return {
      data: this.getData(),
      fields: new Map(this.fieldStates),
      isValid: this.isValid(),
      isDirty: this.isDirty(),
      isSubmitting: false,
      activeSection: 0,
    };
  }

  /** Bulk update data (e.g., from API response) */
  setData(data: Record<string, unknown>): void {
    this.data = structuredClone(data);
    for (const [id, state] of this.fieldStates) {
      const value = getDeepValue(this.data, id);
      if (value !== undefined) {
        state.value = value;
      }
    }
  }
}
