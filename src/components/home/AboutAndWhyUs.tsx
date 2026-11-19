import { BadgeCheck, Building2, CalendarCheck, HeartHandshake, ShieldCheck, Umbrella, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LICENCE } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

const REASONS = [
    {
        icon: BadgeCheck,
        title: 'Licensed and qualified doctors and nurses',
        text: 'Every clinician is registered, trained and checked before they see a patient. You can ask to see their licence at the desk.',
    },
    {
        icon: HeartHandshake,
        title: 'Friendly, patient-first care',
        text: 'We take the time to listen, explain each step and answer your questions before we move on.',
    },
    {
        icon: Building2,
        title: 'Clean, modern facilities and equipment',
        text: 'Bright consultation rooms, a same-day laboratory and a calm waiting area with a children corner.',
    },
    {
        icon: CalendarCheck,
        title: 'Easy online booking and short waits',
        text: 'Pick a time in about a minute. Most booked patients are seen within 15 minutes of their time.',
    },
    {
        icon: Umbrella,
        title: 'SHA and major insurance accepted',
        text: 'We work with SHA, AAR, Jubilee, Britam, CIC and Madison, and check your cover before you arrive.',
    },
    {
        icon: Wallet,
        title: 'Affordable prices and M-Pesa',
        text: 'Clear KES prices on every service. Pay by M-Pesa, card or cash, and always get a receipt.',
    },
];

const HOVER_LIFT = 'transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md';

export function AboutAndWhyUs() {
    const [lead, ...rest] = REASONS;
    const LeadIcon = lead!.icon;

    return (
        <>
            <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="flex flex-col gap-5">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">About Afya Bora</p>
                        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
                            A clinic that treats your family like ours
                        </h2>
                        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                            Afya Bora Clinic gives clear, kind and affordable care to Kenyan families. Our mission is simple. Every
                            parent, child and grandparent should be heard, understood and treated fairly, close to home.
                        </p>
                        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                            We explain each step in plain words, so you always know what is happening and why. Our licence number is{' '}
                            <span className="font-mono font-semibold text-foreground">{LICENCE}</span>, and you can ask to see it at
                            the front desk.
                        </p>
                        <div>
                            <Button asChild size="lg" variant="outline">
                                <Link to="/about">Learn more about us</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <img
                            src="/assets/consult-room.png"
                            alt="A bright consultation room at Afya Bora Clinic"
                            loading="lazy"
                            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md"
                        />
                        <div className="absolute -bottom-6 left-4 right-4 flex max-w-xs items-center gap-3 rounded-2xl bg-card p-4 shadow-lg md:left-auto md:right-auto md:w-72">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <ShieldCheck className="h-5 w-5 text-primary-ink" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="font-heading text-base font-bold">Licensed</p>
                                <p className="truncate font-mono text-xs text-muted-foreground">{LICENCE}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="reveal mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
                <div className="mb-8 flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Why us</p>
                    <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Why patients choose us</h2>
                    <p className="max-w-2xl text-base text-muted-foreground">Six reasons families come back to Afya Bora.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <article className={cn('flex flex-col gap-4 rounded-3xl bg-accent p-6 md:col-span-2 md:p-8 lg:col-span-2', HOVER_LIFT)}>
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm">
                            <LeadIcon className="h-7 w-7 text-primary-ink" aria-hidden="true" />
                        </span>
                        <h3 className="font-heading text-2xl font-bold leading-snug md:text-3xl">{lead!.title}</h3>
                        <p className="max-w-xl text-lg leading-relaxed text-foreground/80">{lead!.text}</p>
                    </article>

                    {rest.map(({ icon: Icon, title, text }, i) => (
                        <article key={title} className={cn('flex items-start gap-4 rounded-2xl bg-card p-5 shadow-sm', i === rest.length - 1 && 'lg:col-span-2', HOVER_LIFT)}>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                <Icon className="h-5 w-5 text-primary-ink" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-heading text-base font-bold leading-snug">{title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}

export default AboutAndWhyUs;
