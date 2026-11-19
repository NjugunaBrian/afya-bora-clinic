import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, MessageCircle, Phone, Stethoscope, Activity, type LucideIcon } from 'lucide-react';
import { formatDay, formatTime } from '@shared/time';

import { cn } from '@/lib/utils';
import { waLink } from '@/lib/format';
import { nextFreeSlot } from '@/lib/slots';
import { useStore } from '@/lib/store';

const CLINIC_PHONE_DISPLAY = '+254 710 268 389';
const CLINIC_PHONE_TEL = 'tel:+254710268389';
const WHATSAPP_MESSAGE = 'Hello Afya Bora Clinic, I would like to ask about a visit.';

const TILE_BASE =
    'group flex h-full flex-col gap-3 rounded-2xl p-4 shadow-md transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-lg md:p-5';

function TileIcon({ icon: Icon, focal = false }: { icon: LucideIcon; focal?: boolean }) {
    return (
        <span
            className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                focal ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-accent text-primary-ink',
            )}
            aria-hidden="true"
        >
            <Icon className="h-5 w-5" />
        </span>
    );
}

export function QuickActions() {
    const { bookings } = useStore();

    const nextSlot = useMemo(() => nextFreeSlot(bookings, 'nairobi'), [bookings]);
    const slotChip = nextSlot
        ? nextSlot.today
            ? `Next free slot today ${formatTime(nextSlot.start, 'HH:mm')}`
            : `Next free slot ${formatDay(nextSlot.start, 'EEE')} ${formatTime(nextSlot.start, 'HH:mm')}`
        : null;

    return (
        <div className="relative z-10 mx-auto -mt-16 grid max-w-7xl grid-cols-2 gap-3 px-4 md:-mt-20 md:gap-4 md:px-6 lg:grid-cols-4">
            {/* Focal tile: Book Appointment */}
            <Link
                to="/book"
                className={cn(TILE_BASE, 'bg-primary text-primary-foreground')}
            >
                <TileIcon icon={CalendarCheck} focal />
                {slotChip ? (
                    <span className="inline-flex w-fit items-center rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-primary-ink">
                        {slotChip}
                    </span>
                ) : null}
                <div className="mt-1">
                    <h2 className="font-heading text-lg font-bold leading-tight md:text-xl">Book Appointment</h2>
                    <p className="mt-1 text-sm text-primary-foreground">Pick a time that suits you.</p>
                </div>
            </Link>

            <Link to="/doctors" className={cn(TILE_BASE, 'bg-card text-card-foreground')}>
                <TileIcon icon={Stethoscope} />
                <div className="mt-1">
                    <h2 className="font-heading text-lg font-bold leading-tight md:text-xl">Find a Doctor</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Meet our four doctors.</p>
                </div>
            </Link>

            <Link to="/services" className={cn(TILE_BASE, 'bg-card text-card-foreground')}>
                <TileIcon icon={Activity} />
                <div className="mt-1">
                    <h2 className="font-heading text-lg font-bold leading-tight md:text-xl">Our Services</h2>
                    <p className="mt-1 text-sm text-muted-foreground">See what we treat, with KES prices.</p>
                </div>
            </Link>

            <div className={cn(TILE_BASE, 'bg-card text-card-foreground')}>
                <TileIcon icon={MessageCircle} />
                <div className="mt-1">
                    <h2 className="font-heading text-lg font-bold leading-tight md:text-xl">Call / WhatsApp Us</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Our front desk replies in opening hours.</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <a
                        href={waLink(WHATSAPP_MESSAGE)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-primary-ink underline-offset-4 hover:underline"
                    >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        WhatsApp us
                    </a>
                    <span className="text-muted-foreground">
                        or{' '}
                        <a href={CLINIC_PHONE_TEL} className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline">
                            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                            call {CLINIC_PHONE_DISPLAY}
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default QuickActions;
