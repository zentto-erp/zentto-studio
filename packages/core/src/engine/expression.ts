// @zentto/studio-core — Expression engine
// Fork of @zentto/report-core expression engine, adapted for form/UI context
// Complete formula language with recursive descent parser

import type { StudioBindingContext } from '../types.js';

// ─── Token Types ───────────────────────────────────────────────────

enum TokenType {
  Number, String, Boolean, Null,
  Identifier, FieldRef,
  LParen, RParen, Comma,
  Plus, Minus, Star, Slash, Percent, Caret, Ampersand,
  Eq, Neq, Lt, Gt, Lte, Gte,
  And, Or, Not,
  EOF,
}

interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

// ─── Lexer ─────────────────────────────────────────────────────────

class Lexer {
  private tokens: Token[] = [];

  constructor(private input: string) {
    this.tokenize();
  }

  private tokenize(): void {
    const src = this.input;
    let i = 0;

    while (i < src.length) {
      if (/\s/.test(src[i])) { i++; continue; }

      // Field reference: {field} or {ds.field}
      if (src[i] === '{') {
        const start = i;
        i++;
        let ref = '';
        while (i < src.length && src[i] !== '}') { ref += src[i]; i++; }
        if (i < src.length) i++;
        this.tokens.push({ type: TokenType.FieldRef, value: ref, pos: start });
        continue;
      }

      // String literal
      if (src[i] === '"' || src[i] === "'") {
        const quote = src[i];
        const start = i;
        i++;
        let str = '';
        while (i < src.length && src[i] !== quote) {
          if (src[i] === '\\' && i + 1 < src.length) {
            i++;
            if (src[i] === 'n') str += '\n';
            else if (src[i] === 't') str += '\t';
            else if (src[i] === '\\') str += '\\';
            else if (src[i] === quote) str += quote;
            else str += src[i];
          } else {
            str += src[i];
          }
          i++;
        }
        if (i < src.length) i++;
        this.tokens.push({ type: TokenType.String, value: str, pos: start });
        continue;
      }

      // Number literal
      if (/\d/.test(src[i]) || (src[i] === '.' && i + 1 < src.length && /\d/.test(src[i + 1]))) {
        const start = i;
        let num = '';
        while (i < src.length && /[\d.]/.test(src[i])) { num += src[i]; i++; }
        this.tokens.push({ type: TokenType.Number, value: num, pos: start });
        continue;
      }

      // Two-character operators
      if (i + 1 < src.length) {
        const two = src[i] + src[i + 1];
        if (two === '==') { this.tokens.push({ type: TokenType.Eq, value: '==', pos: i }); i += 2; continue; }
        if (two === '!=') { this.tokens.push({ type: TokenType.Neq, value: '!=', pos: i }); i += 2; continue; }
        if (two === '<=') { this.tokens.push({ type: TokenType.Lte, value: '<=', pos: i }); i += 2; continue; }
        if (two === '>=') { this.tokens.push({ type: TokenType.Gte, value: '>=', pos: i }); i += 2; continue; }
        if (two === '<>') { this.tokens.push({ type: TokenType.Neq, value: '<>', pos: i }); i += 2; continue; }
      }

      // Single-character operators
      const ch = src[i];
      const singles: Record<string, TokenType> = {
        '(': TokenType.LParen, ')': TokenType.RParen, ',': TokenType.Comma,
        '+': TokenType.Plus, '-': TokenType.Minus, '*': TokenType.Star,
        '/': TokenType.Slash, '%': TokenType.Percent, '^': TokenType.Caret,
        '&': TokenType.Ampersand, '<': TokenType.Lt, '>': TokenType.Gt,
        '=': TokenType.Eq, '!': TokenType.Not,
      };
      if (ch in singles) {
        this.tokens.push({ type: singles[ch], value: ch, pos: i });
        i++;
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(ch)) {
        const start = i;
        let id = '';
        while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) { id += src[i]; i++; }
        const upper = id.toUpperCase();
        if (upper === 'TRUE') { this.tokens.push({ type: TokenType.Boolean, value: 'true', pos: start }); continue; }
        if (upper === 'FALSE') { this.tokens.push({ type: TokenType.Boolean, value: 'false', pos: start }); continue; }
        if (upper === 'NULL' || upper === 'NIL') { this.tokens.push({ type: TokenType.Null, value: 'null', pos: start }); continue; }
        if (upper === 'AND') { this.tokens.push({ type: TokenType.And, value: 'AND', pos: start }); continue; }
        if (upper === 'OR') { this.tokens.push({ type: TokenType.Or, value: 'OR', pos: start }); continue; }
        if (upper === 'NOT') { this.tokens.push({ type: TokenType.Not, value: 'NOT', pos: start }); continue; }
        this.tokens.push({ type: TokenType.Identifier, value: id, pos: start });
        continue;
      }

      i++; // skip unknown
    }

