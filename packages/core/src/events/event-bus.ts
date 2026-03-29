// @zentto/studio-core — Typed event bus for inter-component communication

import type { StudioEventMap } from '../types.js';

type EventHandler<T> = (payload: T) => void;

/**
 * Typed pub/sub event bus.
 * Enables loose coupling between studio engine modules.
 */
export class EventBus {
  private listeners = new Map<string, Set<EventHandler<any>>>();

  on<K extends keyof StudioEventMap>(event: K, handler: EventHandler<StudioEventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  once<K extends keyof StudioEventMap>(event: K, handler: EventHandler<StudioEventMap[K]>): () => void {
    const wrapper = ((payload: StudioEventMap[K]) => {
      unsub();
      handler(payload);
    }) as EventHandler<StudioEventMap[K]>;
    const unsub = this.on(event, wrapper);
    return unsub;
  }

  emit<K extends keyof StudioEventMap>(event: K, payload: StudioEventMap[K]): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        handler(payload);
      } catch {
        // Swallow handler errors to prevent one listener from breaking others
      }
    }
  }

  off<K extends keyof StudioEventMap>(event: K, handler?: EventHandler<StudioEventMap[K]>): void {
    if (handler) {
      this.listeners.get(event)?.delete(handler);
    } else {
      this.listeners.delete(event);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
