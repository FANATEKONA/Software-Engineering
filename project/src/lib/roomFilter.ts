import type { Room } from '@/types/room';

export interface RoomFilterState {
  attendeesInput: string;
  equipment: string[];
}

export interface RoomFilterCriteria {
  attendees: number;
  equipment: string[];
}

/** Returns a positive whole number, or null if the text is not one. */
export function parseAttendeeCount(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const count = Number(value);
  return Number.isSafeInteger(count) && count > 0 ? count : null;
}

/** F1: capacity must be at least the attendee count. F2: room must have every selected equipment item. */
export function filterRooms(rooms: Room[], criteria: RoomFilterCriteria): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every((item) => room.equipment.includes(item)),
  );
}

/** Applies the attendee validation and filters; invalid attendee input never yields rooms. */
export function matchRooms(
  rooms: Room[],
  filters: RoomFilterState,
): { attendeesValid: boolean; rooms: Room[] } {
  const attendees = parseAttendeeCount(filters.attendeesInput);
  if (attendees === null) return { attendeesValid: false, rooms: [] };
  return {
    attendeesValid: true,
    rooms: filterRooms(rooms, { attendees, equipment: filters.equipment }),
  };
}

export function getEquipmentOptions(rooms: Room[]): string[] {
  return [...new Set(rooms.flatMap((room) => room.equipment))].sort();
}
