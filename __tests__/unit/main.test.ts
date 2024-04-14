import { describe, it, afterEach, beforeEach, vi, expect } from 'vitest';
import { Delays, greeter } from '../../src/main.js';

describe('greeter function', () => {
  const name = 'John';

  beforeEach(() => {
    // Read more about fake timers
    // https://vitest.dev/api/vi.html#vi-usefaketimers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // Assert if setTimeout was called properly
  it('delays the greeting by 2 seconds', async () => {
    vi.spyOn(global, 'setTimeout');
    const p = greeter(name);

    await vi.runAllTimersAsync();
    await p;

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      Delays.Long,
    );
  });

  // Assert greeter result
  it('greets a user with `Hello, {name}` message', async () => {
    const p = greeter(name);
    await vi.runAllTimersAsync();

    expect(await p).toBe(`Hello, ${name}`);
  });
});
