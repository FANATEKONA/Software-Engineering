import type { AvailabilityResult } from '@/lib/availability';
import { minutesToLabel } from '@/lib/time';

/** Builds the user-facing sentence for an availability result. */
export function describeAvailability(result: AvailabilityResult, roomName: string): string {
  switch (result.reason) {
    case 'bad-format':
      return 'Please enter valid start and end times in HH:MM format.';
    case 'not-whole-minutes':
      return 'Start and end must be whole-minute values.';
    case 'outside-day':
      return 'Times must be within 00:00–24:00 (0–1440 minutes).';
    case 'empty-interval':
      return 'End time must be later than start time.';
    case 'not-after-now':
      return `Start time must be strictly after the current demo time (${minutesToLabel(result.now)}).`;
    case 'too-long':
      return `Requested duration is ${result.duration} minutes — the maximum is ${result.maxDuration} minutes.`;
    case 'blocked':
      return 'This room is currently blocked and cannot be reserved.';
    case 'overlap':
      return `Overlaps an existing booking (${minutesToLabel(result.booking.start)}–${minutesToLabel(result.booking.end)}). Touching endpoints are allowed.`;
    case 'open':
      return `${roomName} is available from ${minutesToLabel(result.start)} to ${minutesToLabel(result.end)} (${result.duration} min).`;
  }
}
