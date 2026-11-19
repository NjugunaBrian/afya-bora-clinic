import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ACCEPTED_PAYMENTS, FAQS, FEES, type FeeCard } from '@/lib/demo-data';
import { formatKES } from '@/lib/format';
import { cn } from '@/lib/utils';

function FeeCardView({ fee }: { fee: FeeCard }) {
  const popular = !!fee.popular;

  return (
    <article
      className={cn(
        'flex flex-col rounded-3xl p-6 transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md',
        popular ? 'bg-primary text-primary-foreground shadow-md lg:-my-3' : 'bg-card text-card-foreground shadow-sm',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-bold leading-snug">{fee.name}</h3>
        {popular ? (
          <Badge variant="secondary" className="shrink-0">
            Most Popular
          </Badge>
        ) : null}
      </div>

      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 font-mono tabular-nums">
        {fee.fromPrefix ? (
          <span className={cn('text-sm', popular ? 'text-primary-foreground/90' : 'text-muted-foreground')}>from</span>
        ) : null}
        <span className="text-3xl font-semibold">{formatKES(fee.price)}</span>
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {fee.includes.map((item) => (
          <li key={item} className={cn('flex items-start gap-2 text-sm', popular ? 'text-primary-foreground/90' : 'text-muted-foreground')}>
            <Check
              className={cn('mt-0.5 h-4 w-4 shrink-0', popular ? 'text-primary-foreground' : 'text-primary-ink')}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button asChild variant={popular ? 'secondary' : 'default'} className="mt-6 w-full">
        <Link to={`/book?service=${fee.serviceId}`}>Book Now</Link>
      </Button>
    </article>
  );
}

export function FeesPreview() {
  const faqs = FAQS.slice(0, 5);

  return (
    <section id="fees" className="reveal mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Fees and insurance</p>
      <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">Clear prices in KES</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        You see the cost before your visit. Your cover decides what you pay, and we check it with you at the front desk.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEES.map((fee) => (
          <FeeCardView key={fee.id} fee={fee} />
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div>
          <p className="font-heading text-lg font-bold">Accepted insurance and payments</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ACCEPTED_PAYMENTS.map((p) => (
              <Badge key={p} variant="secondary" className="px-3 py-1 text-sm">
                {p}
              </Badge>
            ))}
          </div>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/fees">More fees and insurance details</Link>
            </Button>
          </div>
        </div>

        <div>
          <p className="font-heading text-lg font-bold">Common questions</p>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FeesPreview;
