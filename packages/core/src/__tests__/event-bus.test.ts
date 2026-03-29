import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../events/event-bus.js';

describe('EventBus', () => {
  it('subscribes and receives events', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('field:change', handler);
    bus.emit('field:change', { fieldId: 'f1', field: 'name', value: 'test', previousValue: '' });
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ fieldId: 'f1', field: 'name', value: 'test', previousValue: '' });
  });

  it('unsubscribes via returned function', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const unsub = bus.on('field:change', handler);
    unsub();
    bus.emit('field:change', { fieldId: 'f1', field: 'name', value: 'test', previousValue: '' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('once fires only once', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.once('field:focus', handler);
    bus.emit('field:focus', { fieldId: 'f1' });
    bus.emit('field:focus', { fieldId: 'f1' });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('off removes specific handler', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.on('field:blur', h1);
    bus.on('field:blur', h2);
    bus.off('field:blur', h1);
    bus.emit('field:blur', { fieldId: 'f1' });
    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledOnce();
  });

  it('off removes all handlers for event', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.on('field:focus', h1);
    bus.on('field:focus', h2);
    bus.off('field:focus');
    bus.emit('field:focus', { fieldId: 'f1' });
    expect(h1).not.toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  it('clear removes everything', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    bus.on('field:change', h1);
    bus.on('field:focus', h1);
    bus.clear();
    bus.emit('field:change', { fieldId: 'f1', field: 'x', value: 1, previousValue: 0 });
    bus.emit('field:focus', { fieldId: 'f1' });
    expect(h1).not.toHaveBeenCalled();
  });

  it('swallows handler errors', () => {
    const bus = new EventBus();
    const errorHandler = () => { throw new Error('boom'); };
    const goodHandler = vi.fn();
    bus.on('field:focus', errorHandler);
    bus.on('field:focus', goodHandler);
    bus.emit('field:focus', { fieldId: 'f1' });
    expect(goodHandler).toHaveBeenCalledOnce();
  });
});