    this.tokens.push({ type: TokenType.EOF, value: '', pos: i });
  }

  getTokens(): Token[] { return this.tokens; }
}

// ─── AST Node Types ────────────────────────────────────────────────

type ASTNode =
  | { kind: 'number'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'null' }
  | { kind: 'fieldRef'; ref: string }
  | { kind: 'identifier'; name: string }
  | { kind: 'unary'; op: string; operand: ASTNode }
  | { kind: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { kind: 'call'; name: string; args: ASTNode[] };

// ─── Parser ────────────────────────────────────────────────────────

class Parser {
  private pos = 0;
  private tokens: Token[];

  constructor(tokens: Token[]) { this.tokens = tokens; }

  parse(): ASTNode {
    const result = this.parseOr();
    if (this.peek().type !== TokenType.EOF) {
      throw new ExprError(`Token inesperado: "${this.peek().value}" en posicion ${this.peek().pos}`);
    }
    return result;
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: TokenType.EOF, value: '', pos: -1 };
  }

  private advance(): Token { return this.tokens[this.pos++]; }

  private expect(type: TokenType): Token {
    const t = this.peek();
    if (t.type !== type) {
      throw new ExprError(`Se esperaba ${TokenType[type]}, se encontro "${t.value}" en posicion ${t.pos}`);
    }
    return this.advance();
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();
    while (this.peek().type === TokenType.Or) {
      this.advance();
      left = { kind: 'binary', op: 'OR', left, right: this.parseAnd() };
    }
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseNot();
    while (this.peek().type === TokenType.And) {
      this.advance();
      left = { kind: 'binary', op: 'AND', left, right: this.parseNot() };
    }
    return left;
  }

  private parseNot(): ASTNode {
    if (this.peek().type === TokenType.Not) {
      this.advance();
      return { kind: 'unary', op: 'NOT', operand: this.parseNot() };
    }
    return this.parseComparison();
  }

  private parseComparison(): ASTNode {
    let left = this.parseConcatenation();
    const compOps = [TokenType.Eq, TokenType.Neq, TokenType.Lt, TokenType.Gt, TokenType.Lte, TokenType.Gte];
    while (compOps.includes(this.peek().type)) {
      const op = this.advance().value;
      left = { kind: 'binary', op, left, right: this.parseConcatenation() };
    }
    return left;
  }

  private parseConcatenation(): ASTNode {
    let left = this.parseAddSub();
    while (this.peek().type === TokenType.Ampersand) {
      this.advance();
      left = { kind: 'binary', op: '&', left, right: this.parseAddSub() };
    }
    return left;
  }

  private parseAddSub(): ASTNode {
    let left = this.parseMulDiv();
    while (this.peek().type === TokenType.Plus || this.peek().type === TokenType.Minus) {
      const op = this.advance().value;
      left = { kind: 'binary', op, left, right: this.parseMulDiv() };
    }
    return left;
  }

  private parseMulDiv(): ASTNode {
    let left = this.parsePower();
    while (this.peek().type === TokenType.Star || this.peek().type === TokenType.Slash || this.peek().type === TokenType.Percent) {
      const op = this.advance().value;
      left = { kind: 'binary', op, left, right: this.parsePower() };
    }
    return left;
  }

  private parsePower(): ASTNode {
    let left = this.parseUnary();
    while (this.peek().type === TokenType.Caret) {
      this.advance();
      left = { kind: 'binary', op: '^', left, right: this.parseUnary() };
    }
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.peek().type === TokenType.Minus) {
      this.advance();
      return { kind: 'unary', op: '-', operand: this.parseUnary() };
    }
    if (this.peek().type === TokenType.Plus) {
      this.advance();
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const t = this.peek();

    if (t.type === TokenType.Number) { this.advance(); return { kind: 'number', value: parseFloat(t.value) }; }
    if (t.type === TokenType.String) { this.advance(); return { kind: 'string', value: t.value }; }
    if (t.type === TokenType.Boolean) { this.advance(); return { kind: 'boolean', value: t.value === 'true' }; }
    if (t.type === TokenType.Null) { this.advance(); return { kind: 'null' }; }
    if (t.type === TokenType.FieldRef) { this.advance(); return { kind: 'fieldRef', ref: t.value }; }

    if (t.type === TokenType.Identifier) {
      this.advance();
      if (this.peek().type === TokenType.LParen) {
        this.advance();
        const args: ASTNode[] = [];
        if (this.peek().type !== TokenType.RParen) {
          args.push(this.parseOr());
          while (this.peek().type === TokenType.Comma) { this.advance(); args.push(this.parseOr()); }
        }
        this.expect(TokenType.RParen);
        return { kind: 'call', name: t.value.toUpperCase(), args };
      }
      return { kind: 'identifier', name: t.value };
    }

    if (t.type === TokenType.LParen) {
      this.advance();
      const expr = this.parseOr();
      this.expect(TokenType.RParen);
      return expr;
    }

    throw new ExprError(`Token inesperado: "${t.value}" en posicion ${t.pos}`);
  }
}

