import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../../hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    // Still old value
    expect(result.current).toBe('hello');
  });

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('world');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 'abc' });
    act(() => jest.advanceTimersByTime(100));
    // Still old value — timer was reset
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('abc');
  });

  it('works with default 300ms delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'init' } }
    );

    rerender({ value: 'changed' });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('changed');
  });
});
