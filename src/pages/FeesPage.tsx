import { Link, useSearchParams } from 'react-router-dom';
import { Check, Info, Receipt, ShieldCheck } from 'lucide-react';

import { Seo } from '@/components/site/Seo';
import { PageBanner } from '@/components/site/PageBanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ACCEPTED_PAYMENTS, FAQS, FEES, PAYMENT_ROUTES, type FeeCard, type PaymentRoute } from '@/lib/demo-data';
import { formatKES } from '@/lib/format';
import { cn } from '@/lib/utils';

const DEFAULT_ROUTE: PaymentRoute = 'SHA';
const CASH_ROUTES: PaymentRoute[] = ['Cash', 'M-Pesa'];
const POPULAR_ID = 'f-wellness';

function isRoute(value: string | null): value is PaymentRoute {
  return PAYMENT_ROUTES.some((r) => r === value);
}

function payFor(fee: FeeCard, route: PaymentRoute): number {
  return fee.youPay[route] ?? 0;
}

export function FeesPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('pay');
  const route: PaymentRoute = isRoute(raw) ? raw : DEFAULT_ROUTE;

  function choose(next: PaymentRoute) {
    setParams({ pay: next }, { replace: true });
  }

  const wellness = FEES.find((f) => f.id === POPULAR_ID);
  const wellnessPrice = wellness?.price ?? 0;
  const wellnessPays = wellness ? payFor(wellness, route) : 0;

  let callout: string;
  if (CASH_ROUTES.includes(route)) {
    callout = `With ${route}, you pay the full price of ${formatKES(wellnessPrice)} for the Family Wellness Check-up.`;
  } else if (wellnessPays === 0) {
    callout = `With ${route}, you pay nothing for the Family Wellness Check-up.`;
  } else {
    callout = `With ${route}, you pay ${formatKES(wellnessPays)} for the Family Wellness Check-up.`;
  }

  const hasFees = FEES.length > 0;

  return (
    <>
      <Seo
        title="Fees and Insurance | Afya Bora Clinic"
        description="See our clinic fees in KES and what your SHA or private insurance covers. Know the cost before you come in."
      />
      <PageBanner
        title="Fees and Insurance"
        description="Know the cost before you come. Prices are in KES."
        image="/assets/pharmacy.png"
        alt="Medicines ready for collection at the Afya Bora pharmacy counter"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Standard prices</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Four common visits, clearly priced</h2>

        {hasFees ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {FEES.map((fee) => {
              const popular = fee.id === POPULAR_ID;
              return (
                <article
                  key={fee.id}
                  className={cn(
                    'flex flex-col gap-5 rounded-3xl p-6 transition-shadow duration-base',
                    popular ? 'bg-accent shadow-md ring-2 ring-primary' : 'bg-card shadow-sm hover:shadow-md',
                  )}
                >
                  {popular ? (
                    <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  ) : null}
                  <div>
                    <h3 className="font-heading text-lg font-bold leading-snug">{fee.name}</h3>
                    <p className="mt-3 flex items-baseline gap-1.5">
                      {fee.fromPrefix ? <span className="text-sm text-muted-foreground">from</span> : null}
                      <span className="font-mono text-2xl font-semibold tabular-nums">{formatKES(fee.price)}</span>
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2.5 text-sm">
                    {fee.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <Button asChild className="w-full">
                      <Link to={`/book?service=${fee.serviceId}`}>Book Now</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              icon={Receipt}
              title="No fees published yet"
              description="Please call the front desk and we will tell you the cost of your visit."
              action={
                <Button asChild variant="outline">
                  <Link to="/contact">Contact the front desk</Link>
                </Button>
              }
            />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Check your cost</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">How will you pay?</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose how you pay and we show what you would pay for each visit.
        </p>

        <div role="group" aria-label="How will you pay" className="mt-5 flex flex-wrap gap-2">
          {PAYMENT_ROUTES.map((r) => {
            const on = r === route;
            return (
              <Button
                key={r}
                type="button"
                size="sm"
                variant={on ? 'default' : 'outline'}
                aria-pressed={on}
                onClick={() => choose(r)}
                className="rounded-full"
              >
                {r}
              </Button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-accent p-5 md:p-6">
          <p className="font-heading text-lg font-bold leading-snug">{callout}</p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl bg-card shadow-sm">
          {hasFees ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Standard price</TableHead>
                  <TableHead className="text-right">{`You pay with ${route}`}</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Book</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FEES.map((fee) => {
                  const pays = payFor(fee, route);
                  return (
                    <TableRow key={fee.id} className="transition-colors duration-fast hover:bg-muted/60">
                      <TableCell className="font-semibold">{fee.name}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {fee.fromPrefix ? 'from ' : ''}
                        {formatKES(fee.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {pays === 0 ? (
                          <span className="font-semibold text-primary-ink">Nothing to pay</span>
                        ) : (
                          <span className="font-mono tabular-nums">{formatKES(pays)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/book?service=${fee.serviceId}`}>Book</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                icon={Receipt}
                title="No prices to show"
                description="Pick another payment route or call the front desk for a quote."
              />
            </div>
          )}
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Amounts are estimates. Your cover and benefit limits decide the final amount; the front desk checks before your visit.
          </span>
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Payments</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Accepted insurance and payments</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {ACCEPTED_PAYMENTS.map((p) => (
            <Badge key={p} variant="secondary" className="px-3 py-1 text-sm font-semibold">
              {p}
            </Badge>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-card p-5 shadow-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-ink" aria-hidden="true" />
          <div>
            <h3 className="font-heading text-base font-bold">Insurance partners</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We work with SHA, AAR Insurance, Jubilee Health, Britam, CIC and Madison. Bring your card to every visit.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 md:px-6 md:pb-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Questions</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">Fees and insurance, answered</h2>
        <Accordion type="single" collapsible className="mt-6 w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={`faq-${i}`} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-heading text-base font-semibold">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}

export default FeesPage;
