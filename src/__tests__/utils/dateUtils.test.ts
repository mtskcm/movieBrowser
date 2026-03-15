import { getYear, formatDate, formatRuntime } from '../../utils/dateUtils';

describe('getYear', () => {
  it('extracts year from YYYY-MM-DD', () => {
    expect(getYear('2024-05-24')).toBe('2024');
  });

  it('returns empty string for null', () => {
    expect(getYear(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(getYear(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(getYear('')).toBe('');
  });

  it('returns empty string for malformed date', () => {
    expect(getYear('not-a-date')).toBe('');
  });
});

describe('formatDate', () => {
  it('formats date string to readable format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('returns Unknown for null', () => {
    expect(formatDate(null)).toBe('Unknown');
  });

  it('returns Unknown for undefined', () => {
    expect(formatDate(undefined)).toBe('Unknown');
  });

  it('returns Unknown for empty string', () => {
    expect(formatDate('')).toBe('Unknown');
  });
});

describe('formatRuntime', () => {
  it('converts minutes to hours and minutes', () => {
    expect(formatRuntime(148)).toBe('2h 28m');
  });

  it('handles hours only', () => {
    expect(formatRuntime(120)).toBe('2h');
  });

  it('handles minutes only', () => {
    expect(formatRuntime(45)).toBe('45m');
  });

  it('returns N/A for null', () => {
    expect(formatRuntime(null)).toBe('N/A');
  });

  it('returns N/A for undefined', () => {
    expect(formatRuntime(undefined)).toBe('N/A');
  });

  it('returns N/A for 0', () => {
    expect(formatRuntime(0)).toBe('N/A');
  });

  it('returns N/A for negative', () => {
    expect(formatRuntime(-10)).toBe('N/A');
  });
});
