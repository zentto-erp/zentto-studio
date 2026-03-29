import { describe, it, expect } from 'vitest';
import { evaluateExpression, evaluateCondition, safeEvaluateExpression } from '../engine/expression.js';
import type { StudioBindingContext } from '../types.js';

const ctx = (formData: Record<string, unknown> = {}): StudioBindingContext => ({
  formData,
  dataSources: {},
});

describe('Expression Engine', () => {
  // ─── Arithmetic ──────────────────────────────────────────────
  describe('Arithmetic', () => {
    it('sums two numbers', () => {
      expect(evaluateExpression('2 + 3')).toBe(5);
    });

    it('evaluates complex arithmetic', () => {
      expect(evaluateExpression('(10 + 5) * 2 - 3')).toBe(27);
    });

    it('handles modulo', () => {
      expect(evaluateExpression('10 % 3')).toBe(1);
    });

    it('handles power', () => {
      expect(evaluateExpression('2 ^ 10')).toBe(1024);
    });

    it('handles division by zero', () => {
      expect(evaluateExpression('10 / 0')).toBe(0);
    });

    it('handles unary minus', () => {
      expect(evaluateExpression('-5 + 10')).toBe(5);
    });
  });

  // ─── String Operations ───────────────────────────────────────
  describe('Strings', () => {
    it('concatenates with &', () => {
      expect(evaluateExpression('"hello" & " " & "world"')).toBe('hello world');
    });

    it('evaluates string functions', () => {
      expect(evaluateExpression('UPPER("hello")')).toBe('HELLO');
      expect(evaluateExpression('LOWER("HELLO")')).toBe('hello');
      expect(evaluateExpression('LEN("hello")')).toBe(5);
      expect(evaluateExpression('TRIM("  hello  ")')).toBe('hello');
    });

    it('evaluates LEFT, RIGHT, MID', () => {
      expect(evaluateExpression('LEFT("abcdef", 3)')).toBe('abc');
      expect(evaluateExpression('RIGHT("abcdef", 3)')).toBe('def');
      expect(evaluateExpression('MID("abcdef", 2, 3)')).toBe('bcd');
    });

    it('evaluates CONTAINS', () => {
      expect(evaluateExpression('CONTAINS("Hello World", "world")')).toBe(true);
      expect(evaluateExpression('CONTAINS("Hello", "xyz")')).toBe(false);
    });
  });

  // ─── Comparisons ─────────────────────────────────────────────
  describe('Comparisons', () => {
    it('evaluates equality', () => {
      expect(evaluateExpression('5 == 5')).toBe(true);
      expect(evaluateExpression('5 == 6')).toBe(false);
      expect(evaluateExpression('"a" == "a"')).toBe(true);
    });

    it('evaluates inequality', () => {
      expect(evaluateExpression('5 != 6')).toBe(true);
      expect(evaluateExpression('5 <> 5')).toBe(false);
    });

    it('evaluates comparison operators', () => {
      expect(evaluateExpression('5 > 3')).toBe(true);
      expect(evaluateExpression('5 < 3')).toBe(false);
      expect(evaluateExpression('5 >= 5')).toBe(true);
      expect(evaluateExpression('5 <= 4')).toBe(false);
    });
  });

  // ─── Boolean Logic ───────────────────────────────────────────
  describe('Logic', () => {
    it('evaluates AND/OR', () => {
      expect(evaluateExpression('true AND true')).toBe(true);
      expect(evaluateExpression('true AND false')).toBe(false);
      expect(evaluateExpression('false OR true')).toBe(true);
      expect(evaluateExpression('false OR false')).toBe(false);
    });

    it('evaluates NOT', () => {
      expect(evaluateExpression('NOT true')).toBe(false);
      expect(evaluateExpression('NOT false')).toBe(true);
    });

    it('evaluates IF', () => {
      expect(evaluateExpression('IF(true, "yes", "no")')).toBe('yes');
      expect(evaluateExpression('IF(false, "yes", "no")')).toBe('no');
    });

    it('evaluates COALESCE', () => {
      expect(evaluateExpression('COALESCE(null, "", "hello")')).toBe('hello');
    });
  });

  // ─── Field References ────────────────────────────────────────
  describe('Field References', () => {
    it('resolves field values', () => {
      expect(evaluateExpression('{precio} * {cantidad}', ctx({ precio: 10, cantidad: 5 }))).toBe(50);
    });

    it('resolves nested fields', () => {
      expect(evaluateExpression('{customer.name}', ctx({
        customer: { name: 'Juan' },
      }))).toBe('Juan');
    });

    it('returns undefined for missing fields', () => {
      expect(evaluateExpression('{missing}', ctx({}))).toBeUndefined();
    });
  });

  // ─── Conditions ──────────────────────────────────────────────
  describe('evaluateCondition', () => {
    it('returns true for truthy expressions', () => {
      expect(evaluateCondition('{role} == "admin"', { formData: { role: 'admin' }, dataSources: {} })).toBe(true);
    });

    it('returns false for falsy expressions', () => {
      expect(evaluateCondition('{total} > 1000', { formData: { total: 500 }, dataSources: {} })).toBe(false);
    });

    it('returns false on error', () => {
      expect(evaluateCondition('invalid syntax !!!', { formData: {}, dataSources: {} })).toBe(false);
    });
  });

  // ─── Math Functions ──────────────────────────────────────────
  describe('Math Functions', () => {
    it('evaluates basic math', () => {
      expect(evaluateExpression('ABS(-5)')).toBe(5);
      expect(evaluateExpression('ROUND(3.456, 2)')).toBe(3.46);
      expect(evaluateExpression('FLOOR(3.7)')).toBe(3);
      expect(evaluateExpression('CEIL(3.2)')).toBe(4);
    });

    it('evaluates SUM/AVG/MIN/MAX', () => {
      expect(evaluateExpression('SUM(1, 2, 3, 4)')).toBe(10);
      expect(evaluateExpression('AVG(10, 20)')).toBe(15);
      expect(evaluateExpression('MIN(5, 3, 8)')).toBe(3);
      expect(evaluateExpression('MAX(5, 3, 8)')).toBe(8);
    });
  });

  // ─── Date Functions ──────────────────────────────────────────
  describe('Date Functions', () => {
    it('evaluates YEAR/MONTH/DAY', () => {
      // Use ISO datetime to avoid timezone shifts
      expect(evaluateExpression('YEAR("2026-03-15T12:00:00Z")')).toBe(2026);
      expect(evaluateExpression('MONTH("2026-03-15T12:00:00Z")')).toBe(3);
      expect(evaluateExpression('DAY("2026-03-15T12:00:00Z")')).toBe(15);
    });

    it('evaluates DATEDIFF', () => {
      const result = evaluateExpression('DATEDIFF("2026-01-01", "2026-01-11", "days")');
      expect(result).toBe(10);
    });
  });

  // ─── Studio-specific Functions ───────────────────────────────
  describe('Studio Functions', () => {
    it('evaluates FIELD()', () => {
      expect(evaluateExpression('FIELD("name")', ctx({ name: 'Zentto' }))).toBe('Zentto');
    });

    it('evaluates ROLE_IS()', () => {
      expect(evaluateExpression('ROLE_IS("admin")', {
        formData: {}, dataSources: {},
        user: { roles: ['admin', 'user'] },
      })).toBe(true);
    });

    it('evaluates ISEMPTY()', () => {
      expect(evaluateExpression('ISEMPTY("")')).toBe(true);
      expect(evaluateExpression('ISEMPTY("hello")')).toBe(false);
      expect(evaluateExpression('ISEMPTY(null)')).toBe(true);
    });
  });

  // ─── Safe Evaluation ─────────────────────────────────────────
  describe('Safe Evaluation', () => {
    it('returns ok:true on success', () => {
      const result = safeEvaluateExpression('1 + 1');
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(2);
    });

    it('returns ok:false on error', () => {
      const result = safeEvaluateExpression('((((');
      expect(result.ok).toBe(false);
    });
  });
});
