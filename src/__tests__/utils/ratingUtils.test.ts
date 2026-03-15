import { voteToStars, formatRating, getRatingColor, buildStarArray, TOTAL_STARS } from '../../utils/ratingUtils';

describe('voteToStars', () => {
  it('converts 10 to 5 stars', () => {
    expect(voteToStars(10)).toBe(5);
  });

  it('converts 0 to 0 stars', () => {
    expect(voteToStars(0)).toBe(0);
  });

  it('converts 5 to 2.5 stars', () => {
    expect(voteToStars(5)).toBe(2.5);
  });

  it('rounds to nearest 0.5', () => {
    expect(voteToStars(7)).toBe(3.5);
    expect(voteToStars(8)).toBe(4);
    expect(voteToStars(6)).toBe(3);
  });

  it('clamps negative values to 0', () => {
    expect(voteToStars(-1)).toBe(0);
  });

  it('clamps values above 10 to 5', () => {
    expect(voteToStars(11)).toBe(5);
  });
});

describe('formatRating', () => {
  it('formats to 1 decimal place', () => {
    expect(formatRating(7.345)).toBe('7.3');
    expect(formatRating(8)).toBe('8.0');
  });

  it('returns N/A for null', () => {
    expect(formatRating(null)).toBe('N/A');
  });

  it('returns N/A for undefined', () => {
    expect(formatRating(undefined)).toBe('N/A');
  });

  it('returns N/A for NaN', () => {
    expect(formatRating(NaN)).toBe('N/A');
  });
});

describe('getRatingColor', () => {
  it('returns green for high ratings', () => {
    expect(getRatingColor(8)).toBe('#4CAF50');
    expect(getRatingColor(7.5)).toBe('#4CAF50');
  });

  it('returns gold for medium ratings', () => {
    expect(getRatingColor(7)).toBe('#FFD700');
    expect(getRatingColor(6)).toBe('#FFD700');
  });

  it('returns orange for below-average ratings', () => {
    expect(getRatingColor(5)).toBe('#FF9800');
    expect(getRatingColor(4)).toBe('#FF9800');
  });

  it('returns red for low ratings', () => {
    expect(getRatingColor(3)).toBe('#CF6679');
    expect(getRatingColor(0)).toBe('#CF6679');
  });
});

describe('buildStarArray', () => {
  it('returns array of 5 elements', () => {
    expect(buildStarArray(7).length).toBe(TOTAL_STARS);
  });

  it('builds correct star array for 10', () => {
    const stars = buildStarArray(10);
    expect(stars).toEqual(['full', 'full', 'full', 'full', 'full']);
  });

  it('builds correct star array for 0', () => {
    const stars = buildStarArray(0);
    expect(stars).toEqual(['empty', 'empty', 'empty', 'empty', 'empty']);
  });

  it('builds correct star array for 5 (2.5 stars)', () => {
    const stars = buildStarArray(5);
    expect(stars).toEqual(['full', 'full', 'half', 'empty', 'empty']);
  });

  it('builds correct star array for 8 (4 stars)', () => {
    const stars = buildStarArray(8);
    expect(stars).toEqual(['full', 'full', 'full', 'full', 'empty']);
  });
});
