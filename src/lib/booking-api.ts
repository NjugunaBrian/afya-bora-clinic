import type { BookingForm } from '@shared/schemas';

/**
 * PLACEHOLDER form endpoint. Replace with your Formspree form
 * (https://formspree.io/f/<your-id>) or, later, your own POST /api/bookings.
 * The booking is always kept on this device; the POST is a best-effort copy for
 * the front desk. Phase 2 swaps this for the real bookings API.
 */
export const FORM_ENDPOINT = 'https://formspree.io/f/your-form-id';

export async function sendToFormEndpoint(payload: BookingForm & { ref?: string }): Promise<{ delivered: boolean }> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
        const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
            signal: ctrl.signal,
        });
        return { delivered: res.ok };
    } catch {
        return { delivered: false };
    } finally {
        clearTimeout(timer);
    }
}
