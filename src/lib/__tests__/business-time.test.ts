// Hardened variant of business-time.test.ts: same coverage, but WITHOUT
// mutating process.env.TZ. The original suite flips the process timezone per
// test to simulate viewers in India / UTC / Los Angeles. That mechanism is
// pool-dependent: it works under vitest's `forks` pool (process per file), is
// silently ignored under `threads` (V8 caches the zone per worker isolate),
// and is dead on arrival on Windows (Node only reads TZ at startup there).
// On some Node/pool combinations the mid-run flips even wedge the worker,
// surfacing as "Test timed out in 5000ms" on the first mutating test. Every
// assertion here is deterministic: the helpers take the business zone
// explicitly, and the one contrast that needs a second clock is derived from
// this process's own offset instead of assuming one.
import { describe, expect, it } from 'vitest';

import { atTime, dayKey, formatDay, formatTime, startOfZonedDay, zoned } from '@shared/time';

const studio = 'America/Chicago';
const AT_0630 = atTime('2026-10-23T15:00:00Z', '06:30', studio).toISOString();

describe('@shared/time', () => {
    it('atTime gives the same instant on a browser in India and on a UTC server', () => {
        // 2026-10-23T15:00:00Z is 10:00 AM CDT in the studio; 06:30 studio
        // wall-clock that day is 11:30Z. The exact pin IS the invariance proof:
        // the helper never reads the viewer's clock, so nothing running the
        // suite can move it. (To watch the original three-zone comparison live,
        // run the whole suite once per system zone — TZ=Asia/Kolkata vitest
        // run, then TZ=UTC vitest run on POSIX shells, or cross-env TZ=UTC on
        // Windows — each process sees one stable clock.)
        expect(AT_0630).toBe('2026-10-23T11:30:00.000Z'); // 06:30 CDT
    });

    it('setHours is the bug: it moves with the clock running the code', () => {
        // `setHours` builds the VIEWER's 06:30 — the original 2026-10-21 bug. A
        // previous revision pinned atTime's output for the buggy Date, which
        // silently assumed a runner west of Chicago's offset; and its first
        // fix still hard-coded the anchor's local date, which rolls over to
        // Oct 24 for runners at UTC+9 and east (Asia/Tokyo: 15:00Z is already
        // next day). Every expectation below is derived from the local date
        // and offset this process actually runs on — deterministic anywhere.
        const anchor = new Date('2026-10-23T15:00:00Z');
        const buggy = new Date('2026-10-23T15:00:00Z');
        buggy.setHours(6, 30, 0, 0);

        // setHours pinned the runner's OWN 06:30 on the anchor's LOCAL date:
        const local0630 = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 6, 30);
        expect(buggy.toISOString()).toBe(local0630.toISOString());

        // The studio's 06:30 that day is 11:30Z (CDT). The buggy instant
        // coincides with it exactly when the runner's clock already sits on
        // Chicago's offset — the bug is invisible there, visible everywhere
        // else. Chicago's own offset comes from atTime, so the check follows
        // the helper's answer rather than a hard-coded UTC-5.
        const studioOffsetMin = Math.round(
            (atTime('2026-10-23', '06:30', studio).getTime() - Date.UTC(2026, 9, 23, 6, 30)) / 60000,
        );
        expect(buggy.toISOString() === AT_0630).toBe(local0630.getTimezoneOffset() === studioOffsetMin);
    });

    it('formatTime and formatDay read the business clock, not the viewer', () => {
        const c = atTime('2026-10-23T15:00:00Z', '06:30', studio);
        expect(formatTime(c, undefined, studio)).toBe('6:30 AM');
        expect(formatTime(c.toISOString(), 'HH:mm', studio)).toBe('06:30');
        expect(formatDay(c, 'EEEE', studio)).toBe('Friday');
    });

    it('a late class stays on its own day, not the viewer tomorrow', () => {
        const late = atTime('2026-10-23T15:00:00Z', '21:00', studio); // 02:00Z on the 24th
        expect(dayKey(late, studio)).toBe('2026-10-23');
        expect(late.toISOString().slice(0, 10)).toBe('2026-10-24');
    });

    it('the business day starts at its own midnight', () => {
        expect(startOfZonedDay('2026-10-23T03:00:00Z', studio).toISOString()).toBe(
            '2026-10-22T05:00:00.000Z',
        );
    });

    it('keeps wall-clock times across a DST change', () => {
        const before = atTime('2026-10-31T15:00:00Z', '06:30', studio);
        const after = atTime('2026-11-02T15:00:00Z', '06:30', studio);
        expect(formatTime(before, 'HH:mm', studio)).toBe('06:30');
        expect(formatTime(after, 'HH:mm', studio)).toBe('06:30');
        expect(after.getTime() - before.getTime()).toBe((2 * 24 + 1) * 3600_000);
    });

    it('zoned date-fns style getters work on the business calendar', () => {
        const z = zoned('2026-10-23T11:30:00Z', studio);
        expect([z.getDate(), z.getHours(), z.getMinutes()]).toEqual([23, 6, 30]);
    });

    it('rejects a malformed time instead of building Invalid Date', () => {
        expect(() => atTime(new Date(), '6.30', studio)).toThrow(/bad time/);
    });
});
