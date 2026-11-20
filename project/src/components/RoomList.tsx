import { Ban, SearchX, Users } from 'lucide-react';
import type { Room } from '@/types/room';

interface RoomListProps {
  rooms: Room[];
  attendeesValid: boolean;
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export default function RoomList({ rooms, attendeesValid, selectedRoomId, onSelect }: RoomListProps) {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Matching Rooms
        </h3>
        {attendeesValid && rooms.length > 0 && (
          <span className="text-xs text-slate-500">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
          </span>
        )}
      </div>

      {!attendeesValid ? (
        <p className="text-sm text-slate-500">Enter a valid number of attendees to see matching rooms.</p>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 px-4 py-8 text-center ring-1 ring-slate-200">
          <SearchX className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">No rooms match your requirements.</p>
          <p className="text-xs text-slate-500">Try a smaller group or remove an equipment requirement.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rooms.map((room) => {
            const selected = room.id === selectedRoomId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(room.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    selected
                      ? 'bg-blue-50 ring-2 ring-blue-600'
                      : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-white hover:ring-blue-300'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{room.name}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                      <Users className="h-3.5 w-3.5" />
                      <span>Capacity {room.capacity}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{room.equipment.join(', ')}</span>
                    </span>
                  </span>
                  {room.blocked && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      <Ban className="h-3.5 w-3.5" />
                      Blocked
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
