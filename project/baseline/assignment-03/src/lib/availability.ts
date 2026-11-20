import type { Booking } from '../data/demoData';
import { minutesToLabel } from './time';

export interface AvailabilityInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
  maxDuration: number;
}

export type AvailabilityResult =
  | { status: 'invalid'; message: string }
  | { status: 'unavailable'; message: string }
  | { status: 'available'; message: string };

/**
 * Pure availability checker — no UI, no side effects, never mutates bookings.
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
    return { status: 'invalid', message: 'Start and end must be whole-minute values.' };
  }
  if (start < 0 || end > 1440) {
    return { status: 'invalid', message: 'Times must be within 00:00–24:00 (0–1440 minutes).' };
  }
  if (start >= end) {
    return { status: 'invalid', message: 'End time must be later than start time.' };
  }
  if (start <= now) {
    return {
      status: 'invalid',
      message: `Start time must be strictly after the current demo time (${minutesToLabel(now)}).`,
    };
  }

  // --- AC2: Duration cap ---
  const duration = end - start;
  if (duration > maxDuration) {
    return {
      status: 'invalid',
      message: `Requested duration is ${duration} minutes — the maximum is ${maxDuration} minutes.`,
    };
  }

  // --- AC3: Blocked room ---
  if (blocked) {
    return {
      status: 'unavailable',
      message: 'This room is currently blocked and cannot be reserved.',
    };
  }

  // --- AC4: Existing bookings (half-open overlap) ---
  for (const booking of bookings) {
    if (start < booking.end && end > booking.start) {
      return {
        status: 'unavailable',
        message: `Overlaps an existing booking (${minutesToLabel(booking.start)}–${minutesToLabel(booking.end)}). Touching endpoints are allowed.`,
      };
    }
  }

  // --- AC5: Available ---
  return {
    status: 'available',
    message: `Study Room A-101 is available from ${minutesToLabel(start)} to ${minutesToLabel(end)} (${duration} min).`,
  };
}
