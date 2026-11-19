import { zoned } from '@shared/time';
import type { Branch } from './demo-data';

const toMinutes = (hhmm: string) => {
    const [h = 0, m = 0] = hhmm.split(':').map(Number);
    return h * 60 + m;
};
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function clock12(hhmm: string): string {
    const [h = 0, m = 0] = hhmm.split(':').map(Number);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
}

/** Open right now, on the clinic's (Nairobi) clock. */
export function isBranchOpen(branch: Branch, at: Date = new Date()): boolean {
    const z = zoned(at);
    const mins = z.getHours() * 60 + z.getMinutes();
    return branch.hours.some(
        (h) => h.days.length > 0 && h.days.includes(z.getDay()) && mins >= toMinutes(h.open) && mins < toMinutes(h.close),
    );
}

/** Plain-language next opening, e.g. "Opens Monday at 7:30 am". */
export function nextOpenLabel(branch: Branch, at: Date = new Date()): string {
    const z = zoned(at);
    const mins = z.getHours() * 60 + z.getMinutes();
    for (let i = 0; i < 8; i++) {
        const dow = (z.getDay() + i) % 7;
        for (const h of branch.hours) {
            if (h.days.length === 0 || !h.days.includes(dow)) continue;
            if (i === 0 && mins >= toMinutes(h.open)) continue;
            return `Opens ${i === 0 ? 'today' : DAY_NAMES[dow]} at ${clock12(h.open)}`;
        }
    }
    return 'Please call to check hours';
}
