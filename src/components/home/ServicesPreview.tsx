import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowRight,
  Baby,
  Clock,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  ScanLine,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  UserRoundSearch,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { SERVICES, type Service } from '@/lib/demo-data';
import { formatKES } from '@/lib/format';

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  'heart-pulse': HeartPulse,
  baby: Baby,
  syringe: Syringe,
  smile: Smile,
  sparkles: Sparkles,
  'flask-conical': FlaskConical,
  activity: Activity,
  'user-round-search': UserRoundSearch,
  dumbbell: Dumbbell,
  'scan-line': ScanLine,
};

const CORE_IDS = [
  's-general',
  's-wellness',
  's-paediatric',
  's-vaccination',
  's-antenatal',
  's-dental-check',
  's-lab',
  's-diabetes',
];

const SPECIALISED_IDS = ['s-specialist', 's-physio', 's-ultrasound'];

const SPECIALISED_IMAGES = ['/assets/consult-room.png', '/assets/waiting-area.png', '/assets/lab.png'];

const ULTRASOUND_EXPECT =
  'A trained sonographer guides the scan gently and at your pace. You may be asked to keep a full bladder. The doctor explains what we see before you leave.';

function pick(ids: string[]): Service[] {
  return ids.map((id) => SERVICES.find((s) => s.id === id)).filter((s): s is Service => Boolean(s));
}

function priceLabel(service: Service): string {
  return service.priceFrom ? formatKES(service.priceFrom) : 'Ask us';
}

export function ServicesPreview() {
  const core = pick(CORE_IDS);
  const specialised = pick(SPECIALISED_IDS);

  return (
    <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-ink">Our services</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Care for every member of your family
        </h2>
        <p className="mt-3 text-muted-foreground">
          From a routine check to a child's first vaccine. Every price is shown in KES before you visit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {core.map((service) => {
          const Icon = ICONS[service.icon] ?? Stethoscope;
          return (
            <article
              key={service.id}
              className="flex flex-col rounded-2xl bg-card p-5 shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary-ink">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold leading-snug">{service.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.summary}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                From{' '}
                <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                  {priceLabel(service)}
                </span>
              </p>
              <Link
                to={`/services#${service.id}`}
                className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
              >
                Learn More
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-14">
        <h3 className="font-heading text-2xl font-bold tracking-tight">Specialised treatments</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Longer visits with senior doctors and therapists, for problems that need more time.
        </p>

        <div className="mt-6 grid gap-6">
          {specialised.map((service, index) => {
            const Icon = ICONS[service.icon] ?? Stethoscope;
            const image = SPECIALISED_IMAGES[index] ?? '/assets/consult-room.png';
            const expect =
              service.expect ?? (service.id === 's-ultrasound' ? ULTRASOUND_EXPECT : service.summary);
            return (
              <article
                key={service.id}
                className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md md:flex-row"
              >
                <div className="h-56 w-full shrink-0 overflow-hidden md:h-auto md:w-80">
                  <img src={image} alt={`${service.name} at Afya Bora Clinic`} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary-ink">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h4 className="font-heading text-xl font-bold">{service.name}</h4>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-ink">What to expect</p>
                    <p className="mt-1.5 text-muted-foreground">{expect}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3">
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      About {service.durationMin} minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      From{' '}
                      <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                        {priceLabel(service)}
                      </span>
                    </p>
                    <Button asChild className="ml-auto">
                      <Link to={`/book?service=${service.id}`}>Book this</Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div >

    <div className="mt-12 flex justify-center">
      <Button asChild variant="outline" size="lg">
        <Link to="/services">See all 14 services</Link>
      </Button>
    </div>
    </section >
  );
}

export default ServicesPreview;
