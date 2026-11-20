import { describe, it, expect } from 'vitest';
import { filterRooms, getEquipmentOptions, matchRooms, parseAttendeeCount } from '@/lib/roomFilter';
import { ROOMS } from '@/data/demoData';

const ids = (rooms: { id: string }[]) => rooms.map((r) => r.id);

describe('F1 capacity filter', () => {
  it('excludes rooms whose capacity is below the attendee count', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 9, equipment: [] }))).toEqual(['C-303']);
  });

  it('includes rooms whose capacity equals the attendee count', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 8, equipment: [] }))).toEqual(['B-202', 'C-303']);
    expect(ids(filterRooms(ROOMS, { attendees: 4, equipment: [] }))).toEqual(['A-101', 'B-202', 'C-303', 'D-404']);
  });
});

describe('F2 equipment filter', () => {
  it('requires every selected equipment item', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 1, equipment: ['Projector', 'Whiteboard'] }))).toEqual([
      'A-101',
      'D-404',
    ]);
    expect(ids(filterRooms(ROOMS, { attendees: 1, equipment: ['Computers', 'Projector'] }))).toEqual(['D-404']);
  });

  it('applies no restriction when no equipment is selected', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 1, equipment: [] }))).toEqual(['A-101', 'B-202', 'C-303', 'D-404']);
  });

  it('lists each equipment option once, sorted', () => {
    expect(getEquipmentOptions(ROOMS)).toEqual(['Computers', 'Projector', 'Video Conferencing', 'Whiteboard']);
  });
});

describe('F4 empty result', () => {
  it('returns no rooms when no room satisfies the filters', () => {
    expect(parseAttendeeCount('13')).toBe(13);
    expect(matchRooms(ROOMS, { attendeesInput: '13', equipment: [] })).toEqual({
      attendeesValid: true,
      rooms: [],
    });
  });
});

describe('attendee count matching', () => {
  it.each([
    { attendeesInput: '1', equipment: [], expectedIds: ['A-101', 'B-202', 'C-303', 'D-404'] },
    { attendeesInput: '4', equipment: [], expectedIds: ['A-101', 'B-202', 'C-303', 'D-404'] },
    { attendeesInput: '6', equipment: ['Projector'], expectedIds: ['B-202', 'D-404'] },
    { attendeesInput: '6', equipment: ['Projector', 'Whiteboard'], expectedIds: ['D-404'] },
  ])('matches $attendeesInput attendees with equipment $equipment', ({ attendeesInput, equipment, expectedIds }) => {
    const result = matchRooms(ROOMS, { attendeesInput, equipment });
    expect(result.attendeesValid).toBe(true);
    expect(ids(result.rooms)).toEqual(expectedIds);
  });
});

describe('invalid attendee counts', () => {
  it.each(['', '0', '-1', '2.5', 'abc', ' 3', 'Infinity'])('treats %j as invalid and returns no rooms', (input) => {
    expect(parseAttendeeCount(input)).toBeNull();
    expect(matchRooms(ROOMS, { attendeesInput: input, equipment: [] })).toEqual({
      attendeesValid: false,
      rooms: [],
    });
  });

  it('accepts a positive whole number', () => {
    expect(parseAttendeeCount('3')).toBe(3);
    expect(matchRooms(ROOMS, { attendeesInput: '3', equipment: [] }).attendeesValid).toBe(true);
  });
});

describe('attendee count limits', () => {
  it('rejects a 400-digit decimal input that converts to Infinity', () => {
    const input = '9'.repeat(400);
    expect(Number(input)).toBe(Infinity);
    expect(parseAttendeeCount(input)).toBeNull();
    expect(matchRooms(ROOMS, { attendeesInput: input, equipment: [] })).toEqual({
      attendeesValid: false,
      rooms: [],
    });
  });

  it('accepts the maximum safe integer even when there are no matches', () => {
    const input = String(Number.MAX_SAFE_INTEGER);
    expect(parseAttendeeCount(input)).toBe(Number.MAX_SAFE_INTEGER);
    expect(matchRooms(ROOMS, { attendeesInput: input, equipment: [] })).toEqual({
      attendeesValid: true,
      rooms: [],
    });
  });

  it('rejects the first integer above the safe range', () => {
    const input = String(Number.MAX_SAFE_INTEGER + 1);
    expect(parseAttendeeCount(input)).toBeNull();
    expect(matchRooms(ROOMS, { attendeesInput: input, equipment: [] })).toEqual({
      attendeesValid: false,
      rooms: [],
    });
  });
});
