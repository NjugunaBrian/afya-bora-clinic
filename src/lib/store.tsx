/**
 * store.tsx — the single client store. React context + localStorage so edits
 * survive a reload. Pages read this, never demo-data directly.
 * Phase 2 swaps the persistence for the real /api/bookings endpoints.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { dayKey } from '@shared/time';
import type { BookingForm } from '@shared/schemas';
import {
    BRANCHES,
    DOCTORS,
    PATIENT,
    SEED_BOOKINGS,
    SERVICES,
    type Booking,
    type BranchId,
} from './demo-data';
import { doctorsFor, openSlots } from './slots';

const KEY = 'aurea-bookings-demo';

export type Prefs = { serviceId: string; doctorId: string; branchId: BranchId; dayKey: string };
const DEFAULT_PREFS: Prefs = { serviceId: '', doctorId: '', branchId: 'nairobi', dayKey: '' };

type Persisted = { seedDay: string; bookings: Booking[]; prefs: Prefs; lastRef: number };

function fresh(): Persisted {
    return { seedDay: dayKey(new Date()), bookings: SEED_BOOKINGS, prefs: DEFAULT_PREFS, lastRef: 20421 };
}

function load(): Persisted {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
            const p = JSON.parse(raw) as Persisted;
            // Demo dates are relative to "today": re-seed when the day rolls over.
            if (p.seedDay === dayKey(new Date()) && Array.isArray(p.bookings)) return p;
        }
    } catch {
        /* ignore corrupt storage */
    }
    return fresh();
}

type Store = {
    patient: typeof PATIENT;
    bookings: Booking[];
    prefs: Prefs;
    setPrefs: (p: Partial<Prefs>) => void;
    addBooking: (f: BookingForm, forName?: string) => Booking;
    reschedule: (ref: string, startIso: string, doctorId?: string) => void;
    cancel: (ref: string) => void;
    resetDemo: () => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [state, setStateRaw] = useState<Persisted>(load);
    // Mirror of the latest state so actions can read it synchronously (and
    // return the booking they just created) without waiting for a render.
    const ref = useRef(state);
    const setState = useCallback((fn: (s: Persisted) => Persisted) => {
        ref.current = fn(ref.current);
        setStateRaw(ref.current);
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(state));
        } catch {
            /* storage full or blocked: the app still works in memory */
        }
    }, [state]);

    const setPrefs = useCallback((p: Partial<Prefs>) => {
        setState((s) => ({ ...s, prefs: { ...s.prefs, ...p } }));
    }, [setState]);

    const addBooking = useCallback(
        (f: BookingForm, forName?: string): Booking => {
            let created!: Booking;
            setState((s) => {
                // "Any doctor": give the slot to the first qualified doctor who is free.
                let doctorId = f.doctorId;
                if (!doctorId) {
                    const day = dayKey(f.slotStart);
                    const slot = openSlots({ dayKey: day, serviceId: f.serviceId, branchId: f.branchId, bookings: s.bookings }).find(
                        (x) => x.start === f.slotStart,
                    );
                    doctorId = slot?.doctorIds[0] ?? doctorsFor({ serviceId: f.serviceId, branchId: f.branchId })[0]?.id ?? DOCTORS[0]!.id;
                }
                const next = s.lastRef + 1;
                const nowIso = new Date().toISOString();
                created = {
                    ref: `AB-${next}`,
                    patientName: f.fullName,
                    forName: forName ?? f.fullName,
                    phone: f.phone,
                    serviceId: f.serviceId,
                    doctorId,
                    branchId: f.branchId as BranchId,
                    start: f.slotStart,
                    status: 'Requested',
                    payment: f.paymentMethod,
                    reason: f.reason,
                    createdAt: nowIso,
                    history: [{ at: nowIso, text: 'Request sent on the website' }],
                };
                return { ...s, lastRef: next, bookings: [created, ...s.bookings] };
            });
            return created;
        },
        [setState],
    );

    const reschedule = useCallback((ref: string, startIso: string, doctorId?: string) => {
        setState((s) => ({
            ...s,
            bookings: s.bookings.map((b) =>
                b.ref === ref
                    ? {
                        ...b,
                        start: startIso,
                        doctorId: doctorId ?? b.doctorId,
                        status: 'Requested',
                        history: [...b.history, { at: new Date().toISOString(), text: 'Moved to a new time. Waiting for confirmation' }],
                    }
                    : b,
            ),
        }));
    }, [setState]);

    const cancel = useCallback((ref: string) => {
        setState((s) => ({
            ...s,
            bookings: s.bookings.map((b) =>
                b.ref === ref
                    ? { ...b, status: 'Cancelled', history: [...b.history, { at: new Date().toISOString(), text: 'Cancelled by Karimi' }] }
                    : b,
            ),
        }));
    }, [setState]);

    const resetDemo = useCallback(() => setState(() => fresh()), [setState]);

    const value = useMemo<Store>(
        () => ({ patient: PATIENT, bookings: state.bookings, prefs: state.prefs, setPrefs, addBooking, reschedule, cancel, resetDemo }),
        [state, setPrefs, addBooking, reschedule, cancel, resetDemo],
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
    const v = useContext(Ctx);
    if (!v) throw new Error('useStore must be used inside <StoreProvider>');
    return v;
}

/** Lookup helpers shared by pages. */
export const getService = (id: string) => SERVICES.find((s) => s.id === id);
export const getDoctor = (id: string) => DOCTORS.find((d) => d.id === id);
export const getBranch = (id: string) => BRANCHES.find((b) => b.id === id);
