import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FACILITIES } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

type Facility = (typeof FACILITIES)[number];

/**
 * Facilities — a bento gallery of the clinic. Tap a photo to open it large in a
 * lightbox with Previous/Next buttons and Left/Right arrow keys. Captions show on
 * hover or keyboard focus; the title always shows, so touch users see it too.
 */
export function Facilities() {
  const [index, setIndex] = useState<number | null>(null);

  const item: Facility | undefined = index === null ? undefined : FACILITIES[index];

  const step = (delta: number) =>
    setIndex((i) => (i === null ? null : (i + delta + FACILITIES.length) % FACILITIES.length));

  useEffect(() => {
    if (index === null) return;
    const n = FACILITIES.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const delta = e.key === 'ArrowLeft' ? -1 : 1;
      setIndex((i) => (i === null ? null : (i + delta + n) % n));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [index]);

  return (
    <section id="facilities" aria-labelledby="facilities-heading" className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-ink">Inside the clinic</p>
        <h2 id="facilities-heading" className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Our facilities
        </h2>
        <p className="mt-3 text-muted-foreground">Clean, bright rooms designed to put you and your family at ease.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:auto-rows-[15rem] md:grid-cols-4">
        {FACILITIES.map((f, i) => {
          const large = i === 0;
          return (
            <button
              key={f.title}
              type="button"
              aria-haspopup="dialog"
              onClick={() => setIndex(i)}
              className={cn(
                'group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted text-left shadow-sm transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:aspect-auto md:h-full',
                large && 'col-span-2 md:col-span-2 md:row-span-2',
              )}
            >
              <img
                src={f.img}
                alt={`${f.title}: ${f.caption}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-slow group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span className="scrim-bottom absolute inset-0 flex flex-col justify-end gap-1 p-5 on-scrim">
                <span className="font-heading text-lg font-bold">{f.title}</span>
                <span className="text-sm on-scrim-muted md:translate-y-1 md:opacity-0 md:transition-[opacity,transform] md:duration-base md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                  {f.caption}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={index !== null} onOpenChange={(open) => { if (!open) setIndex(null); }}>
        <DialogContent className="max-w-4xl gap-4 p-4 md:p-6">
          {item ? (
            <>
              <div className="overflow-hidden rounded-2xl bg-muted">
                <img
                  key={item.img}
                  src={item.img}
                  alt={`${item.title}: ${item.caption}`}
                  className="h-[60vh] max-h-[560px] w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <DialogTitle className="font-heading text-2xl font-bold">{item.title}</DialogTitle>
                  <DialogDescription className="mt-1 text-muted-foreground">{item.caption}</DialogDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button type="button" variant="outline" size="icon" aria-label="Previous photo" onClick={() => step(-1)}>
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <span className="min-w-14 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                    {(index ?? 0) + 1} / {FACILITIES.length}
                  </span>
                  <Button type="button" variant="outline" size="icon" aria-label="Next photo" onClick={() => step(1)}>
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Facilities;
