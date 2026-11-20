import { useState } from 'react';
import { GraduationCap, Info } from 'lucide-react';
import RoomFilters, { type RoomFilterState } from '@/components/RoomFilters';
import RoomList from '@/components/RoomList';
import RoomInfo from '@/components/RoomInfo';
import BookingList from '@/components/BookingList';
import TimeForm, { type TimeFormState } from '@/components/TimeForm';
import ResultCard from '@/components/ResultCard';
import { checkAvailability, type AvailabilityResult } from '@/lib/availability';
import { filterRooms, getEquipmentOptions, parseAttendeeCount } from '@/lib/roomFilter';
import { timeInputToMinutes } from '@/lib/time';
import { DEMO_NOW, MAX_DURATION, ROOMS } from '@/data/demoData';

const EQUIPMENT_OPTIONS = getEquipmentOptions(ROOMS);

function findMatchingRooms(filters: RoomFilterState) {
  const attendees = parseAttendeeCount(filters.attendeesInput);
  if (attendees === null) return [];
  return filterRooms(ROOMS, { attendees, equipment: filters.equipment });
}

export default function App() {
  const [roomFilters, setRoomFilters] = useState<RoomFilterState>({
    attendeesInput: '1',
    equipment: [],
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [form, setForm] = useState<TimeFormState>({
    startInput: '09:30',
    endInput: '10:00',
    untilMidnight: false,
  });
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const attendeesValid = parseAttendeeCount(roomFilters.attendeesInput) !== null;
  const matchingRooms = findMatchingRooms(roomFilters);
  const selectedRoom = matchingRooms.find((room) => room.id === selectedRoomId) ?? null;

  function handleFiltersChange(next: RoomFilterState) {
    setRoomFilters(next);
    setResult(null);
    const stillMatches = findMatchingRooms(next).some((room) => room.id === selectedRoomId);
    if (!stillMatches) setSelectedRoomId(null);
  }

  function handleSelectRoom(roomId: string) {
    if (roomId === selectedRoomId) return;
    setSelectedRoomId(roomId);
    setResult(null);
  }

  function handleFormChange(next: TimeFormState) {
    setForm(next);
    setResult(null);
  }

  function handleCheck() {
    if (!selectedRoom) return;

    const start = timeInputToMinutes(form.startInput);
    const end = form.untilMidnight ? 1440 : timeInputToMinutes(form.endInput);

    if (start === null || end === null) {
      setResult({
        status: 'invalid',
        message: 'Please enter valid start and end times in HH:MM format.',
      });
      return;
    }

    setResult(
      checkAvailability({
        start,
        end,
        now: DEMO_NOW,
        roomName: selectedRoom.name,
        blocked: selectedRoom.blocked,
        bookings: selectedRoom.bookings,
        maxDuration: MAX_DURATION,
      }),
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Smart Campus Room Availability Checker
              </h1>
              <p className="text-sm text-blue-100">
                Check whether a study room is free for your requested time — v1
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 py-6 space-y-4 sm:py-8">
        {/* Explanation banner */}
        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-900">
            Filter the room catalog by group size and equipment, select a room, then choose a time
            to see if it is <strong>available</strong>. This tool checks availability only — it does
            not create, edit, or cancel bookings. All data is fictional and the current time is
            fixed at <strong>09:00</strong>.
          </p>
        </div>

        <RoomFilters
          value={roomFilters}
          equipmentOptions={EQUIPMENT_OPTIONS}
          onChange={handleFiltersChange}
        />
        <RoomList
          rooms={matchingRooms}
          attendeesValid={attendeesValid}
          selectedRoomId={selectedRoom?.id ?? null}
          onSelect={handleSelectRoom}
        />

        {selectedRoom && (
          <>
            <RoomInfo room={selectedRoom} />
            <BookingList bookings={selectedRoom.bookings} />
            <TimeForm value={form} onChange={handleFormChange} onCheck={handleCheck} />
            <ResultCard result={result} />
          </>
        )}
      </main>

      <footer className="mx-auto max-w-2xl px-4 pb-8 text-center">
        <p className="text-xs text-slate-400">
          Frontend-only demo · Fictional data · No bookings are created
        </p>
      </footer>
    </div>
  );
}
