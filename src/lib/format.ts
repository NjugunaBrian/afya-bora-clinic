import { formatDay, formatTime } from '@shared/time';

const kes = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });
/** KES money, e.g. "KES 4,500" (always the KES code, never "Ksh"). */
export const formatKES = (n: number) => `KES ${kes.format(n)}`;

/** "Thu 12 Nov, 4:30 PM" on the clinic's (Nairobi) clock. */
export const formatVisit = (d: Date | string) => `${formatDay(d, 'EEE d MMM')}, ${formatTime(d)}`;

/** Clinic WhatsApp number, digits only (placeholder: replace with the real line). */
export const WHATSAPP_NUMBER = '254710268389';
export const EMERGENCY_NUMBER = '0720 555 014';
export const EMERGENCY_TEL = 'tel:+254720555014';
export const CLINIC_PHONE = '+254 710 268 389';
export const CLINIC_EMAIL = 'care@afyabora.co.ke';

export function waLink(text = "Hello, I'd like to book an appointment") {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
