import type { Room } from '@/types/room';

/** Fixed demo current time — 540 minutes = 09:00. Not the device's real clock. */
export const DEMO_NOW = 540;

/** Fictional room catalog. Each room's bookings and blocked status are used only for that room. */
export const ROOMS: Room[] = [
  {
    id: 'A-101',
    name: 'Study Room A-101',
    capacity: 4,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }], // 10:00–11:00
  },
  {
    id: 'B-202',
    name: 'Study Room B-202',
    capacity: 8,
    equipment: ['Projector', 'Video Conferencing'],
    blocked: false,
    bookings: [{ start: 720, end: 780 }], // 12:00–13:00
  },
  {
    id: 'C-303',
    name: 'Study Room C-303',
    capacity: 12,
    equipment: ['Whiteboard', 'Computers'],
    blocked: true,
    bookings: [{ start: 660, end: 720 }], // 11:00–12:00
  },
  {
    id: 'D-404',
    name: 'Study Room D-404',
    capacity: 6,
    equipment: ['Projector', 'Whiteboard', 'Computers'],
    blocked: false,
    bookings: [{ start: 900, end: 960 }], // 15:00–16:00
  },
];
