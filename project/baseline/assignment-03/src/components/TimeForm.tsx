import { CalendarCheck } from 'lucide-react';
import { minutesToLabel, timeInputToMinutes } from '../lib/time';

export interface TimeFormState {
  startInput: string;
  endInput: string;
  untilMidnight: boolean;
}

interface TimeFormProps {
  value: TimeFormState;
  onChange: (next: TimeFormState) => void;
  onCheck: () => void;
}

export default function TimeForm({ value, onChange, onCheck }: TimeFormProps) {
  const startMin = timeInputToMinutes(value.startInput);

  const endMin = value.untilMidnight
    ? 1440
    : timeInputToMinutes(value.endInput);

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">
        Request a Time Interval
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start time */}
        <div>
          <label htmlFor="start-time" className="block text-sm font-medium text-slate-700 mb-1.5">
            Start time
          </label>
          <input
            id="start-time"
            type="time"
            value={value.startInput}
            onChange={(e) => onChange({ ...value, startInput: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {startMin !== null && (
            <p className="mt-1 text-xs text-slate-500">{startMin} min — {minutesToLabel(startMin)}</p>
          )}
        </div>

        {/* End time */}
        <div>
          <label htmlFor="end-time" className="block text-sm font-medium text-slate-700 mb-1.5">
            End time
          </label>
          <input
            id="end-time"
            type="time"
            value={value.endInput}
            disabled={value.untilMidnight}
            onChange={(e) => onChange({ ...value, endInput: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {endMin !== null && `${endMin} min — ${minutesToLabel(endMin)}`}
            </p>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value.untilMidnight}
                onChange={(e) => onChange({ ...value, untilMidnight: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
              />
              Until 24:00
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={onCheck}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
      >
        <CalendarCheck className="h-5 w-5" />
        Check Availability
      </button>
    </section>
  );
}
