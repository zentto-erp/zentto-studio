// @zentto/studio-core — Schema persistence (localStorage + remote sync)

import type { StudioSchema } from '../types.js';

const LS_PREFIX = 'zentto-studio-schema:';

// ─── Local Storage ────────────────────────────────────────────────

/** Save schema to localStorage */
export function saveSchemaLocal(schemaId: string, schema: StudioSchema): void {
  try {
    const data = JSON.stringify({
      schema,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(LS_PREFIX + schemaId, data);
  } catch { /* quota exceeded or SSR */ }
}

/** Load schema from localStorage */
export function loadSchemaLocal(schemaId: string): { schema: StudioSchema; updatedAt: string } | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + schemaId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

/** Delete schema from localStorage */
export function deleteSchemaLocal(schemaId: string): void {
  try {
    localStorage.removeItem(LS_PREFIX + schemaId);
  } catch { /* SSR */ }
}

/** List all schema IDs in localStorage */
export function listSchemasLocal(): string[] {
  try {
    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LS_PREFIX)) {
        ids.push(key.slice(LS_PREFIX.length));
      }
    }
    return ids;
  } catch { return []; }
}

// ─── Remote Storage (@zentto/cache) ──────────────────────────────

export interface RemoteStoreConfig {
  baseUrl: string;          // e.g., 'https://cache.zentto.net/v1'
  companyId: string;
  userId?: string;
  email?: string;
  appKey?: string;          // X-App-Key header
}

/** Save schema to remote cache */
export async function saveSchemaRemote(
  config: RemoteStoreConfig,
  schemaId: string,
  schema: StudioSchema,
): Promise<boolean> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.appKey) headers['X-App-Key'] = config.appKey;

    const response = await fetch(`${config.baseUrl}/studio-schemas/${schemaId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        companyId: config.companyId,
        userId: config.userId,
        email: config.email,
        schemaId,
        layout: schema,
      }),
    });
    return response.ok;
  } catch { return false; }
}

/** Load schema from remote cache */
export async function loadSchemaRemote(
  config: RemoteStoreConfig,
  schemaId: string,
): Promise<StudioSchema | null> {
  try {
    const params = new URLSearchParams({ companyId: config.companyId });
    if (config.userId) params.set('userId', config.userId);
    if (config.email) params.set('email', config.email);

    const headers: Record<string, string> = {};
    if (config.appKey) headers['X-App-Key'] = config.appKey;

    const response = await fetch(
      `${config.baseUrl}/studio-schemas/${schemaId}?${params}`,
      { headers },
    );
    if (!response.ok) return null;

    const data = await response.json();
    return data.layout ?? data.schema ?? null;
  } catch { return null; }
}

/** List schemas from remote cache */
export async function listSchemasRemote(
  config: RemoteStoreConfig,
): Promise<string[]> {
  try {
    const params = new URLSearchParams({ companyId: config.companyId });
    if (config.userId) params.set('userId', config.userId);
    if (config.email) params.set('email', config.email);

    const headers: Record<string, string> = {};
    if (config.appKey) headers['X-App-Key'] = config.appKey;

    const response = await fetch(
      `${config.baseUrl}/studio-schemas?${params}`,
      { headers },
    );
    if (!response.ok) return [];

    const data = await response.json();
    return data.schemaIds ?? data.ids ?? [];
  } catch { return []; }
}

// ─── Sync Strategy ────────────────────────────────────────────────

/**
 * Load schema with fallback: remote → local → null.
 * Saves to localStorage if fetched from remote.
 */
export async function loadSchemaWithSync(
  config: RemoteStoreConfig | null,
  schemaId: string,
): Promise<StudioSchema | null> {
  // Try remote first
  if (config) {
    const remote = await loadSchemaRemote(config, schemaId);
    if (remote) {
      saveSchemaLocal(schemaId, remote);
      return remote;
    }
  }

  // Fallback to local
  const local = loadSchemaLocal(schemaId);
  return local?.schema ?? null;
}

/**
 * Save schema to both local and remote.
 */
export async function saveSchemaWithSync(
  config: RemoteStoreConfig | null,
  schemaId: string,
  schema: StudioSchema,
): Promise<void> {
  saveSchemaLocal(schemaId, schema);
  if (config) {
    await saveSchemaRemote(config, schemaId, schema);
  }
}
