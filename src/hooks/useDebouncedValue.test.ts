import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces value updates', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'a', delay: 400 },
    });

    expect(result.current).toBe('a');
    rerender({ value: 'ab', delay: 400 });
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe('ab');
  });
});
