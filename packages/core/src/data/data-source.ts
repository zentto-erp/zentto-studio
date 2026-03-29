// @zentto/studio-core — Data source fetch engine
// Fetches data from REST/GraphQL/static sources with dependency resolution

import type { DataSourceConfig, StudioBindingContext } from '../types.js';
import { EventBus } from '../events/event-bus.js';

export interface FetchedDataSources {
  [sourceId: string]: unknown;
}

/**
 * Fetch all data sources in dependency order.
 * Sources with dependsOn wait for their dependencies first.
 */
export async function fetchAllDataSources(
  sources: DataSourceConfig[],
  context: StudioBindingContext,
  eventBus: EventBus,
  headers?: Record<string, string>,
): Promise<FetchedDataSources> {
  const result: FetchedDataSources = {};
  const resolved = new Set<string>();

  // Separate static from fetchable
  for (const src of sources) {
    if (src.type === 'static') {
      result[src.id] = src.staticData ?? null;
      resolved.add(src.id);
    }
  }

  // Resolve in dependency order
  const pending = sources.filter(s => s.type !== 'static' && s.autoFetch !== false);
  let maxIterations = pending.length + 1;

  while (pending.length > 0 && maxIterations > 0) {
    maxIterations--;
    const ready = pending.filter(s => {
      if (!s.dependsOn || s.dependsOn.length === 0) return true;
      return s.dependsOn.every(dep => resolved.has(dep));
    });

    if (ready.length === 0 && pending.length > 0) {
      // Circular dependency or unresolvable — fetch remaining anyway
      ready.push(...pending);
    }

    const fetches = ready.map(async (src) => {
      try {
        eventBus.emit('datasource:loading', { sourceId: src.id });
        const data = await fetchSingleSource(src, context, result, headers);

        // Apply transform expression
        if (src.transform && data != null) {
          const { evaluateExpression } = await import('../engine/expression.js');
          const transformCtx: StudioBindingContext = {
            ...context,
            dataSources: { ...result, __response: data },
          };
          const transformed = evaluateExpression(src.transform, transformCtx);
          result[src.id] = transformed;
        } else {
          result[src.id] = data;
        }

        resolved.add(src.id);
        eventBus.emit('datasource:loaded', { sourceId: src.id, data: result[src.id] });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        eventBus.emit('datasource:error', { sourceId: src.id, error });
        result[src.id] = null;
        resolved.add(src.id);
      }
    });

    await Promise.all(fetches);

    // Remove resolved from pending
    for (const s of ready) {
      const idx = pending.indexOf(s);
      if (idx >= 0) pending.splice(idx, 1);
    }
  }

  return result;
}

async function fetchSingleSource(
  src: DataSourceConfig,
  context: StudioBindingContext,
  existingData: FetchedDataSources,
  extraHeaders?: Record<string, string>,
): Promise<unknown> {
  if (src.type === 'computed') {
    if (!src.transform) return null;
    const { evaluateExpression } = await import('../engine/expression.js');
    return evaluateExpression(src.transform, { ...context, dataSources: existingData });
  }

  if (!src.url) return null;

  // Resolve URL template parameters
  let url = src.url;
  url = url.replace(/\{(\w[\w.]*)\}/g, (_, path) => {
    const parts = path.split('.');
    let val: unknown = context.formData;
    for (const p of parts) {
      if (val == null || typeof val !== 'object') return '';
      val = (val as Record<string, unknown>)[p];
    }
    return encodeURIComponent(String(val ?? ''));
  });

  const method = src.method ?? 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
    ...src.headers,
  };

  const options: RequestInit = { method, headers };
  if (method !== 'GET' && src.body) {
    options.body = JSON.stringify(src.body);
  }

  if (src.type === 'graphql' && src.body) {
    options.method = 'POST';
    options.body = JSON.stringify(src.body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json')
    ? response.json()
    : response.text();
}

/**
 * Set up polling for data sources with refreshInterval.
 * Returns a cleanup function to stop all intervals.
 */
export function setupPolling(
  sources: DataSourceConfig[],
  context: StudioBindingContext,
  eventBus: EventBus,
  onUpdate: (data: FetchedDataSources) => void,
): () => void {
  const intervals: ReturnType<typeof setInterval>[] = [];

  for (const src of sources) {
    if (src.refreshInterval && src.refreshInterval > 0) {
      const interval = setInterval(async () => {
        try {
          eventBus.emit('datasource:loading', { sourceId: src.id });
          const data = await fetchSingleSource(src, context, {});
          onUpdate({ [src.id]: data });
          eventBus.emit('datasource:loaded', { sourceId: src.id, data });
        } catch (err) {
          eventBus.emit('datasource:error', {
            sourceId: src.id,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      }, src.refreshInterval);
      intervals.push(interval);
    }
  }

  return () => intervals.forEach(clearInterval);
}