// ─── Error ─────────────────────────────────────────────────────────

export class ExprError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExprError';
  }
}

// ─── Type Coercion Helpers ─────────────────────────────────────────

function toNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') { const n = parseFloat(val); return isNaN(n) ? 0 : n; }
  if (typeof val === 'boolean') return val ? 1 : 0;
  return 0;
}

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (typeof val === 'string') {
    const lower = val.toLowerCase();
    return lower === 'true' || lower === 'yes' || lower === 'si' || lower === '1';
  }
  return val != null;
}

function toString(val: unknown): string {
  if (val == null) return '';
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

function toDate(val: unknown): Date | null {
  if (val instanceof Date) return val;
  if (typeof val === 'string') { const d = new Date(val); return isNaN(d.getTime()) ? null : d; }
  if (typeof val === 'number') return new Date(val);
  return null;
}

// ─── Deep Value Resolution ─────────────────────────────────────────

function resolveDeep(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    // Handle array notation: items[0]
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

// ─── Built-in Functions ────────────────────────────────────────────

type FnImpl = (args: unknown[], ctx: StudioBindingContext) => unknown;
const FUNCTIONS: Record<string, FnImpl> = {};

function registerFn(name: string, fn: FnImpl): void {
  FUNCTIONS[name.toUpperCase()] = fn;
}

// String functions
registerFn('LEFT', (args) => toString(args[0]).slice(0, toNumber(args[1])));
registerFn('RIGHT', (args) => { const s = toString(args[0]); const n = toNumber(args[1]); return s.slice(Math.max(0, s.length - n)); });
registerFn('MID', (args) => { const s = toString(args[0]); const start = toNumber(args[1]) - 1; const len = args.length > 2 ? toNumber(args[2]) : s.length - start; return s.slice(Math.max(0, start), start + len); });
registerFn('LEN', (args) => toString(args[0]).length);
registerFn('TRIM', (args) => toString(args[0]).trim());
registerFn('UPPER', (args) => toString(args[0]).toUpperCase());
registerFn('LOWER', (args) => toString(args[0]).toLowerCase());
registerFn('REPLACE', (args) => toString(args[0]).split(toString(args[1])).join(toString(args[2])));
registerFn('CONTAINS', (args) => toString(args[0]).toLowerCase().includes(toString(args[1]).toLowerCase()));
registerFn('STARTSWITH', (args) => toString(args[0]).toLowerCase().startsWith(toString(args[1]).toLowerCase()));
registerFn('ENDSWITH', (args) => toString(args[0]).toLowerCase().endsWith(toString(args[1]).toLowerCase()));
registerFn('CONCAT', (args) => args.map(toString).join(''));
registerFn('JOIN', (args) => { const delim = toString(args[0]); return args.slice(1).map(toString).join(delim); });

// Math functions
registerFn('ABS', (args) => Math.abs(toNumber(args[0])));
registerFn('ROUND', (args) => { const val = toNumber(args[0]); const dec = args.length > 1 ? toNumber(args[1]) : 0; const f = Math.pow(10, dec); return Math.round(val * f) / f; });
registerFn('FLOOR', (args) => Math.floor(toNumber(args[0])));
registerFn('CEIL', (args) => Math.ceil(toNumber(args[0])));
registerFn('MIN', (args) => Math.min(...args.map(toNumber)));
registerFn('MAX', (args) => Math.max(...args.map(toNumber)));
registerFn('SUM', (args) => args.reduce((acc: number, v) => acc + toNumber(v), 0));
registerFn('AVG', (args) => args.length === 0 ? 0 : args.reduce((acc: number, v) => acc + toNumber(v), 0) / args.length);
registerFn('SQRT', (args) => Math.sqrt(toNumber(args[0])));
registerFn('POW', (args) => Math.pow(toNumber(args[0]), toNumber(args[1])));

// Logic functions
registerFn('IF', (args) => toBool(args[0]) ? args[1] : (args.length > 2 ? args[2] : null));
registerFn('IIF', (args) => toBool(args[0]) ? args[1] : (args.length > 2 ? args[2] : null));
registerFn('SWITCH', (args) => {
  const val = args[0];
  for (let i = 1; i + 1 < args.length; i += 2) {
    if (val === args[i] || toString(val) === toString(args[i])) return args[i + 1];
  }
  return args.length % 2 === 0 ? args[args.length - 1] : null; // default case
});
registerFn('COALESCE', (args) => args.find(a => a != null && a !== '') ?? null);
registerFn('ISNULL', (args) => args[0] == null);
registerFn('ISEMPTY', (args) => { const v = args[0]; return v == null || v === '' || (Array.isArray(v) && v.length === 0); });
registerFn('NOT', (args) => !toBool(args[0]));

// Type conversion
registerFn('TONUMBER', (args) => toNumber(args[0]));
registerFn('TOTEXT', (args) => toString(args[0]));
registerFn('TOBOOLEAN', (args) => toBool(args[0]));
registerFn('TODATE', (args) => { const d = toDate(args[0]); return d ? d.toISOString() : null; });

// Date functions
registerFn('NOW', () => new Date().toISOString());
registerFn('TODAY', () => new Date().toISOString().slice(0, 10));
registerFn('YEAR', (args) => { const d = toDate(args[0]); return d ? d.getFullYear() : 0; });
registerFn('MONTH', (args) => { const d = toDate(args[0]); return d ? d.getMonth() + 1 : 0; });
registerFn('DAY', (args) => { const d = toDate(args[0]); return d ? d.getDate() : 0; });
registerFn('DATEADD', (args) => {
  const d = toDate(args[0]);
  if (!d) return null;
  const unit = toString(args[1]).toLowerCase();
  const amount = toNumber(args[2]);
  const result = new Date(d);
  if (unit === 'day' || unit === 'days') result.setDate(result.getDate() + amount);
  else if (unit === 'month' || unit === 'months') result.setMonth(result.getMonth() + amount);
  else if (unit === 'year' || unit === 'years') result.setFullYear(result.getFullYear() + amount);
  else if (unit === 'hour' || unit === 'hours') result.setHours(result.getHours() + amount);
  return result.toISOString();
});
registerFn('DATEDIFF', (args) => {
  const d1 = toDate(args[0]);
  const d2 = toDate(args[1]);
  if (!d1 || !d2) return 0;
  const unit = args.length > 2 ? toString(args[2]).toLowerCase() : 'days';
  const diffMs = d2.getTime() - d1.getTime();
  if (unit === 'day' || unit === 'days') return Math.floor(diffMs / 86400000);
  if (unit === 'hour' || unit === 'hours') return Math.floor(diffMs / 3600000);
  if (unit === 'minute' || unit === 'minutes') return Math.floor(diffMs / 60000);
  return diffMs;
});

// Studio-specific: form context functions
registerFn('FIELD', (args, ctx) => resolveDeep(ctx.formData, toString(args[0])));
registerFn('DATASOURCE', (args, ctx) => {
  const dsId = toString(args[0]);
  const path = args.length > 1 ? toString(args[1]) : '';
  const ds = ctx.dataSources[dsId];
  if (!path || !ds) return ds;
  if (typeof ds === 'object' && ds !== null) return resolveDeep(ds as Record<string, unknown>, path);
  return ds;
});
registerFn('ROLE_IS', (args, ctx) => {
  const role = toString(args[0]);
  return ctx.user?.roles?.includes(role) ?? false;
});
registerFn('HAS_ROLE', (args, ctx) => {
  const role = toString(args[0]);
  return ctx.user?.roles?.includes(role) ?? false;
});
registerFn('CHANGED', (args) => {
  // In runtime, this is resolved by the data-binding layer before reaching here
  // Default: true (field has been modified)
  return args[0] != null;
});

// ─── Evaluator ─────────────────────────────────────────────────────

function evaluate(node: ASTNode, ctx: StudioBindingContext): unknown {
  switch (node.kind) {
    case 'number': return node.value;
    case 'string': return node.value;
    case 'boolean': return node.value;
    case 'null': return null;

    case 'fieldRef': return resolveDeep(ctx.formData, node.ref);

    case 'identifier': {
      // Check formData first, then dataSources, then parameters
      const fromForm = resolveDeep(ctx.formData, node.name);
      if (fromForm !== undefined) return fromForm;
      if (ctx.parameters && node.name in ctx.parameters) return ctx.parameters[node.name];
      return undefined;
    }

    case 'unary': {
      const operand = evaluate(node.operand, ctx);
      if (node.op === '-') return -toNumber(operand);
      if (node.op === 'NOT') return !toBool(operand);
      return operand;
    }

    case 'binary': {
      const left = evaluate(node.left, ctx);
      const right = evaluate(node.right, ctx);

      switch (node.op) {
        case '+': return toNumber(left) + toNumber(right);
        case '-': return toNumber(left) - toNumber(right);
        case '*': return toNumber(left) * toNumber(right);
        case '/': { const d = toNumber(right); return d === 0 ? 0 : toNumber(left) / d; }
        case '%': { const d = toNumber(right); return d === 0 ? 0 : toNumber(left) % d; }
        case '^': return Math.pow(toNumber(left), toNumber(right));
        case '&': return toString(left) + toString(right);
        case '==': case '=': return left === right || toString(left) === toString(right);
        case '!=': case '<>': return left !== right && toString(left) !== toString(right);
        case '<': return toNumber(left) < toNumber(right);
        case '>': return toNumber(left) > toNumber(right);
        case '<=': return toNumber(left) <= toNumber(right);
        case '>=': return toNumber(left) >= toNumber(right);
        case 'AND': return toBool(left) && toBool(right);
        case 'OR': return toBool(left) || toBool(right);
        default: return null;
      }
    }

    case 'call': {
      const fn = FUNCTIONS[node.name];
      if (!fn) throw new ExprError(`Funcion desconocida: ${node.name}`);
      const args = node.args.map(a => evaluate(a, ctx));
      return fn(args, ctx);
    }
  }
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Evaluate an expression string against a StudioBindingContext.
 * Returns the computed value. Throws ExprError on syntax errors.
 *
 * @example
 * evaluateExpression('{precio} * {cantidad}', { formData: { precio: 10, cantidad: 5 } })
 * // → 50
 *
 * evaluateExpression('{role} == "admin" AND {total} > 1000', {
 *   formData: { role: 'admin', total: 1500 }
 * })
 * // → true
 */
export function evaluateExpression(
  expression: string,
  context: StudioBindingContext = { formData: {}, dataSources: {} },
): unknown {
  if (!expression || expression.trim() === '') return null;

  const lexer = new Lexer(expression);
  const parser = new Parser(lexer.getTokens());
  const ast = parser.parse();
  return evaluate(ast, context);
}

/**
 * Safe evaluation — returns { ok, value } or { ok, error }.
 * Never throws.
 */
export function safeEvaluateExpression(
  expression: string,
  context: StudioBindingContext = { formData: {}, dataSources: {} },
): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    const value = evaluateExpression(expression, context);
    return { ok: true, value };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Evaluate an expression and coerce to boolean.
 * Useful for visibility rules and conditions.
 */
export function evaluateCondition(expression: string, context: StudioBindingContext): boolean {
  const result = safeEvaluateExpression(expression, context);
  if (!result.ok) return false;
  return toBool(result.value);
}

/** Register a custom function for use in expressions */
export function registerFunction(name: string, fn: FnImpl): void {
  registerFn(name, fn);
}
