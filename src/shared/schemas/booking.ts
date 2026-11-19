import { z } from 'zod';

/**
 * Kenyan mobile numbers: 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, +2541XXXXXXXX
 * or 2547XXXXXXXX. Spaces and dashes are tolerated.
 */
export const KENYAN_PHONE = /^(?:\+?254|0)[17]\d{8}$/;
export const cleanPhone = (v: string) => v.replace(/[\s-]/g, '');

export const PAYMENT_METHODS = ['SHA', 'Insurance', 'M-Pesa', 'Cash'] as const;
export const VISITOR_TYPES = ['returning', 'new'] as const;

/** Booking request. Used by the form on the client and by the future POST /api/bookings. */
export const BookingFormSchema = z.object({
    fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
    phone: z
        .string()
        .trim()
        .refine((v) => KENYAN_PHONE.test(cleanPhone(v)), 'Use a Kenyan number like 0712 345 678 or +254 712 345 678.'),
    email: z.union([z.literal(''), z.string().trim().email('That email does not look right.')]),
    serviceId: z.string().min(1, 'Choose the service you need.'),
    doctorId: z.string(),
    branchId: z.string().min(1),
    slotStart: z
        .string()
        .min(1, 'Pick a day and time from the grid.')
        .refine((v) => new Date(v).getTime() > Date.now(), 'Please choose a time in the future.'),
    visitorType: z.enum(VISITOR_TYPES),
    paymentMethod: z.enum(PAYMENT_METHODS),
    reason: z.string().trim().max(240, 'Please keep this under 240 characters.'),
    consent: z.literal(true, { errorMap: () => ({ message: 'We need your consent to book your visit.' }) }),
});
export type BookingForm = z.infer<typeof BookingFormSchema>;

/** Contact message. */
export const ContactFormSchema = z.object({
    name: z.string().trim().min(2, 'Please enter your name.').max(120),
    phone: z
        .string()
        .trim()
        .refine((v) => KENYAN_PHONE.test(cleanPhone(v)), 'Use a Kenyan number like 0712 345 678.'),
    email: z.union([z.literal(''), z.string().trim().email('That email does not look right.')]),
    message: z.string().trim().min(5, 'Tell us a little more.').max(600),
    consent: z.literal(true, { errorMap: () => ({ message: 'Please tick the box so we can reply.' }) }),
});
export type ContactForm = z.infer<typeof ContactFormSchema>;
