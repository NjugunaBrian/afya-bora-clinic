import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyBar } from '@/components/site/JourneyBar';
import { waLink } from '@/lib/format';

const STEPS = [
    {
        n: 1,
        title: 'Choose a service',
        text: 'Pick what you need, from a check-up to a child vaccine.',
    },
    {
        n: 2,
        title: 'Pick a date and time',
        text: 'See open times for your doctor at the branch closest to you.',
    },
    {
        n: 3,
        title: 'Get confirmation by phone or WhatsApp',
        text: 'Our front desk confirms within 2 hours during opening times.',
    },
];

export function BookingSteps() {
    return (
        <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
            <div className="rounded-3xl bg-card p-6 shadow-sm md:p-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-ink">How booking works</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Book in 3 easy steps</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">No forms to print and no waiting on hold. It takes about a minute.</p>

                <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
                    {STEPS.map((s, i) => (
                        <li key={s.n} className="relative flex flex-col items-start gap-4 md:items-center md:text-center">
                            {i < STEPS.length - 1 ? (
                                <span
                                    aria-hidden="true"
                                    className="absolute left-[calc(50%+2.75rem)] right-[calc(-50%+2.75rem)] top-6 hidden border-t-2 border-dashed border-border md:block"
                                />
                            ) : null}
                            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xl font-semibold tabular-nums text-primary-foreground shadow-sm">
                                {s.n}
                            </span>
                            <div>
                                <h3 className="font-heading text-lg font-bold">{s.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-10 border-t border-border pt-8">
                    <p className="mb-4 text-sm font-semibold text-muted-foreground">After you book: Visit, Treatment, Follow-up</p>
                    <JourneyBar active={0} showBlurb />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="sm:min-w-56">
                        <Link to="/book">Book Appointment</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <a href={waLink('Hello Afya Bora, I would like to book an appointment.')} target="_blank" rel="noreferrer">
                            <MessageCircle aria-hidden="true" /> Message us on WhatsApp
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default BookingSteps;
