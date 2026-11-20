import type { Booking } from '@/types/room';

/** Maximum allowed booking duration in minutes (AC2). */
export const MAX_DURATION = 120;

export interface AvailabilityInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
  maxDuration: number;
}

export type AvailabilityResult =
  | { status: 'invalid'; reason: 'bad-format' }
  | { status: 'invalid'; reason: 'not-whole-minutes' }
  | { status: 'invalid'; reason: 'outside-day' }
  | { status: 'invalid'; reason: 'empty-interval' }
  | { status: 'invalid'; reason: 'not-after-now'; now: number }
  | { status: 'invalid'; reason: 'too-long'; duration: number; maxDuration: number }
  | { status: 'unavailable'; reason: 'blocked' }
  | { status: 'unavailable'; reason: 'overlap'; booking: Booking }
  | { status: 'available'; reason: 'open'; start: number; end: number; duration: number };

/**
 * Pure availability checker — no UI text, no side effects, never mutates bookings.
 *
 * AC1: 0 <= start < end <= 1440, start > now (all integers)
 * AC2: duration <= maxDuration
 * AC3: blocked room always rejected
 * AC4: reject overlap using half-open intervals (start < bookedEnd AND end > bookedStart)
 * AC5: returns an unambiguous Available / Unavailable / Invalid result
 */
export function checkAvailability(input: AvailabilityInput): AvailabilityResult {
  const { start, end, now, blocked, bookings, maxDuration } = input;

  // --- AC1: Time validation ---
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { status: 'invalid', reason: 'not-whole-minutes' };
  }
  if (start < 0 || end > 1440) {
    return { status: 'invalid', reason: 'outside-day' };
  }
  if (start >= end) {
    return { status: 'invalid', reason: 'empty-interval' };
  }
  if (start <= now) {
    return { status: 'invalid', reason: 'not-after-now', now };
  }

  // --- AC2: Duration cap ---
  const duration = end - start;
  if (duration > maxDuration) {
    return { status: 'invalid', reason: 'too-long', duration, maxDuration };
  }

  // --- AC3: Blocked room ---
  if (blocked) {
    return { status: 'unavailable', reason: 'blocked' };
  }

  // --- AC4: Existing bookings (half-open overlap) ---
  for (const booking of bookings) {
    if (start < booking.end && end > booking.start) {
      return { status: 'unavailable', reason: 'overlap', booking };
    }
  }

  // --- AC5: Available ---
  return { status: 'available', reason: 'open', start, end, duration };
}
