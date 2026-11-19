import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarX2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { atTime, formatTime } from '@shared/time';

import { Seo } from '@/components/site/Seo';
import { PageBanner } from '@/components/site/PageBanner';
import { SocialIcons } from '@/components/site/SocialIcons';
import { ContactForm } from '@/components/contact/ContactForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { BRANCHES, type BranchId } from '@/lib/demo-data';
import { EMERGENCY_NUMBER, EMERGENCY_TEL, waLink } from '@/lib/format';
import { isBranchOpen, nextOpenLabel } from '@/lib/branch-hours';
import { cn } from '@/lib/utils';

const REF_DATE = new Date();

/** Clinic-clock time label, e.g. "7:30 AM". */
function fmt(hhmm: string): string {
    return formatTime(atTime(REF_DATE, hhmm));
}

/** Pin positions inside the map panel. Full class strings so Tailwind keeps them. */
const PINS: Record<BranchId, { pos: string }> = {
    nairobi: { pos: 'top-[34%] left-[66%]' },
    nyeri: { pos: 'top-[64%] left-[30%]' },
};

const CLINIC_EMAIL = 'hello@afyaboraclinic.co.ke';

export function ContactPage() {
    const [selectedId, setSelectedId] = useState<BranchId>(BRANCHES[0]?.id ?? 'nairobi');
    const selected = BRANCHES.find((b) => b.id === selectedId) ?? BRANCHES[0];

    return (
        <>
            <Seo
                title="Contact Afya Bora Clinic | Nairobi and Nyeri"
                description="Call, message on WhatsApp or visit our Nairobi (Kasarani) and Nyeri branches. See opening hours, directions and our emergency number."
            />
            <PageBanner
                title="Get in Touch"
                description="Ask a question, check a price or tell us how we can help."
                image="/assets/reception.png"
                alt="The Afya Bora reception desk, ready to welcome visitors"
            />

            <section className="mx-auto max-w-7xl px-4 pt-10 md:px-6 md:pt-12">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Our branches</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Two clinics, one standard of care</h2>

                {BRANCHES.length === 0 || !selected ? (
                    <div className="mt-8">
                        <EmptyState
                            icon={CalendarX2}
                            title="Branch details are not available"
                            description="Please call the front desk and we will give you directions."
                            action={
                                <Button asChild variant="outline">
                                    <a href={EMERGENCY_TEL}>
                                        <Phone aria-hidden="true" /> Call {EMERGENCY_NUMBER}
                                    </a>
                                </Button>
                            }
                        />
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
                        {/* FOCAL: stylised map with branch pins */}
                        <div className="flex flex-col gap-3">
                            <div className="relative h-80 overflow-hidden rounded-3xl bg-muted shadow-sm md:h-[26rem]">
                                <iframe
                                    key={selectedId}
                                    title={`Map of the ${selected.name} branch`}
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(selected.mapQuery)}&output=embed`}
                                    className="absolute inset-0 h-full w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{selected.name}</span>
                                </p>
                                <Button asChild variant="outline" size="sm">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.mapQuery)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MapPin aria-hidden="true" /> Directions – {selected.area.replace(' Town', '')}
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* LIST: selectable branch cards */}
                        <ul className="flex flex-col gap-4">
                            {BRANCHES.map((b) => {
                                const on = b.id === selected.id;
                                const open = isBranchOpen(b);
                                return (
                                    <li
                                        key={b.id}
                                        className={cn(
                                            'flex flex-col gap-4 rounded-3xl p-5 transition-[background-color,box-shadow] duration-fast',
                                            on ? 'bg-accent shadow-md' : 'bg-card shadow-sm',
                                        )}
                                    >
                                        <button
                                            type="button"
                                            aria-pressed={on}
                                            onClick={() => setSelectedId(b.id)}
                                            className="flex w-full items-start justify-between gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <span className="min-w-0">
                                                <span className="block font-heading text-lg font-bold leading-tight">{b.name}</span>
                                                <span className="mt-1 block text-sm text-muted-foreground">{b.address}</span>
                                            </span>
                                            <Badge variant={open ? 'default' : 'secondary'} className="shrink-0 gap-1">
                                                <Clock className="h-3 w-3" aria-hidden="true" />
                                                {open ? 'Open now' : 'Closed now'}
                                            </Badge>
                                        </button>

                                        {!open ? (
                                            <p className="text-sm font-semibold text-primary-ink">{nextOpenLabel(b)}</p>
                                        ) : null}

                                        <a
                                            href={`tel:${b.phone.replace(/\s/g, '')}`}
                                            className="inline-flex items-center gap-2 font-mono text-sm font-semibold tabular-nums text-primary-ink hover:underline"
                                        >
                                            <Phone className="h-4 w-4" aria-hidden="true" /> {b.phone}
                                        </a>

                                        <div>
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opening hours</p>
                                            <ul className="flex flex-col gap-1.5 text-sm">
                                                {b.hours.map((h) => (
                                                    <li key={h.label} className="flex items-center justify-between gap-3">
                                                        <span className="text-muted-foreground">{h.label}</span>
                                                        <span className="font-mono font-medium tabular-nums">
                                                            {h.days.length === 0 ? 'Closed' : `${fmt(h.open)} – ${fmt(h.close)}`}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-3xl bg-card p-6 shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Send a message</p>
                    <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">We reply within one working day</h2>
                    <p className="mb-6 mt-2 text-sm text-muted-foreground">
                        For an urgent need, call or use WhatsApp instead. Please do not share detailed medical history in this form.
                    </p>
                    <ContactForm />
                </div>

                <aside className="flex flex-col gap-6">
                    <div className="rounded-3xl bg-accent p-6">
                        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
                            <Phone className="h-5 w-5" aria-hidden="true" /> Emergency
                        </h2>
                        <p className="mt-2 text-sm">In an emergency call this number or go to the nearest hospital.</p>
                        <a
                            href={EMERGENCY_TEL}
                            className="mt-3 block font-mono text-2xl font-semibold tabular-nums text-primary-ink hover:underline"
                        >
                            {EMERGENCY_NUMBER}
                        </a>
                    </div>

                    <div className="flex flex-col gap-4 rounded-3xl bg-card p-6 shadow-sm">
                        <h2 className="font-heading text-lg font-bold">Quick chat</h2>
                        <p className="text-sm text-muted-foreground">Message our front desk on WhatsApp. We reply in opening hours.</p>
                        <Button asChild size="lg" className="self-start">
                            <a href={waLink('Hello Afya Bora, I have a question.')} target="_blank" rel="noreferrer">
                                <MessageCircle aria-hidden="true" /> Chat on WhatsApp
                            </a>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-3xl bg-card p-6 shadow-sm">
                        <h2 className="font-heading text-lg font-bold">Email and phone</h2>
                        <a href={`mailto:${CLINIC_EMAIL}`} className="flex items-center gap-2 text-sm font-semibold text-primary-ink hover:underline">
                            <Mail className="h-4 w-4" aria-hidden="true" /> {CLINIC_EMAIL}
                        </a>
                        {BRANCHES.map((b) => (
                            <a
                                key={b.id}
                                href={`tel:${b.phone.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 text-sm font-semibold text-primary-ink hover:underline"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" /> {b.area}: {b.phone}
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 rounded-3xl bg-card p-6 shadow-sm">
                        <h2 className="font-heading text-lg font-bold">Follow us</h2>
                        <SocialIcons />
                    </div>
                </aside>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
                <div className="flex flex-col gap-4 rounded-3xl bg-muted/60 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-heading text-lg font-bold">Before you visit</h2>
                        <p className="text-sm text-muted-foreground">Check prices and insurance, or see your bookings.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild variant="outline">
                            <Link to="/fees">
                                Fees and insurance <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/visits">
                                My Visits <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ContactPage;
