import { Check, Users } from 'lucide-react';
import { parseAttendeeCount } from '@/lib/roomFilter';

export interface RoomFilterState {
  attendeesInput: string;
  equipment: string[];
}

interface RoomFiltersProps {
  value: RoomFilterState;
  equipmentOptions: string[];
  onChange: (next: RoomFilterState) => void;
}

export default function RoomFilters({ value, equipmentOptions, onChange }: RoomFiltersProps) {
  const attendees = parseAttendeeCount(value.attendeesInput);

  function toggleEquipment(item: string) {
    const equipment = value.equipment.includes(item)
      ? value.equipment.filter((e) => e !== item)
      : [...value.equipment, item];
    onChange({ ...value, equipment });
  }

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 mb-4">
        Find a Room
      </h3>

      <div>
        <label htmlFor="attendees" className="block text-sm font-medium text-slate-700 mb-1.5">
          Number of attendees
        </label>
        <input
          id="attendees"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={value.attendeesInput}
          onChange={(e) => onChange({ ...value, attendeesInput: e.target.value })}
          className="w-full sm:max-w-[10rem] rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {attendees === null && (
          <p className="mt-1 text-xs text-red-600">Enter a whole number of 1 or more.</p>
        )}
      </div>

      <fieldset className="mt-5">
        <legend className="block text-sm font-medium text-slate-700 mb-2">
          Required equipment
          <span className="ml-1.5 text-xs font-normal text-slate-500">(room must have all selected)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map((item) => {
            const checked = value.equipment.includes(item);
            return (
              <label
                key={item}
                className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors focus-within:ring-2 focus-within:ring-blue-300 ${
                  checked
                    ? 'bg-blue-600 text-white ring-blue-600'
                    : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleEquipment(item)}
                />
                {checked && <Check className="h-3.5 w-3.5" />}
                {item}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Users className="h-3.5 w-3.5" />
        Rooms with a capacity smaller than your group are hidden.
      </p>
    </section>
  );
}
