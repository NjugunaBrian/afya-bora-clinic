import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
    ArrowLeft,
    Bell,
    CalendarClock,
    CalendarPlus,
    CalendarX2,
    FileText,
    MapPin,
    MessageCircle,
    Stethoscope,
    Wallet,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import { formatDay, formatTime, startOfZonedDay } from '@shared/time';

import { Seo } from '@/components/site/Seo';
import { JourneyBar } from '@/components/site/JourneyBar';
import { SlotPicker } from '@/components/book/SlotPicker';
import { ListDetail } from '@/components/layout/ListDetail';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { formatKES, formatVisit, waLink } from '@/lib/format';
import type { Booking, BookingStatus } from '@/lib/demo-data';
import { getBranch, getDoctor, getService, useStore } from '@/lib/store';

const UPCOMING_STATUSES: BookingStatus[] = ['Requested', 'Confirmed', 'Checked in'];

/** Journey step per status. Seen moves to step 3 when a follow-up exists (see journeyStep). */
const STEP_BY_STATUS: Record<BookingStatus, number | null> = {
    Requested: 0,
    Confirmed: 1,
    'Checked in': 1,
    Seen: 2,
    'Follow-up due': 3,
    Cancelled: null,
};

function journeyStep(b: Booking): number | null {
    if (b.status === 'Seen' && b.followUp) return 3;
    return STEP_BY_STATUS[b.status];
}

function initialsOf(name: string): string {
    return name
        .replace(/^Dr\.\s*/, '')
        .split(' ')
        .map((w) => w[0] ?? '')
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function StatusBadge({ status }: { status: BookingStatus }) {
    if (status === 'Cancelled') {
        return (
            <Badge variant="outline" className="border-destructive text-destructive">
                {status}
            </Badge>
        );
    }
    if (status === 'Seen') return <Badge variant="outline">{status}</Badge>;
    if (status === 'Requested') return <Badge variant="secondary">{status}</Badge>;
    if (status === 'Checked in') return <Badge variant="secondary">{status}</Badge>;
    return <Badge variant="default">{status}</Badge>;
}

function VisitRow({ booking, active, onPick }: { booking: Booking; active: boolean; onPick: (ref: string) => void }) {
    const service = getService(booking.serviceId);
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={() => onPick(booking.ref)}
            className={cn(
                'flex w-full flex-col gap-2 rounded-2xl p-4 text-left transition-[background-color,box-shadow] duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active ? 'bg-accent shadow-sm' : 'bg-card shadow-xs hover:bg-muted',
            )}
        >
            <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                    <span className="block truncate font-semibold leading-tight">{booking.forName}</span>
                    <span className="block truncate text-sm text-muted-foreground">{service?.name ?? "Visit"}</span>
                </span>
                <StatusBadge status={booking.status} />
            </span>
            <span className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="tabular-nums text-foreground/90">{formatVisit(booking.start)}</span>
                <span className="font-mono text-xs text-muted-foreground">{booking.ref}</span>
            </span>
        </button>
    );
}

