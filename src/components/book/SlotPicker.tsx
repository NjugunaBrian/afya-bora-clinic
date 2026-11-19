import { useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react';
import { dayKey, formatDay, formatTime, zoned } from '@shared/time';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Booking } from '@/lib/demo-data';
import { openSlots, type Slot } from '@/lib/slots';

/**
 * SlotPicker — the signature screen. A week grid of LIVE open slots for the
 * chosen service / doctor / branch. On phones it shows one day at a time.
 * `value` is the chosen slot start (ISO); `onChange` also gets the doctors free then.
 */
export function SlotPicker({
    serviceId,
    doctorId,
    branchId,
    bookings,
    value,
    onChange,
    ignoreRef,
    invalid,
}: {
    serviceId?: string;
    doctorId?: string;
    branchId: string;
    bookings: Booking[];
    value: string;
    onChange: (slot: Slot) => void;
    ignoreRef?: string;
    invalid?: boolean;
}) {
    const [week, setWeek] = useState(0);
    const [mobileDay, setMobileDay] = useState(0);

    const days = useMemo(() => {
        const base = zoned();
        return Array.from({ length: 7 }, (_, i) => {
            const d = addDays(base, week * 7 + i);
            const key = dayKey(d);
        const slots = openSlots({ dayKey: key, serviceId, doctorId, branchId, bookings, ignoreRef });
        return { key, slots };
    });
}, [week, serviceId, doctorId, branchId, bookings, ignoreRef]);

const total = days.reduce((n, d) => n + d.slots.length, 0);
const selectedKey = value ? dayKey(value) : '';

return (
    <div
      className={cn('min-w-0 max-w-full rounded-2xl bg-card p-3 shadow-sm md:p-4', invalid && 'ring-2 ring-destructive')}
      role="group"
      aria-label="Choose a day and time"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          {formatDay(days[0]!.key, 'd MMM')} – {formatDay(days[6]!.key, 'd MMM')}
          <span className="ml-2 font-normal text-muted-foreground">{total} open times</span>
        </p>
        <div className="flex gap-1">
          <Button type="button" variant="outline" size="icon" aria-label="Earlier week" disabled={week === 0} onClick={() => { setWeek(week - 1); setMobileDay(0); }}>
            <ChevronLeft />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Later week" disabled={week >= 2} onClick={() => { setWeek(week + 1); setMobileDay(0); }}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Phone: day chips */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 md:hidden" role="tablist" aria-label="Days">
        {days.map((d, i) => (
          <button
            key={d.key}
            type="button"
            role="tab"
            aria-selected={mobileDay === i}
            onClick={() => setMobileDay(i)}
            className={cn(
              'flex min-w-16 shrink-0 flex-col items-center rounded-xl px-3 py-2 text-xs transition-colors duration-fast',
              mobileDay === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
            )}
          >
            <span className="font-semibold">{formatDay(d.key, 'EEE')}</span>
            <span className="font-heading text-base font-bold">{formatDay(d.key, 'd')}</span>
            <span className="opacity-80">{d.slots.length} open</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {days.map((d, i) => (
          <div key={d.key} className={cn('min-w-0 flex-col gap-2', mobileDay === i ? 'flex' : 'hidden md:flex')}>
            <div className={cn('hidden rounded-xl px-2 py-1.5 text-center md:block', selectedKey === d.key ? 'bg-accent' : 'bg-muted/60')}>
              <p className="text-xs font-semibold text-muted-foreground">{i === 0 && week === 0 ? 'Today' : formatDay(d.key, 'EEE')}</p>
              <p className="font-heading text-lg font-bold leading-tight">{formatDay(d.key, 'd MMM')}</p>
              <p className="text-[0.7rem] text-muted-foreground">{d.slots.length ? `${d.slots.length} open` : 'No times'}</p>
            </div>
            {d.slots.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                No open times. Try another day.
              </p>
            ) : (
              <ul className="grid grid-cols-3 gap-1.5 md:max-h-72 md:grid-cols-1 md:overflow-y-auto md:pr-1">
                {d.slots.map((s) => {
                  const on = value === s.start;
                  return (
                    <li key={s.start}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${formatDay(s.start, 'EEEE d MMMM')} at ${formatTime(s.start)}`}
                        onClick={() => onChange(s)}
                        className={cn(
                          'w-full rounded-lg border px-2 py-2 text-sm font-semibold tabular-nums transition-[background-color,transform] duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          on
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                            : 'border-border bg-background hover:border-primary hover:bg-accent',
                        )}
                      >
                        {formatTime(s.start)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>

    { total === 0 ? (
    <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted p-3 text-sm">
        <CalendarX2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Nothing open this week for that choice. Try the next week or choose &quot;Any available doctor&quot;.
    </div>
) : null}
    </div>
  );
}
