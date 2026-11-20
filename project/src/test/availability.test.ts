import { describe, it, expect } from 'vitest';
import { checkAvailability, MAX_DURATION, type AvailabilityInput } from '@/lib/availability';
import { DEMO_NOW, ROOMS } from '@/data/demoData';

const baseInput: AvailabilityInput = {
  start: 780,
  end: 840,
  now: DEMO_NOW,
  blocked: false,
  bookings: [],
  maxDuration: MAX_DURATION,
};

function run(overrides: Partial<AvailabilityInput>) {
  return checkAvailability({ ...baseInput, ...overrides });
}

function checkRoom(roomId: string, start: number, end: number) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) throw new Error(`Unknown room ${roomId}`);
  return checkAvailability({
    start,
    end,
    now: DEMO_NOW,
    blocked: room.blocked,
    bookings: room.bookings,
    maxDuration: MAX_DURATION,
  });
}

describe('AC1 time validation', () => {
  it('rejects a start time equal to the current time', () => {
    const result = run({ start: DEMO_NOW, end: 600 });
    expect(result).toEqual({ status: 'invalid', reason: 'not-after-now', now: DEMO_NOW });
  });

  it('accepts a start time one minute after the current time', () => {
    expect(run({ start: DEMO_NOW + 1, end: 600 }).status).toBe('available');
  });

  it('rejects reversed and zero-length intervals', () => {
    expect(run({ start: 720, end: 660 })).toEqual({ status: 'invalid', reason: 'empty-interval' });
    expect(run({ start: 720, end: 720 })).toEqual({ status: 'invalid', reason: 'empty-interval' });
  });

  it('rejects times outside the day and non-whole minutes', () => {
    expect(run({ start: 600, end: 1441 })).toEqual({ status: 'invalid', reason: 'outside-day' });
    expect(run({ start: -1, end: 600 })).toEqual({ status: 'invalid', reason: 'outside-day' });
    expect(run({ start: 600.5, end: 660 })).toEqual({ status: 'invalid', reason: 'not-whole-minutes' });
  });

  it('accepts an interval ending exactly at 24:00', () => {
    expect(run({ start: 1380, end: 1440 }).status).toBe('available');
  });
});

describe('AC2 duration cap', () => {
  it('accepts exactly 120 minutes', () => {
    expect(run({ start: 600, end: 720 }).status).toBe('available');
  });

  it('rejects 121 minutes', () => {
    expect(run({ start: 600, end: 721 })).toEqual({
      status: 'invalid',
      reason: 'too-long',
      duration: 121,
      maxDuration: MAX_DURATION,
    });
  });
});

describe('AC3 blocked room', () => {
  it('reports a blocked room as unavailable even when the time is free', () => {
    expect(run({ blocked: true })).toEqual({ status: 'unavailable', reason: 'blocked' });
  });
});

describe('AC4 booking overlap', () => {
  it('rejects an interval that overlaps an existing booking', () => {
    const result = run({ start: 630, end: 690, bookings: [{ start: 600, end: 660 }] });
    expect(result).toEqual({
      status: 'unavailable',
      reason: 'overlap',
      booking: { start: 600, end: 660 },
    });
  });

  it('rejects an interval fully contained in an existing booking', () => {
    expect(run({ start: 610, end: 620, bookings: [{ start: 600, end: 660 }] }).status).toBe('unavailable');
  });

  it('allows an interval that touches a booking endpoint', () => {
    expect(run({ start: 570, end: 600, bookings: [{ start: 600, end: 660 }] }).status).toBe('available');
    expect(run({ start: 660, end: 720, bookings: [{ start: 600, end: 660 }] }).status).toBe('available');
  });
});

describe('AC5 checking never mutates bookings', () => {
  it('leaves the booking list unchanged after a check', () => {
    const bookings = [{ start: 600, end: 660 }];
    const snapshot = structuredClone(bookings);
    run({ start: 630, end: 690, bookings });
    run({ start: 700, end: 710, bookings });
    expect(bookings).toEqual(snapshot);
  });
});

describe('room-specific booking isolation', () => {
  it('uses only the selected room bookings', () => {
    expect(checkRoom('B-202', 600, 660).status).toBe('available');
    expect(checkRoom('A-101', 600, 660).status).toBe('unavailable');
  });

  it('never returns available for the blocked room C-303', () => {
    for (let start = DEMO_NOW + 1; start <= 1380; start += 30) {
      expect(checkRoom('C-303', start, start + 30).status).not.toBe('available');
    }
  });
});
