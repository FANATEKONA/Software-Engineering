import { CalendarDays } from 'lucide-react';
import type { Booking } from '@/data/demoData';
import { formatRange } from '@/lib/time';

interface BookingListProps {
  bookings: Booking[];
}

export default function BookingList({ bookings }: BookingListProps) {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Existing Bookings
        </h3>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-slate-500">No existing bookings.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li
              key={`${b.start}-${b.end}`}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200"
            >
              <span className="font-mono text-sm font-semibold text-slate-800">
                {formatRange(b.start, b.end)}
              </span>
              <span className="text-xs text-slate-500">
                {b.start}–{b.end} min
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
