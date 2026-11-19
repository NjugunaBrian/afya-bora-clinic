import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Clock, Loader2, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { formatDay, formatTime } from '@shared/time';
import { BookingFormSchema, PAYMENT_METHODS, type BookingForm } from '@shared/schemas';

import { Seo } from '@/components/site/Seo';
import { PageBanner } from '@/components/site/PageBanner';
import { JourneyBar } from '@/components/site/JourneyBar';
import { SlotPicker } from '@/components/book/SlotPicker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { BRANCHES, DOCTORS, SERVICES, type Booking } from '@/lib/demo-data';
import { sendToFormEndpoint } from '@/lib/booking-api';
import { EMERGENCY_NUMBER, EMERGENCY_TEL, formatKES, formatVisit, waLink } from '@/lib/format';
import { doctorsFor } from '@/lib/slots';
import { getBranch, getDoctor, getService, useStore } from '@/lib/store';

const ANY = 'any';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

function whatsappText(b: Booking, fullName: string) {
  const svc = getService(b.serviceId);
  const doc = getDoctor(b.doctorId);
  return [
    "Hello Afya Bora, I'd like to confirm this booking request:",
    `Reference: ${b.ref}`,
    `Name: ${fullName}`,
    `Service: ${svc?.name ?? ''}`,
    `Doctor: ${doc?.name ?? 'Any available doctor'}`,
    `When: ${formatVisit(b.start)}`,
    `Branch: ${getBranch(b.branchId)?.name ?? ''}`,
    `Payment: ${b.payment}`,
    b.reason ? `Reason: ${b.reason}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function BookPage() {
  const { bookings, prefs, setPrefs, addBooking } = useStore();
  const [params] = useSearchParams();
  const [done, setDone] = useState<{ booking: Booking; delivered: boolean; fullName: string } | null>(null);

  // Deep links: /book?service=s-dental-check&doctor=d-halima
  const qService = params.get('service') ?? '';
  const qDoctor = params.get('doctor') ?? '';
  useEffect(() => {
    if (qService || qDoctor) {
      const doc = DOCTORS.find((d) => d.id === qDoctor);
      setPrefs({
        ...(qService && SERVICES.some((s) => s.id === qService) ? { serviceId: qService } : {}),
        ...(doc ? { doctorId: doc.id, branchId: doc.branchId } : {}),
      });
    }
  }, [qService, qDoctor, setPrefs]);

  const form = useForm<BookingForm>({
    resolver: zodResolver(BookingFormSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      serviceId: qService || prefs.serviceId || '',
      doctorId: qDoctor || prefs.doctorId || '',
      branchId: prefs.branchId,
      slotStart: '',
      visitorType: 'returning',
      paymentMethod: 'SHA',
      reason: '',
      consent: false as unknown as true,
    },
  });
  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const serviceId = watch('serviceId');
  const doctorId = watch('doctorId');
  const branchId = watch('branchId');
  const slotStart = watch('slotStart');

  // Keep the form's choices in the shared store so other screens remember them.
  useEffect(() => {
    setPrefs({ serviceId, doctorId, branchId: branchId as 'nairobi' | 'nyeri' });
  }, [serviceId, doctorId, branchId, setPrefs]);

  const doctorOptions = useMemo(() => doctorsFor({ serviceId, branchId }), [serviceId, branchId]);
  const service = getService(serviceId);
  const doctor = doctorId ? getDoctor(doctorId) : undefined;

  const mutation = useMutation({
    mutationFn: async (values: BookingForm) => {
      const booking = addBooking(values);
      const { delivered } = await sendToFormEndpoint({ ...values, ref: booking.ref });
      return { booking, delivered, fullName: values.fullName };
    },
    onSuccess: (res) => {
      setDone(res);
      toast.success(`Request sent: ${res.booking.ref}`, { description: 'We will confirm by phone or WhatsApp.' });
      window.scrollTo({ top: 0 });
    },
    onError: () => toast.error('Something went wrong. Please try again or message us on WhatsApp.'),
  });

  function clearSlot() {
    setValue('slotStart', '', { shouldValidate: false });
  }

  if (done) {
    const { booking, delivered, fullName } = done;
    const svc = getService(booking.serviceId);
    const doc = getDoctor(booking.doctorId);
    const br = getBranch(booking.branchId);
    return (
      <>
        <Seo title="Booking request sent | Afya Bora Clinic" description="Your appointment request is in. Send it on WhatsApp to speed up confirmation." noindex />
        <PageBanner title="Request sent" description="Thank you. Our front desk will confirm by phone or WhatsApp." image="/assets/reception.png" alt="A family checking in at the Afya Bora reception desk" />
        <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <div className="rounded-3xl bg-card p-6 shadow-md md:p-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-7 w-7 shrink-0 text-primary-ink" aria-hidden="true" />
              <div>
                <h2 className="font-heading text-2xl font-bold">You are booked in, {fullName.split(' ')[0]}</h2>
                <p className="text-muted-foreground">
                  Reference <span className="font-mono font-semibold text-foreground">{booking.ref}</span> · Status: Requested
                </p>
              </div>
            </div>
            <dl className="mt-6 grid gap-4 rounded-2xl bg-muted/60 p-4 sm:grid-cols-2">
              {[
                ['Service', svc?.name],
                ['Doctor', doc?.name ?? 'Any available doctor'],
                ['When', formatVisit(booking.start)],
                ['Where', br?.name],
                ['Payment', booking.payment],
                ['Price from', svc?.priceFrom ? formatKES(svc.priceFrom) : 'Ask us'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">What happens next</p>
              <JourneyBar active={1} showBlurb />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              {delivered
                ? 'Your request has reached our front desk.'
                : 'Your request is saved in My Visits. The online form service is not connected yet, so please also send it on WhatsApp to be sure.'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={waLink(whatsappText(booking, fullName))} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> Send on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/visits">See it in My Visits</Link>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => { setDone(null); form.reset(); }}>
                Book another visit
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const submitting = mutation.isPending;

  return (
    <>
      <Seo title="Book an appointment | Afya Bora Clinic" description="Pick a doctor and a time that suits you. See open slots, KES prices and send your request in under a minute." />
      <PageBanner
        title="Book Your Appointment"
        description="Choose a service, pick a time, and we will confirm by phone or WhatsApp. It takes about a minute."
        image="/assets/hero-doctor.png"
        alt="A friendly Kenyan doctor talking with a patient"
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate aria-label="Appointment request" className="flex min-w-0 flex-col gap-8">
          <JourneyBar active={0} className="max-w-md" />

          <fieldset className="min-w-0 grid gap-5 sm:grid-cols-2">
            <legend className="mb-3 font-heading text-xl font-bold">1. What do you need?</legend>
            <div className="sm:col-span-2">
              <Label htmlFor="serviceId">Service</Label>
              <Controller
                control={control}
                name="serviceId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      const ok = doctorsFor({ serviceId: v, branchId }).some((d) => d.id === doctorId);
                      if (doctorId && !ok) setValue('doctorId', '');
                      clearSlot();
                    }}
                  >
                    <SelectTrigger id="serviceId" aria-invalid={!!errors.serviceId} aria-describedby="serviceId-err">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}{s.priceFrom ? ` · from ${formatKES(s.priceFrom)}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError id="serviceId-err" message={errors.serviceId?.message} />
              {service ? (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> About {service.durationMin} minutes. Bring: {service.bring.toLowerCase()}.
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="branchId">Branch</Label>
              <Controller
                control={control}
                name="branchId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      if (doctor && doctor.branchId !== v) setValue('doctorId', '');
                      clearSlot();
                    }}
                  >
                    <SelectTrigger id="branchId"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="doctorId">Preferred doctor (optional)</Label>
              <Controller
                control={control}
                name="doctorId"
                render={({ field }) => (
                  <Select
                    value={field.value || ANY}
                    onValueChange={(v) => {
                      const id = v === ANY ? '' : v;
                      field.onChange(id);
                      const d = DOCTORS.find((x) => x.id === id);
                      if (d) setValue('branchId', d.branchId);
                      clearSlot();
                    }}
                  >
                    <SelectTrigger id="doctorId"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ANY}>Any available doctor</SelectItem>
                      {doctorOptions.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {doctorOptions.length === 0 && serviceId ? (
                <p className="mt-2 text-sm text-muted-foreground">No doctor for this service at this branch. Try the other branch.</p>
              ) : null}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-1 font-heading text-xl font-bold">2. Pick a day and time</legend>
            <p className="mb-3 text-sm text-muted-foreground">
              Open times for {doctor ? doctor.name : 'all doctors'} {service ? `· ${service.name}` : ''} at {getBranch(branchId)?.name}.
            </p>
            <Controller
              control={control}
              name="slotStart"
              render={({ field }) => (
                <SlotPicker
                  serviceId={serviceId || undefined}
                  doctorId={doctorId || undefined}
                  branchId={branchId}
                  bookings={bookings}
                  value={field.value}
                  invalid={!!errors.slotStart}
                  onChange={(s) => field.onChange(s.start)}
                />
              )}
            />
            <FieldError id="slot-err" message={errors.slotStart?.message} />
            {slotStart ? (
              <p className="mt-2 text-sm font-semibold text-primary-ink">
                Selected: {formatDay(slotStart, 'EEEE d MMMM')} at {formatTime(slotStart)}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="min-w-0 grid gap-5 sm:grid-cols-2">
            <legend className="mb-3 font-heading text-xl font-bold">3. About you</legend>
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby="fullName-err" {...register('fullName')} />
              <FieldError id="fullName-err" message={errors.fullName?.message} />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Kenyan number)</Label>
              <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678" aria-invalid={!!errors.phone} aria-describedby="phone-err" {...register('phone')} />
              <FieldError id="phone-err" message={errors.phone?.message} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-err" {...register('email')} />
              <FieldError id="email-err" message={errors.email?.message} />
            </div>
            <div>
              <Label id="visitor-label">Have you visited us before?</Label>
              <Controller
                control={control}
                name="visitorType"
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} aria-labelledby="visitor-label" className="mt-2 flex gap-5">
                    <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="returning" /> Yes, returning</label>
                    <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="new" /> No, first time</label>
                  </RadioGroup>
                )}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">How will you pay?</Label>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((p) => <SelectItem key={p} value={p}>{p === 'SHA' ? 'SHA' : p === 'Insurance' ? 'Private insurance' : p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="reason">Reason for visit (a short line is enough)</Label>
              <Textarea id="reason" rows={3} placeholder="For example: cough for one week" aria-invalid={!!errors.reason} aria-describedby="reason-err" {...register('reason')} />
              <FieldError id="reason-err" message={errors.reason?.message} />
              <p className="mt-1 text-xs text-muted-foreground">Please do not share detailed medical history here. Your doctor will ask in person.</p>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-start gap-3">
                <Controller
                  control={control}
                  name="consent"
                  render={({ field }) => (
                    <Checkbox
                      id="consent"
                      checked={field.value === true}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      aria-describedby="consent-err"
                      aria-invalid={!!errors.consent}
                      className="mt-0.5"
                    />
                  )}
                />
                <Label htmlFor="consent" className="text-sm font-normal leading-snug">
                  I agree that Afya Bora Clinic may use these details to arrange my visit, as explained in the{' '}
                  <Link to="/contact#privacy" className="font-semibold text-primary-ink underline">privacy notice</Link>.
                </Label>
              </div>
              <FieldError id="consent-err" message={errors.consent?.message} />
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" disabled={submitting} className="sm:min-w-56">
              {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {submitting ? 'Sending your request…' : 'Request appointment'}
            </Button>
            <p className="text-sm text-muted-foreground">No payment now. You pay at the clinic.</p>
          </div>
        </form>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start" aria-label="Before you book">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-heading text-lg font-bold"><Clock className="h-4 w-4 text-primary-ink" aria-hidden="true" /> Opening hours</h2>
            <ul className="text-sm text-muted-foreground">
              <li>Mon – Fri: 7:30 am – 7 pm</li>
              <li>Saturday: 8 am – 4 pm</li>
              <li>Sunday: 9 am – 1 pm</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="mb-2 font-heading text-lg font-bold">What happens next</h2>
            <p className="text-sm text-muted-foreground">We confirm by phone or WhatsApp within 2 hours in opening times. You can change or cancel anytime in My Visits.</p>
          </div>
          <div className="rounded-2xl bg-accent p-5">
            <h2 className="mb-1 flex items-center gap-2 font-heading text-lg font-bold"><Phone className="h-4 w-4" aria-hidden="true" /> In an emergency</h2>
            <p className="text-sm">Do not book online. Call <a href={EMERGENCY_TEL} className="font-bold text-primary-ink underline">{EMERGENCY_NUMBER}</a> or go to the nearest hospital.</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-heading text-lg font-bold"><ShieldCheck className="h-4 w-4 text-primary-ink" aria-hidden="true" /> Your privacy</h2>
            <p className="text-sm text-muted-foreground">We keep your details private under Kenya&apos;s Data Protection Act, 2019, and only use them to arrange your care.</p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default BookPage;
