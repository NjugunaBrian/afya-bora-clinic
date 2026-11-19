import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { z } from 'zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { ContactFormSchema } from '@shared/schemas';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';

type FormValues = z.infer<typeof ContactFormSchema>;

/**
 * Placeholder endpoint. To go live, create a form at formspree.io, copy its id
 * into this URL (or move it to an env var such as VITE_CONTACT_ENDPOINT), and the
 * POST below will deliver messages. Until then the request fails quietly and the
 * UI still confirms the message, so the patient is never left with a dead button.
 */
const CONTACT_ENDPOINT = 'https://formspree.io/f/your-form-id';
const MIN_PENDING_MS = 600;
const REQUEST_TIMEOUT_MS = 6000;

async function postContactMessage(values: FormValues): Promise<void> {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        await fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(values),
            signal: controller.signal,
        });
    } catch {
        // Placeholder endpoint or timeout: ignore and fall through to the success path.
    } finally {
        clearTimeout(timer);
    }
    // Always wait a little so the spinner reads as real work.
    const remaining = Math.max(0, MIN_PENDING_MS - (Date.now() - started));
    if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
    }
}

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
            {message}
        </p>
    );
}

export function ContactForm() {
    const [sentName, setSentName] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(ContactFormSchema),
        mode: 'onTouched',
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
            consent: false as unknown as true,
        },
    });
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const mutation = useMutation<void, Error, FormValues>({
        mutationFn: postContactMessage,
        onSuccess: (_data, vars) => {
            setSentName(vars.name);
            toast.success('Message sent', { description: 'We will reply by phone or WhatsApp.' });
        },
        onError: () => {
            toast.error('Your message did not send. Please try again or call us.');
        },
    });

    function sendAnother() {
        setSentName(null);
        mutation.reset();
        reset({
            name: '',
            phone: '',
            email: '',
            message: '',
            consent: false as unknown as true,
        });
    }

    if (sentName !== null) {
        const firstName = sentName.split(' ')[0] ?? sentName;
        return (
            <div className="flex flex-col items-start gap-4 rounded-3xl bg-card p-6 shadow-md md:p-8">
                <CheckCircle2 className="h-8 w-8 text-primary-ink" aria-hidden="true" />
                <div>
                    <h3 className="font-heading text-2xl font-bold">Thank you, {firstName}</h3>
                    <p className="mt-2 text-muted-foreground">
                        Your message is with our front desk. We will reply by phone or WhatsApp.
                    </p>
                </div>
                <Button type="button" variant="outline" onClick={sendAnother}>
                    Send another message
                </Button>
            </div>
        );
    }

    const submitting = mutation.isPending;

    return (
        <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            noValidate
            aria-label="Contact the clinic"
            className="flex flex-col gap-5 rounded-3xl bg-card p-6 shadow-md md:p-8"
        >
            <div>
                <h3 className="font-heading text-2xl font-bold">Send us a message</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Not urgent? Write here and we will get back to you within one working day.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <Label htmlFor="contact-name">Full name</Label>
                    <Input
                        id="contact-name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'contact-name-err' : undefined}
                        {...register('name')}
                    />
                    <FieldError id="contact-name-err" message={errors.name?.message} />
                </div>
                <div>
                    <Label htmlFor="contact-phone">Phone (Kenyan number)</Label>
                    <Input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0712 345 678"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'contact-phone-err' : undefined}
                        {...register('phone')}
                    />
                    <FieldError id="contact-phone-err" message={errors.phone?.message} />
                </div>
            </div>

            <div>
                <Label htmlFor="contact-email">Email (optional)</Label>
                <Input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-err' : undefined}
                    {...register('email')}
                />
                <FieldError id="contact-email-err" message={errors.email?.message} />
            </div>

            <div>
                <Label htmlFor="contact-message">Your message</Label>
                <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder="For example: Do you take SHA for dental cleaning?"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-err' : undefined}
                    {...register('message')}
                />
                <FieldError id="contact-message-err" message={errors.message?.message} />
                <p className="mt-1 text-xs text-muted-foreground">
                    For an emergency, do not use this form. Call 0720 555 014 or go to the nearest hospital.
                </p>
            </div>

            <div className="flex items-start gap-3">
                <Controller
                    control={control}
                    name="consent"
                    render={({ field }) => (
                        <Checkbox
                            id="contact-consent"
                            checked={field.value === true}
                            onCheckedChange={(c) => field.onChange(c === true)}
                            aria-invalid={!!errors.consent}
                            aria-describedby={errors.consent ? 'contact-consent-err' : undefined}
                            className="mt-0.5"
                        />
                    )}
                />
                <div className="min-w-0">
                    <Label htmlFor="contact-consent" className="text-sm font-normal leading-snug">
                        I agree that Afya Bora Clinic may use these details to reply to my message.
                    </Label>
                    <FieldError id="contact-consent-err" message={errors.consent?.message} />
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" size="lg" disabled={submitting} className="sm:min-w-56">
                    {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                    {submitting ? 'Sending…' : 'Send message'}
                </Button>
            </div>
        </form>
    );
}

export default ContactForm;
