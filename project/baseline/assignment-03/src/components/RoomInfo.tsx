import { Building2, Clock3, Ban, CheckCircle2 } from 'lucide-react';
import { DEMO_ROOM_NAME, DEMO_NOW, DEMO_BLOCKED } from '../data/demoData';
import { minutesToLabel } from '../lib/time';

export default function RoomInfo() {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900">{DEMO_ROOM_NAME}</h2>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {/* Fixed demo current time */}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              <Clock3 className="h-4 w-4 text-slate-500" />
              Demo now: <strong className="text-slate-900">{minutesToLabel(DEMO_NOW)}</strong>
              <span className="text-slate-400">({DEMO_NOW} min)</span>
            </span>

            {/* Blocked / open status badge */}
            {DEMO_BLOCKED ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 ring-1 ring-red-200">
                <Ban className="h-4 w-4" />
                Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 ring-1 ring-green-200">
                <CheckCircle2 className="h-4 w-4" />
                Open
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
