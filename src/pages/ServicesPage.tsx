import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Activity,
    Baby,
    Check,
    ClipboardCheck,
    Clock,
    Dumbbell,
    FlaskConical,
    Heart,
    HeartPulse,
    MessageCircle,
    ScanLine,
    SearchX,
    Smile,
    Sparkles,
    Stethoscope,
    Syringe,
    SmilePlus,
    UserRoundSearch,
    Users,
    Wind,
    type LucideIcon,
} from 'lucide-react';

import { Seo } from '@/components/site/Seo';
import { PageBanner } from '@/components/site/PageBanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SERVICES, SERVICE_CATEGORIES, type Service, type ServiceCategory } from '@/lib/demo-data';
import { formatKES, waLink } from '@/lib/format';

type Filter = 'all' | ServiceCategory;

const ICONS: Record<string, LucideIcon> = {
    stethoscope: Stethoscope,
    'heart-pulse': HeartPulse,
    users: Users,
    baby: Baby,
    syringe: Syringe,
    smile: Smile,
    sparkles: Sparkles,
    tooth: SmilePlus,
    'flask-conical': FlaskConical,
    'scan-line': ScanLine,
    activity: Activity,
    wind: Wind,
    'user-round-search': UserRoundSearch,
    dumbbell: Dumbbell,
    heart: Heart,
};

const PREP_ITEMS: { id: string; title: string; body: string }[] = [
    {
        id: 'fasting',
        title: "Fasting for blood tests",
        body: "Some lab tests need you to skip food for 8 to 10 hours. You can drink water and take your usual medicine unless your doctor tells you otherwise. We tell you when you book.",
    },
    {
        id: 'documents',
        title: "Documents to carry",
        body: "Bring your national ID, or your child's birth certificate. Bring any letter or referral from another clinic, and any test results you already have.",
    },
    {
        id: 'sha',
        title: "Your SHA or insurance card",
        body: "Bring your SHA or private insurance card. Our front desk checks your cover before you are seen, so you know what you will pay.",
    },
    {
        id: 'medicines',
        title: "Your medicine list",
        body: "Bring the medicines you take, in their boxes if you can. Include any inhalers, eye drops or supplements, and the doses you use.",
    },
    {
        id: 'booklet',
        title: "Children's booklet",
        body: "For children, bring the immunisation or clinic booklet and their latest weight record. The doctor will update it during the visit.",
    },
];

function isCategory(value: string | null): value is ServiceCategory {
    return value !== null && (SERVICE_CATEGORIES as string[]).includes(value);
}

function ServiceChip({ icon }: { icon: string }) {
    const Icon = ICONS[icon] ?? Stethoscope;
    return (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary-ink">
            <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
    );
}

