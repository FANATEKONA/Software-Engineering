export interface Booking {
  start: number; // minutes after midnight
  end: number;
}

export const DEMO_ROOM_NAME = 'Study Room A-101';

/** Fixed demo current time — 540 minutes = 09:00. Not the device's real clock. */
export const DEMO_NOW = 540;

/** Existing fictional bookings for the room. */
export const DEMO_BOOKINGS: Booking[] = [
  { start: 600, end: 660 }, // 10:00–11:00
];

/** Whether the room is administratively blocked. */
export const DEMO_BLOCKED = false;

/** Maximum allowed booking duration in minutes (AC2). */
export const MAX_DURATION = 120;
