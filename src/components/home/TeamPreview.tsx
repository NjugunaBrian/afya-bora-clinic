import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DOCTORS, STAFF } from '@/lib/demo-data';

/** First sentence of a bio, without splitting on the "Dr." title. */
function firstSentence(bio: string) {
  const protectedTitle = bio.replace(/Dr\. /g, 'Dr§ ');
  const first = protectedTitle.split(/(?<=[.!?])\s+/)[0] ?? bio;
  return first.replace(/Dr§ /g, 'Dr. ');
}

export function TeamPreview() {
  return (
    <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-ink">Our doctors</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">Our medical team</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Four licensed doctors, each with years of care behind them. Choose the one you trust, or let us pick.
          </p>
        </div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink underline-offset-4 hover:underline"
        >
          See all doctors <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DOCTORS.map((d) => (
          <article
            key={d.id}
            className="flex flex-col rounded-3xl bg-card p-4 shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md"
          >
            <img
              src={d.photo}
              alt={`Portrait of ${d.name}`}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
            <div className="flex flex-1 flex-col gap-3 px-1 pb-1 pt-4">
              <Badge variant="secondary" className="w-fit gap-1 text-primary-ink">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Licensed
              </Badge>
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d.specialty}</p>
              </div>
              <p className="text-sm">
                <span className="font-mono font-semibold tabular-nums">{d.years}</span> years experience
              </p>
              <p className="text-sm text-muted-foreground">{d.languages.join(' · ')}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{firstSentence(d.bio)}</p>
              <div className="mt-auto pt-2">
                <Button asChild className="w-full">
                  <Link to={`/book?doctor=${d.id}`}>Book with Dr. {d.short.replace(/^Dr\. /, '')}</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-accent p-5 sm:flex-row sm:items-center">
        <p className="text-sm font-semibold text-primary-ink">Supported by</p>
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          {STAFF.map((s) => (
            <li key={s.name} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-card font-semibold text-primary-ink">{s.initials}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div >
    </section >
  );
}

export default TeamPreview;
