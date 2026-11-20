import type { Room } from '@/data/demoData';

export interface RoomFilterCriteria {
  attendees: number;
  equipment: string[];
}

/** Returns a positive whole number, or null if the text is not one. */
export function parseAttendeeCount(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const count = Number(value);
  return count >= 1 ? count : null;
}

/** F1: capacity must be at least the attendee count. F2: room must have every selected equipment item. */
export function filterRooms(rooms: Room[], criteria: RoomFilterCriteria): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every((item) => room.equipment.includes(item)),
  );
}

export function getEquipmentOptions(rooms: Room[]): string[] {
  return [...new Set(rooms.flatMap((room) => room.equipment))].sort();
}
