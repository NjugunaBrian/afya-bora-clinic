import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { zoned } from '@shared/time';

import { PageBanner } from '@/components/site/PageBanner';
import { JourneyBar } from '@/components/site/JourneyBar';
import { Seo } from '@/components/site/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ACCREDITATIONS, BRANCHES, LICENCE, VALUES, type Branch } from '@/lib/demo-data';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toMinutes(hhmm: string): number {
    const [h = 0, m = 0] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

function clock12(hhmm: string): string {
    const [h = 0, m = 0] = hhmm.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Open right now on the Nairobi clock. */
function isBranchOpen(branch: Branch, at: Date): boolean {
    const z = zoned(at);
    const day = z.getDay();
    const mins = z.getHours() * 60 + z.getMinutes();
    return branch.hours.some(
        (h) => h.days.length > 0 && h.days.includes(day) && mins >= toMinutes(h.open) && mins < toMinutes(h.close),
    );
}

/** Plain-language next opening, e.g. "Opens Monday at 7:30 am". */
function nextOpenLabel(branch: Branch, at: Date): string {
    const z = zoned(at);
    const base = z.getDay();
    const mins = z.getHours() * 60 + z.getMinutes();
    for (let i = 0; i < 7; i++) {
        const dow = (base + i) % 7;
        for (const h of branch.hours) {
            if (h.days.length === 0 || !h.days.includes(dow)) continue;
            if (i === 0 && mins >= toMinutes(h.open)) continue;
            return `Opens ${i === 0 ? 'today' : DAY_NAMES[dow]} at ${clock12(h.open)}`;
        }
    }
    return 'Please call to check hours';
}

function BranchPanel({ branch, now }: { branch: Branch; now: Date }) {
    const open = isBranchOpen(branch, now);
    return (
        <div className="grid gap-6 rounded-3xl bg-card p-6 shadow-sm md:grid-cols-2 md:p-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={open ? 'default' : 'outline'}>{open ? 'Open now' : 'Closed now'}</Badge>
                    {!open ? <span className="text-sm text-muted-foreground">{nextOpenLabel(branch, now)}</span> : null}
                </div>
                <p className="flex items-start gap-2 text-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
                    {branch.address}
                </p>
                <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
                    <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="font-mono font-semibold tabular-nums text-primary-ink underline-offset-4 hover:underline">
                        {branch.phone}
                    </a>
                </p>
            </div>
            <div>
                <h3 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
                    <Clock className="h-4 w-4 text-primary-ink" aria-hidden="true" /> Opening hours
                </h3>
                <ul className="flex flex-col gap-3">
                    {branch.hours.map((h) => (
                        <li key={h.label} className="flex items-center justify-between gap-3">
                            <span className="font-semibold">{h.label}</span>
                            {h.days.length === 0 ? (
                                <span className="text-muted-foreground">Closed</span>
                            ) : (
                                <span className="font-mono tabular-nums text-muted-foreground">
                                    {clock12(h.open)} – {clock12(h.close)}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export function AboutPage() {
    const [now] = useState(() => new Date());

    return (
        <>
            <Seo
                title="About us | Afya Bora Clinic"
                description="Learn about Afya Bora Clinic, our mission, our licensed team and our branches in Nairobi (Kasarani) and Nyeri."
            />
            <PageBanner
                title="About Afya Bora Clinic"
                description="Caring for you and your family, since 2014, with doctors who take the time to explain."
                image="/assets/team.png"
                alt="The Afya Bora Clinic team standing together in the clinic"
            />

            <div className="mx-auto max-w-4xl px-4 md:px-6">
                {/* Mission beside founder portrait */}
                <section className="reveal py-12 md:py-16" aria-labelledby="mission-heading">
                    <div className="grid items-center gap-8 md:grid-cols-5">
                        <div className="md:col-span-3">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Our mission</p>
                            <h2 id="mission-heading" className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">
                                Good care should feel calm, clear and close to home.
                            </h2>
                            <p className="mt-5 text-xl leading-relaxed text-foreground">
                                Our mission is simple. We give every patient and family quality care close to home. We explain each step in plain words. We show you the price before you come in. Nobody should leave a visit feeling confused or afraid.
                            </p>
                        </div>
                        <figure className="md:col-span-2">
                            <img
                                src="/assets/dr-wanjiku.png"
                                alt="Dr. Wanjiku Kariuki, lead family doctor"
                                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-md"
                                loading="lazy"
                            />
                            <figcaption className="mt-3 text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">Dr. Wanjiku Kariuki</span>, lead family doctor
                            </figcaption>
                        </figure>
                    </div>
                </section>

                {/* Values as numbered list */}
                <section className="reveal py-12 md:py-16" aria-labelledby="values-heading">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">What we value</p>
                    <h2 id="values-heading" className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">
                        Four promises we keep every day
                    </h2>
                    <ol className="mt-8 flex flex-col gap-6">
                        {VALUES.map((v, i) => (
                            <li key={v.title} className="flex gap-5">
                                <span className="font-mono text-2xl font-semibold tabular-nums text-primary-ink">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 className="font-heading text-lg font-bold">{v.title}</h3>
                                    <p className="text-muted-foreground">{v.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Licence and accreditation */}
                <section className="reveal py-12 md:py-16" aria-labelledby="licence-heading">
                    <div className="rounded-3xl bg-card p-6 shadow-sm md:p-8">
                        <div className="flex items-start gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent">
                                <ShieldCheck className="h-5 w-5 text-primary-ink" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 id="licence-heading" className="font-heading text-xl font-bold">Licence and accreditation</h2>
                                <p className="mt-1 text-muted-foreground">
                                    Licensed by the Kenya Medical Practitioners and Dentists Board.
                                </p>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground">Licence number</p>
                        <p className="font-mono text-lg font-semibold tabular-nums">{LICENCE}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {ACCREDITATIONS.map((a) => (
                                <li key={a}>
                                    <Badge variant="secondary">{a}</Badge>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-xs text-muted-foreground">Accreditation badges are placeholders to confirm.</p>
                    </div>
                </section>

                {/* Care journey */}
                <section className="reveal py-12 md:py-16" aria-labelledby="journey-heading">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Your care journey</p>
                    <h2 id="journey-heading" className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">
                        What to expect, step by step
                    </h2>
                    <p className="mt-2 text-muted-foreground">Four simple steps from your first call to your next check-up.</p>
                    <JourneyBar active={0} showBlurb className="mt-8" />
                </section>

                {/* Branch switcher */}
                <section className="reveal py-12 md:py-16" aria-labelledby="branches-heading">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Our branches</p>
                    <h2 id="branches-heading" className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">
                        Find the clinic nearest you
                    </h2>
                    <Tabs defaultValue="nairobi" className="mt-8">
                        <TabsList>
                            {BRANCHES.map((b) => (
                                <TabsTrigger key={b.id} value={b.id}>
                                    {b.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {BRANCHES.map((b) => (
                            <TabsContent key={b.id} value={b.id} className="mt-6">
                                <BranchPanel branch={b} now={now} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </section>

                {/* CTA band */}
                <section className="reveal pb-16 pt-4 md:pb-20" aria-labelledby="cta-heading">
                    <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-primary p-6 md:flex-row md:items-center md:p-8">
                        <div>
                            <h2 id="cta-heading" className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
                                Ready to visit?
                            </h2>
                            <p className="mt-1 text-primary-foreground/90">
                                Book online in under a minute, or call and we will help you plan your visit.
                            </p>
                        </div>
                        <Button asChild size="lg" variant="secondary" className="shrink-0">
                            <Link to="/book">Book an appointment</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </>
    );
}

export default AboutPage;
