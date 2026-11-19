import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, CalendarX2, Clock, Languages, MapPin, MessageCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { dayKey, formatDay, formatTime } from '@shared/time';

import { Seo } from '@/components/site/Seo';
import { PageBanner } from '@/components/site/PageBanner';
import { ListDetail } from '@/components/layout/ListDetail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { DOCTORS, SERVICES, STAFF, type Doctor } from '@/lib/demo-data';
import { waLink } from '@/lib/format';
import { nextOpenSlots } from '@/lib/slots';
import { getBranch, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

function initialsOf(name: string): string {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function LicensedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="secondary" className={cn('gap-1 text-xs font-semibold', className)}>
      <ShieldCheck className="h-3 w-3" aria-hidden="true" />
      Licensed
    </Badge>
  );
}

export function DoctorsPage() {
  const { bookings, setPrefs } = useStore();
  const [activeId, setActiveId] = useState<string>(DOCTORS[0]?.id ?? '');
  const [selected, setSelected] = useState(false);

  const active: Doctor | undefined = DOCTORS.find((d) => d.id === activeId) ?? DOCTORS[0];

  const slots = useMemo(
    () => (active ? nextOpenSlots(active.id, 3, bookings) : []),
    [active, bookings],
  );

  function choose(id: string) {
    setActiveId(id);
    setSelected(true);
  }

  const listPane = (
    <div className="flex flex-col gap-2 pr-1">
      {DOCTORS.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="No doctors listed yet"
          description="Please call the front desk and we will help you find the right doctor."
          action={
            <Button asChild variant="outline">
              <a href={waLink("Hello Afya Bora, which doctor can see me?")} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> Message us on WhatsApp
              </a>
            </Button>
          }
        />
      ) : (
        DOCTORS.map((d) => {
          const isActive = d.id === active?.id;
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => choose(d.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-[background-color,box-shadow] duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive ? 'bg-accent shadow-sm' : 'bg-card shadow-xs hover:bg-muted',
              )}
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={d.photo} alt="" />
                <AvatarFallback>{initialsOf(d.name)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-base font-bold leading-tight">{d.name}</span>
                  <LicensedBadge className="px-1.5 py-0 text-[0.65rem]" />
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{d.specialty}</span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {getBranch(d.branchId)?.name ?? ''}
                </span>
              </span>
            </button>
          );
        })
      )}
    </div>
  );

  const detailPane = !active ? (
    <EmptyState
      icon={CalendarX2}
      title="Choose a doctor"
      description="Pick a doctor from the list to see their profile and open times."
    />
  ) : (
    <article className="flex flex-col gap-6 rounded-3xl bg-card p-5 shadow-sm md:p-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 self-start md:hidden"
        onClick={() => setSelected(false)}
      >
        <ArrowLeft aria-hidden="true" /> Back to all doctors
      </Button>

      <div className="grid gap-6 sm:grid-cols-[12rem_1fr] md:grid-cols-[14rem_1fr]">
        <img
          src={active.photo}
          alt={`Portrait of ${active.name}`}
          className="h-64 w-full rounded-2xl object-cover sm:h-full sm:min-h-56"
        />
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">{active.specialty}</p>
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">{active.name}</h2>
          <p className="text-muted-foreground">{active.title}</p>
          <div className="flex flex-wrap items-center gap-2">
            <LicensedBadge />
            <span className="text-sm text-muted-foreground">Licence {active.licence}</span>
          </div>
          <dl className="mt-1 grid gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
              <div>
                <dt className="sr-only">Experience</dt>
                <dd className="font-semibold tabular-nums">{active.years} years</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Languages className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
              <div>
                <dt className="sr-only">Languages</dt>
                <dd className="font-semibold">{active.languages.join(', ')}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
              <div>
                <dt className="sr-only">Branch</dt>
                <dd className="font-semibold">{getBranch(active.branchId)?.name ?? ''}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-2">
            <Button asChild size="lg">
              <Link to={`/book?doctor=${active.id}`}>Book with {active.short}</Link>
            </Button>
          </div>
        </div>
      </div>

      <p className="leading-relaxed text-foreground/90">{active.bio}</p>

      <div>
        <h3 className="mb-3 font-heading text-lg font-bold">Services {active.short} treats</h3>
        <div className="flex flex-wrap gap-2">
          {SERVICES.filter((s) => active.serviceIds.includes(s.id)).map((s) => (
            <Link
              key={s.id}
              to={`/book?service=${s.id}&doctor=${active.id}`}
              className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground transition-colors duration-fast hover:bg-accent"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-muted/60 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
          <Clock className="h-4 w-4 text-primary-ink" aria-hidden="true" />
          Next three open slots
        </h3>
        {slots.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              No open slots in the next 3 weeks. Message us on WhatsApp and we will find a time for you.
            </p>
            <Button asChild variant="outline" size="sm" className="self-start">
              <a href={waLink(`Hello Afya Bora, I would like a visit with ${active.name}.`)} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> Ask on WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-3">
            {slots.map((s) => (
              <li key={String(s.start)}>
                <Button asChild variant="secondary" className="h-auto w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2.5 text-left">
                  <Link
                    to={`/book?doctor=${active.id}`}
                    onClick={() => setPrefs({ doctorId: active.id, branchId: active.branchId, dayKey: dayKey(s.start) })}
                  >
                    <span className="text-xs font-medium text-muted-foreground">{formatDay(s.start, 'EEE d MMM')}</span>
                    <span className="font-mono text-base font-semibold tabular-nums">{formatTime(s.start)}</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );

  return (
    <>
      <Seo
        title="Our Doctors | Afya Bora Clinic"
        description="Meet our licensed doctors in Nairobi and Nyeri. See their training, languages and next open times, then book in under a minute."
      />
      <PageBanner
        title="Meet Our Doctors"
        description="Licensed doctors who know your family, explain things clearly and take the time you need."
        image="/assets/team.png"
        alt="The Afya Bora clinical team standing together in the clinic"
      />

      <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Our doctors</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Four doctors, one caring clinic</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose a doctor to see their training, the languages they speak and their next open times.
        </p>

        <div className="mt-8 md:h-[calc(100vh-14rem)] md:min-h-[34rem]">
          <ListDetail list={listPane} detail={detailPane} selected={selected} listWidth="22rem" />
        </div>
      </section>

      <section className="reveal mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Support team</p>
        <h2 className="mt-2 font-heading text-xl font-bold md:text-2xl">The people who look after you too</h2>
        <ul className="mt-5 flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-sm sm:flex-row sm:flex-wrap sm:gap-8 sm:p-6">
          {STAFF.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback>{s.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold leading-tight">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default DoctorsPage;
