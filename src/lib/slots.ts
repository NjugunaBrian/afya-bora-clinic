/**
 * slots.ts — live open slots per doctor, on the clinic's (Nairobi) clock.
 * A slot is 30 minutes. A slot is open when the doctor works that day, it is
 * not in the past, nobody else has it (a deterministic "already taken" pattern
 * stands in for the real calendar) and no live booking in the store holds it.
 */
import { addDays } from 'date-fns';
import { atTime, dayKey, formatDay, zoned } from '@shared/time';
import { DOCTORS, type Booking, type Doctor } from './demo-data';

export type Slot = { start: string; time: string; doctorIds: string[] };

const SLOT_MIN = 30;
const LEAD_MIN = 60; // no slot sooner than an hour from now

function hash(s: string): number {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
}

function toMin(hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
}
function fromMin(n: number) {
    return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}

/** Every time a doctor sees patients on a given day key (before bookings). */
export function workingTimes(d: Doctor, key: string): string[] {
    const dow = zoned(key).getDay();
    if (!d.days.includes(dow)) return [];
    const last = dow === 6 ? Math.min(toMin(d.end), 13 * 60) : toMin(d.end);
    const out: string[] = [];
    for (let t = toMin(d.start); t < last; t += SLOT_MIN) {
        if (t >= 13 * 60 && t < 14 * 60) continue; // lunch
        out.push(fromMin(t));
    }
    return out;
}

export function doctorsFor(opts: { serviceId?: string; doctorId?: string; branchId?: string }): Doctor[] {
    return DOCTORS.filter(
        (d) =>
            (!opts.doctorId || d.id === opts.doctorId) &&
            (!opts.serviceId || d.serviceIds.includes(opts.serviceId)) &&
            (!opts.branchId || opts.doctorId || d.branchId === opts.branchId),
    );
}

function held(bookings: Booking[], doctorId: string, startIso: string, ignoreRef?: string) {
    const t = new Date(startIso).getTime();
    return bookings.some(
        (b) =>
            b.ref !== ignoreRef &&
            b.status !== 'Cancelled' &&
            b.doctorId === doctorId &&
            new Date(b.start).getTime() === t,
    );
}

export function openSlots(opts: {
    dayKey: string;
    serviceId?: string;
    doctorId?: string;
    branchId?: string;
    bookings: Booking[];
    ignoreRef?: string;
}): Slot[] {
    const docs = doctorsFor(opts);
    const earliest = Date.now() + LEAD_MIN * 60_000;
    const byTime = new Map<string, Slot>();
    for (const d of docs) {
        for (const time of workingTimes(d, opts.dayKey)) {
            const start = atTime(opts.dayKey, time).toISOString();
            if (new Date(start).getTime() < earliest) continue;
            if (hash(`${d.id}|${opts.dayKey}|${time}`) % 100 < 30) continue;
            if (held(opts.bookings, d.id, start, opts.ignoreRef)) continue;
            const slot = byTime.get(time) ?? { start, time, doctorIds: [] };
            slot.doctorIds.push(d.id);
            byTime.set(time, slot);
        }
    }
    return [...byTime.values()].sort((a, b) => a.time.localeCompare(b.time));
}

/** The next n open slots for one doctor, looking up to 21 days ahead. */
export function nextOpenSlots(doctorId: string, n: number, bookings: Booking[]) {
    const out: { start: string; label: string }[] = [];
    const base = zoned();
    for (let i = 0; i < 21 && out.length < n; i++) {
        const key = dayKey(addDays(base, i));
        for (const s of openSlots({ dayKey: key, doctorId, bookings })) {
            out.push({ start: s.start, label: `${formatDay(s.start, 'EEE d MMM')} · ${formatDay(s.start, 'h:mm a')}` });
            if (out.length >= n) break;
        }
    }
    return out;
}

/** First open slot with any doctor at a branch: today if possible, else the next day. */
export function nextFreeSlot(bookings: Booking[], branchId = 'nairobi') {
    const base = zoned();
    for (let i = 0; i < 14; i++) {
        const key = dayKey(addDays(base, i));
        const first = openSlots({ dayKey: key, branchId, bookings })[0];
        if (first) return { ...first, today: i === 0 };
    }
    return null;
}

/** Next 14 bookable day keys starting today, skipping none (closed days just show 0). */
export function upcomingDays(count = 14): string[] {
    const base = zoned();
    return Array.from({ length: count }, (_, i) => dayKey(addDays(base, i)));
}
