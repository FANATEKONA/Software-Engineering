import { describe, it, expect } from 'vitest';
import { resolveTimeRequest, minutesToLabel } from '@/lib/time';
import { describeAvailability } from '@/lib/availabilityMessage';

describe('time request parsing', () => {
  it('treats Until 24:00 as end of day', () => {
    expect(resolveTimeRequest({ startInput: '13:00', endInput: '10:00', untilMidnight: true })).toEqual({
      start: 780,
      end: 1440,
    });
  });

  it('returns null for malformed times', () => {
    expect(resolveTimeRequest({ startInput: '', endInput: '10:00', untilMidnight: false }).start).toBeNull();
    expect(resolveTimeRequest({ startInput: '10:00', endInput: '25:00', untilMidnight: false }).end).toBeNull();
  });

  it('labels 1440 minutes as 24:00', () => {
    expect(minutesToLabel(1440)).toBe('24:00');
  });
});

describe('result sentences', () => {
  it('names the selected room in an available result', () => {
    const message = describeAvailability(
      { status: 'available', reason: 'open', start: 600, end: 660, duration: 60 },
      'Study Room B-202',
    );
    expect(message).toBe('Study Room B-202 is available from 10:00 to 11:00 (60 min).');
  });
});
