import { useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TESTIMONIALS, type Testimonial } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn('h-4 w-4', i < rating ? 'fill-current text-primary-ink' : 'text-muted-foreground/40')}
        />
      ))}
    </span>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);

  const featured: Testimonial | undefined = TESTIMONIALS[active] ?? TESTIMONIALS[0];
  if (!featured) return null;

  const others = TESTIMONIALS.map((t, i) => ({ t, i })).filter((x) => x.i !== active);

  return (
    <section className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Testimonials</p>
      <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">What families say</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Short notes from patients in Nairobi and Nyeri, in their own words.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose a testimonial">
        {TESTIMONIALS.map((t, i) => (
          <Button
            key={t.name}
            type="button"
            size="sm"
            variant={i === active ? 'default' : 'outline'}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {t.name}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <figure className="flex flex-col justify-between gap-8 rounded-3xl bg-accent p-6 shadow-sm md:p-10">
          <div>
            <Quote className="h-10 w-10 text-primary-ink" aria-hidden="true" />
            <blockquote className="mt-4 font-heading text-xl font-semibold leading-relaxed md:text-2xl">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
          </div>
          <figcaption className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                {initialsOf(featured.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold">{featured.name}</p>
              <p className="text-sm text-muted-foreground">{featured.place}</p>
              <div className="mt-1">
                <Stars rating={featured.rating} />
              </div>
            </div>
          </figcaption>
        </figure>

        <ul className="flex flex-col gap-3">
          {others.map(({ t, i }) => (
            <li key={t.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className="flex w-full items-start gap-4 rounded-2xl bg-card p-4 text-left shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
                    {initialsOf(t.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-muted-foreground">{t.place}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{t.quote}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div >

    <p className="mt-4 text-xs text-muted-foreground">
      Sample feedback shown for the demo. Replace with real patient comments before launch.
    </p>
    </section >
  );
}

export default Testimonials;
