// @zentto/studio-core — Action execution engine
// Handles form submissions, API calls, navigation, and custom events

import type { ActionConfig, StudioBindingContext } from '../types.js';
import { evaluateCondition, evaluateExpression } from './expression.js';
import { EventBus } from '../events/event-bus.js';

export interface ActionExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Check if an action is enabled (evaluates disabledRule if present).
 */
export function isActionEnabled(action: ActionConfig, context: StudioBindingContext): boolean {
  if (action.disabled) return false;
  if (action.disabledRule) {
    return !evaluateCondition(action.disabledRule, context);
  }
  return true;
}

/**
 * Execute an action.
 * For 'submit' and 'apiCall', makes HTTP requests.
 * For 'navigate' and 'custom', emits events for the host app.
 */
export async function executeAction(
  action: ActionConfig,
  formData: Record<string, unknown>,
  context: StudioBindingContext,
  eventBus: EventBus,
): Promise<ActionExecutionResult> {
  eventBus.emit('action:execute', {
    actionId: action.id,
    type: action.type,
    data: formData,
  });

  try {
    let result: ActionExecutionResult;

    switch (action.type) {
      case 'submit':
      case 'apiCall':
        result = await executeHttpAction(action, formData, context);
        break;

      case 'navigate':
        result = { success: true, data: { navigateTo: action.navigateTo } };
        break;

      case 'reset':
        result = { success: true };
        eventBus.emit('form:reset', {});
        break;

      case 'print':
        result = { success: true };
        break;

      case 'openModal':
        result = { success: true, data: { schemaId: action.schemaId } };
        break;

      case 'custom':
        result = { success: true, data: { eventName: action.eventName, formData } };
        break;

      default:
        result = { success: false, error: `Tipo de accion desconocido: ${action.type}` };
    }

    if (result.success) {
      eventBus.emit('action:success', { actionId: action.id, response: result.data });
    } else {
      eventBus.emit('action:error', { actionId: action.id, error: new Error(result.error ?? 'Error desconocido') });
    }

    return result;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    eventBus.emit('action:error', { actionId: action.id, error });
    return { success: false, error: error.message };
  }
}

async function executeHttpAction(
  action: ActionConfig,
  formData: Record<string, unknown>,
  context: StudioBindingContext,
): Promise<ActionExecutionResult> {
  if (!action.url) {
    return { success: false, error: 'URL no especificada para la accion' };
  }

  // Resolve URL template: replace {field} references
  let url = action.url;
  const fieldRefRegex = /\{(\w[\w.]*)\}/g;
  url = url.replace(fieldRefRegex, (_, path) => {
    const val = evaluateExpression(`{${path}}`, context);
    return encodeURIComponent(String(val ?? ''));
  });

  const method = (action.method ?? 'POST').toUpperCase();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...action.headers,
  };

  const fetchOptions: RequestInit = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(formData);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    return { success: false, error: `HTTP ${response.status}: ${errorText}` };
  }

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  return { success: true, data };
}
