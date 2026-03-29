// @zentto/studio-core — Rule engine for conditional logic
// Evaluates rules and applies show/hide/enable/disable/setValue actions

import type { Rule, RuleAction, StudioBindingContext } from '../types.js';
import { evaluateCondition, evaluateExpression } from './expression.js';
import { DataModel } from './data-binding.js';

export interface RuleResult {
  fieldVisibility: Map<string, boolean>;
  fieldEnabled: Map<string, boolean>;
  fieldRequired: Map<string, boolean>;
  fieldValues: Map<string, unknown>;
  fieldStyles: Map<string, Record<string, string>>;
}

/**
 * Evaluate all rules against the current form state.
 * Returns accumulated effects (visibility, enabled, values, styles).
 */
export function evaluateRules(
  rules: Rule[],
  context: StudioBindingContext,
): RuleResult {
  const result: RuleResult = {
    fieldVisibility: new Map(),
    fieldEnabled: new Map(),
    fieldRequired: new Map(),
    fieldValues: new Map(),
    fieldStyles: new Map(),
  };

  // Sort by priority (higher first)
  const sorted = [...rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const rule of sorted) {
    const conditionMet = evaluateCondition(rule.condition, context);
    if (!conditionMet) continue;

    for (const action of rule.actions) {
      applyRuleAction(action, context, result);
    }
  }

  return result;
}

function applyRuleAction(
  action: RuleAction,
  context: StudioBindingContext,
  result: RuleResult,
): void {
  switch (action.type) {
    case 'show':
      result.fieldVisibility.set(action.target, true);
      break;
    case 'hide':
      result.fieldVisibility.set(action.target, false);
      break;
    case 'enable':
      result.fieldEnabled.set(action.target, true);
      break;
    case 'disable':
      result.fieldEnabled.set(action.target, false);
      break;
    case 'setRequired':
      result.fieldRequired.set(action.target, action.value !== false);
      break;
    case 'setValue':
      if (typeof action.value === 'string' && action.value.includes('{')) {
        // Value contains expression — evaluate it
        try {
          const computed = evaluateExpression(action.value as string, context);
          result.fieldValues.set(action.target, computed);
        } catch {
          result.fieldValues.set(action.target, action.value);
        }
      } else {
        result.fieldValues.set(action.target, action.value);
      }
      break;
    case 'setStyle':
      if (action.value && typeof action.value === 'object') {
        result.fieldStyles.set(action.target, action.value as Record<string, string>);
      }
      break;
    case 'validate':
      // Triggers validation — handled by the validation engine
      break;
  }
}

/**
 * Apply rule results to the DataModel.
 * Updates field states (visibility, enabled, values).
 */
export function applyRulesToModel(
  ruleResult: RuleResult,
  model: DataModel,
  fieldMap: Map<string, { id: string; field: string }>,
): void {
  for (const [fieldId, visible] of ruleResult.fieldVisibility) {
    model.updateFieldState(fieldId, { visible });
  }

  for (const [fieldId, enabled] of ruleResult.fieldEnabled) {
    model.updateFieldState(fieldId, { enabled });
  }

  for (const [fieldId, required] of ruleResult.fieldRequired) {
    model.updateFieldState(fieldId, { required });
  }

  for (const [fieldId, value] of ruleResult.fieldValues) {
    const fieldInfo = fieldMap.get(fieldId);
    if (fieldInfo) {
      model.setValue(fieldId, fieldInfo.field, value);
    }
  }
}