function ServiceCard({ service }: { service: Service }) {
    return (
        <Card
            id={service.id}
            className="scroll-mt-28 flex flex-col rounded-3xl p-6 shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex items-start gap-4">
                <ServiceChip icon={service.icon} />
                <div className="min-w-0">
                    <Badge variant="secondary" className="mb-2">
                        {service.category}
                    </Badge>
                    <h3 className="font-heading text-lg font-bold leading-snug tracking-tight">{service.name}</h3>
                </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{service.summary}</p>
            <p className="mt-3 text-sm">
                <span className="font-semibold">Who it is for: </span>
                <span className="text-muted-foreground">{service.forWho}</span>
            </p>

            <ul className="mt-4 flex flex-col gap-2">
                {service.bullets.slice(0, 5).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {service.durationMin} min
                </span>
                <span className="font-heading font-bold tabular-nums">
                    {service.priceFrom !== null ? `From ${formatKES(service.priceFrom)}` : 'Contact us for pricing'}
                </span>
            </div>

            <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-ink">
                    <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Bring: {service.bring}
                </span>
            </div>

            {service.expect ? (
                <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">{service.expect}</p>
            ) : null}

            <div className="mt-auto pt-6">
                <Button asChild className="w-full">
                    <Link to={`/book?service=${service.id}`}>Book This Service</Link>
                </Button>
            </div>
        </Card>
    );
}

export function ServicesPage() {
    const [params, setParams] = useSearchParams();
    const raw = params.get('category');
    const active: Filter = isCategory(raw) ? raw : 'all';

    const filtered = useMemo(
        () => (active === 'all' ? SERVICES : SERVICES.filter((s) => s.category === active)),
        [active],
    );

    const countFor = (c: Filter) => (c === 'all' ? SERVICES.length : SERVICES.filter((s) => s.category === c).length);

    function setCategory(next: Filter) {
        const p = new URLSearchParams(params);
        if (next === 'all') p.delete('category');
        else p.set('category', next);
        setParams(p, { replace: true });
    }

    const tabs: Filter[] = ['all', ...SERVICE_CATEGORIES];

    return (
        <>
            <Seo
                title="Services and prices | Afya Bora Clinic"
                description="Our services, who each one is for, what to bring and the price from KES. Book a service in under a minute."
            />
            <PageBanner
                title="Our Healthcare Services"
                description="Clear prices, plain words about what each visit covers, and what to bring. Choose a service and book in under a minute."
                image="/assets/lab.png"
                alt="A laboratory technologist preparing tests at Afya Bora Clinic"
            />

            <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Choose a service</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Find the right care for you</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Filter by the kind of care you need. Every card shows the price from KES, how long the visit takes and what to bring.
                </p>

                <Tabs value={active} onValueChange={(v) => setCategory(v as Filter)} className="mt-8">
                    <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 overflow-x-auto bg-transparent p-0">
                        {tabs.map((c) => (
                            <TabsTrigger
                                key={c}
                                value={c}
                                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-xs transition-[background-color,color,box-shadow] duration-fast data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                            >
                                {c === 'all' ? 'All' : c}
                                <span className="ml-2 font-mono text-xs tabular-nums opacity-80">{countFor(c)}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="mt-8">
                    {filtered.length === 0 ? (
                        <EmptyState
                            icon={SearchX}
                            title="No services in this group yet"
                            description="Choose another group, or see every service we offer."
                            action={
                                <Button variant="outline" onClick={() => setCategory('all')}>
                                    Show all services
                                </Button>
                            }
                        />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filtered.map((s) => (
                                <ServiceCard key={s.id} service={s} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="reveal mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Before you come</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Preparing for your visit</h2>
                <p className="mt-2 text-muted-foreground">A few simple things make your visit smoother. Open each one to read more.</p>

                <Accordion type="single" collapsible defaultValue="fasting" className="mt-6 flex flex-col gap-3">
                    {PREP_ITEMS.map((item) => (
                        <AccordionItem key={item.id} value={item.id} className="rounded-2xl bg-card px-5 shadow-xs">
                            <AccordionTrigger className="font-heading text-base font-bold">{item.title}</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">{item.body}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            <section className="reveal mx-auto max-w-7xl px-4 pb-16 md:px-6">
                <div className="flex flex-col gap-6 rounded-3xl bg-accent p-6 md:flex-row md:items-center md:justify-between md:p-8">
                    <div className="max-w-xl">
                        <h2 className="font-heading text-2xl font-bold tracking-tight">Not sure which service you need?</h2>
                        <p className="mt-2 text-sm">
                            Send us a message on WhatsApp and describe what is happening. Our front desk will point you to the right service.
                        </p>
                    </div>
                    <Button asChild size="lg" className="shrink-0">
                        <a href={waLink('Hello, I am not sure which service I need')} target="_blank" rel="noreferrer">
                            <MessageCircle aria-hidden="true" />
                            Chat on WhatsApp
                        </a>
                    </Button>
                </div>
            </section>
        </>
    );
}

export default ServicesPage;