function VisitGroup({
    title,
    rows,
    emptyLine,
    activeRef,
    onPick,
}: {
    title: string;
    rows: Booking[];
    emptyLine: string;
    activeRef: string | undefined;
    onPick: (ref: string) => void;
}) {
    return (
        <section aria-label={title} className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title} <span className="tabular-nums">{rows.length}</span>
            </h2>
            {rows.length === 0 ? (
                <p className="rounded-xl px-3 py-2 text-sm text-muted-foreground">{emptyLine}</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {rows.map((b) => (
                        <li key={b.ref}>
                            <VisitRow booking={b} active={b.ref === activeRef} onPick={onPick} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function Fact({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
            <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className="font-semibold">{children}</dd>
            </div>
        </div>
    );
}

function RescheduleDialog({
    booking,
    open,
    onOpenChange,
}: {
    booking: Booking;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { bookings, reschedule } = useStore();
    const [picked, setPicked] = useState('');

    const mutation = useMutation({
        mutationFn: async (start: string) => {
            reschedule(booking.ref, start, booking.doctorId);
        },
        onSuccess: () => {
            toast.success(`Visit ${booking.ref} moved`, {
                description: "It is back to Requested. We will confirm by phone or WhatsApp.",
            });
            setPicked('');
            onOpenChange(false);
        },
        onError: () => toast.error("We could not move this visit. Please try again."),
    });

    const service = getService(booking.serviceId);

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) setPicked('');
                onOpenChange(next);
            }}
        >
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Pick a new time</DialogTitle>
                    <DialogDescription>
                        {service?.name ?? "Visit"} for {booking.forName}. Choose an open time and we will confirm it again.
                    </DialogDescription>
                </DialogHeader>

                <SlotPicker
                    serviceId={booking.serviceId}
                    doctorId={booking.doctorId}
                    branchId={booking.branchId}
                    bookings={bookings}
                    ignoreRef={booking.ref}
                    value={picked}
                    onChange={(s) => setPicked(s.start)}
                />

                {picked ? (
                    <p className="text-sm font-semibold text-primary-ink">
                        New time: {formatDay(picked, 'EEEE d MMMM')} at {formatTime(picked)}
                    </p>
                ) : null}

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                        Keep current time
                    </Button>
                    <Button
                        type="button"
                        disabled={!picked || mutation.isPending}
                        onClick={() => mutation.mutate(picked)}
                    >
                        {mutation.isPending ? "Saving your new time…" : "Confirm new time"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function VisitDetail({ booking, onBack }: { booking: Booking; onBack: () => void }) {
    const { cancel } = useStore();
    const [rescheduleOpen, setRescheduleOpen] = useState(false);

    const service = getService(booking.serviceId);
    const doctor = getDoctor(booking.doctorId);
    const branch = getBranch(booking.branchId);
    const step = journeyStep(booking);

    const isUpcoming = UPCOMING_STATUSES.includes(booking.status) && Date.parse(booking.start) >= startOfZonedDay().getTime();
    const canChange = isUpcoming && (booking.status === 'Requested' || booking.status === 'Confirmed');

    const cancelMutation = useMutation({
        mutationFn: async (ref: string) => {
            cancel(ref);
        },
        onSuccess: () => toast.success("Visit cancelled", { description: "Thank you for letting us know." }),
        onError: () => toast.error("We could not cancel this visit. Please message us on WhatsApp."),
    });

    const rebookHref = `/book?service=${booking.serviceId}&doctor=${booking.doctorId}`;

    return (
        <article className="flex flex-col gap-6 rounded-3xl bg-card p-5 shadow-sm md:p-6">
            <Button type="button" variant="ghost" size="sm" className="-ml-2 self-start md:hidden" onClick={onBack}>
                <ArrowLeft aria-hidden="true" /> Back to my visits
            </Button>

            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold tracking-wide text-muted-foreground">{booking.ref}</p>
                    <h2 className="font-heading text-2xl font-bold tracking-tight">{service?.name ?? "Visit"}</h2>
                    <p className="text-muted-foreground">For {booking.forName}</p>
                </div>
                <StatusBadge status={booking.status} />
            </header>

            <section aria-labelledby="journey-heading" className="rounded-2xl bg-muted/60 p-4 md:p-5">
                <h3 id="journey-heading" className="mb-4 font-heading text-lg font-bold">Where your visit is</h3>
                {step === null ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        This visit was cancelled. You can book a new time any time.
                    </p>
                ) : (
                    <JourneyBar active={step} showBlurb />
                )}
            </section>

            <dl className="grid gap-5 sm:grid-cols-2">
                <Fact icon={CalendarClock} label="Date and time">
                    {formatVisit(booking.start)}
                </Fact>
                <Fact icon={Stethoscope} label="Doctor">
                    <span className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={doctor?.photo ?? ''} alt="" />
                            <AvatarFallback>{initialsOf(doctor?.name ?? "Afya Bora")}</AvatarFallback>
                        </Avatar>
                        <span>{doctor?.name ?? "Any available doctor"}</span>
                    </span>
                </Fact>
                <Fact icon={MapPin} label="Branch">
                    <span className="block">{branch?.name ?? ""}</span>
                    <span className="block text-sm font-normal text-muted-foreground">{branch?.address ?? ""}</span>
                </Fact>
                <Fact icon={Wallet} label="Payment">
                    {booking.payment}
                    <span className="block text-sm font-normal text-muted-foreground">
                        {service?.priceFrom ? `Price from ${formatKES(service.priceFrom)}` : "Ask us about the price"}
                    </span>
                </Fact>
                <div className="sm:col-span-2">
                    <Fact icon={FileText} label="Reason for visit">
                        <span className="font-normal">{booking.reason || "No reason given"}</span>
                    </Fact>
                </div>
            </dl>

            {booking.followUp ? (
                <section className="flex flex-col gap-4 rounded-2xl bg-accent p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary-ink" aria-hidden="true" />
                        <div>
                            <p className="font-heading font-bold">Follow-up reminder</p>
                            <p className="text-sm">
                                Due {formatDay(booking.followUp.dueOn, 'EEEE d MMMM')} at {formatTime(booking.followUp.dueOn)}. {booking.followUp.note}
                            </p>
                        </div>
                    </div>
                    <Button asChild className="shrink-0">
                        <Link to={rebookHref}>
                            <CalendarPlus aria-hidden="true" /> Book again
                        </Link>
                    </Button>
                </section>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {canChange ? (
                    <Button type="button" variant="outline" onClick={() => setRescheduleOpen(true)}>
                        <CalendarClock aria-hidden="true" /> Reschedule
                    </Button>
                ) : null}
                {canChange ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="ghost" className="text-destructive">
                                Cancel visit
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this visit?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {service?.name ?? "Visit"} for {booking.forName} on {formatVisit(booking.start)}. Please cancel at least 4 hours ahead so another patient can take the time.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Keep visit</AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={cancelMutation.isPending}
                                    onClick={() => cancelMutation.mutate(booking.ref)}
                                >
                                    {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel visit"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : null}
                <Button asChild variant="ghost">
                    <a
                        href={waLink(`Hello Afya Bora, I have a question about visit ${booking.ref}.`)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MessageCircle aria-hidden="true" /> Message the front desk
                    </a>
                </Button>
            </div>

            {canChange ? (
                <RescheduleDialog booking={booking} open={rescheduleOpen} onOpenChange={setRescheduleOpen} />
            ) : null}

            <section aria-labelledby="history-heading">
                <h3 id="history-heading" className="mb-3 font-heading text-lg font-bold">What has happened</h3>
                <ol className="flex flex-col gap-3 border-l-2 border-border pl-4">
                    {booking.history.map((h, i) => (
                        <li key={i} className="text-sm">
                            <span className="block font-mono text-xs tabular-nums text-muted-foreground">
                                {formatDay(h.at, 'd MMM')} · {formatTime(h.at)}
                            </span>
                            <span>{h.text}</span>
                        </li>
                    ))}
                </ol>
            </section>
        </article>
    );
}

export function MyVisitsPage() {
    const { bookings } = useStore();
    const [selectedRef, setSelectedRef] = useState<string | null>(null);
    const [mobileSelected, setMobileSelected] = useState(false);
    const todayStart = useMemo(() => startOfZonedDay().getTime(), []);

    const { upcoming, past } = useMemo(() => {
        const list = Array.isArray(bookings) ? bookings : [];
        const up = list
            .filter((b) => UPCOMING_STATUSES.includes(b.status) && Date.parse(b.start) >= todayStart)
            .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
        const upRefs = new Set(up.map((b) => b.ref));
        const pa = list
            .filter((b) => !upRefs.has(b.ref))
            .sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
        return { upcoming: up, past: pa };
    }, [bookings, todayStart]);

    if (!Array.isArray(bookings)) {
        return (
            <>
                <Seo title="My Visits | Afya Bora Clinic" description="See your upcoming and past visits, track each step and reschedule or cancel." noindex />
                <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
                    <PageHeader title="My Visits" description="Your upcoming and past visits." />
                    <Alert variant="destructive" className="mt-8">
                        <AlertTitle>We could not load your visits</AlertTitle>
                        <AlertDescription className="flex flex-col gap-3">
                            Please try again. If it keeps happening, message us on WhatsApp.
                            <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => window.location.reload()}>
                                Try again
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            </>
        );
    }

    const active = bookings.find((b) => b.ref === selectedRef) ?? upcoming[0] ?? past[0];

    function pick(ref: string) {
        setSelectedRef(ref);
        setMobileSelected(true);
    }

    const listPane = (
        <div className="flex flex-col gap-6 pr-1">
            <VisitGroup
                title="Upcoming"
                rows={upcoming}
                emptyLine="No upcoming visits. Book one when you are ready."
                activeRef={active?.ref}
                onPick={pick}
            />
            <VisitGroup
                title="Past"
                rows={past}
                emptyLine="Your past visits will appear here."
                activeRef={active?.ref}
                onPick={pick}
            />
        </div>
    );

    const detailPane = active ? (
        <VisitDetail booking={active} onBack={() => setMobileSelected(false)} />
    ) : (
        <EmptyState icon={CalendarX2} title="Choose a visit" description="Pick a visit from the list to see its steps and details." />
    );

    return (
        <>
            <Seo
                title="My Visits | Afya Bora Clinic"
                description="See your upcoming and past visits, track each step and reschedule or cancel."
                noindex
            />
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
                <PageHeader
                    title="My Visits"
                    description="Your upcoming and past visits."
                    actions={
                        <Button asChild>
                            <Link to="/book">
                                <CalendarPlus aria-hidden="true" /> Book a visit
                            </Link>
                        </Button>
                    }
                />

                {bookings.length === 0 ? (
                    <div className="mt-8">
                        <EmptyState
                            icon={CalendarX2}
                            title="No visits yet"
                            description="When you book, your visits appear here with each step."
                            action={
                                <Button asChild>
                                    <Link to="/book">Book a visit</Link>
                                </Button>
                            }
                        />
                    </div>
                ) : (
                    <div className="mt-8 md:h-[calc(100vh-9rem)] md:min-h-[36rem]">
                        <ListDetail list={listPane} detail={detailPane} selected={mobileSelected} listWidth="22rem" />
                    </div>
                )}
            </div>
        </>
    );
}

export default MyVisitsPage;
