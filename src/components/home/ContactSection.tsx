import { Camera, ExternalLink, Globe, Mail, MapPin, MessageCircle, Phone, Siren, ThumbsUp, Video } from 'lucide-react';

import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/button';
import { BRANCHES, type Branch } from '@/lib/demo-data';
import { EMERGENCY_NUMBER, EMERGENCY_TEL, waLink } from '@/lib/format';

const CLINIC_PHONE = '+254 710 268 389';
const CLINIC_EMAIL = 'hello@afyabora.co.ke';
const SOCIAL = [
    { label: 'Facebook', href: 'https://www.facebook.com/afyaboraclinic', icon: ThumbsUp },
    { label: 'Instagram', href: 'https://www.instagram.com/afyaboraclinic', icon: Camera },
    { label: 'YouTube', href: 'https://www.youtube.com/@afyaboraclinic', icon: Video },
    { label: 'Website', href: 'https://www.afyabora.co.ke', icon: Globe },
];

function directionsUrl(branch: Branch) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`;
}

function SocialIcons() {
    return (
        <ul className="flex items-center gap-2" aria-label="Afya Bora on social media">
            {SOCIAL.map((s) => (
                <li key={s.label}>
            <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary-ink shadow-xs transition-[transform,box-shadow] duration-base hover:-translate-y-0.5 hover:shadow-md"
            >
                <s.icon className="h-4 w-4" aria-hidden="true" />
            </a>
        </li>
    ))}
    </ul>
  );
}

function MapPlaceholder() {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {BRANCHES.map((b) => (
                <div key={b.id} className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm">
            <div>
                <p className="font-heading text-lg font-bold">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.address}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start">
                <a href={directionsUrl(b)} target="_blank" rel="noreferrer">
                    <MapPin aria-hidden="true" /> Directions – {b.area.replace(' Town', '')}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
            </Button>
        </div>
    ))}
    </div>
  );
}

export function ContactSection() {
    const phoneHref = `tel:${CLINIC_PHONE.replace(/\s/g, '')}`;

    return (
    <section id="contact-us" className="reveal mx-auto max-w-7xl px-4 pb-12 pt-10 md:px-6 md:pb-16 md:pt-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-ink">Contact</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">Talk to us</h2>
            <p className="mt-3 text-muted-foreground">
              Call, email or message us on WhatsApp. A real person at our front desk will reply during opening hours.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-ink" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Phone</p>
                <a href={phoneHref} className="font-mono tabular-nums underline-offset-4 hover:underline">
                  {CLINIC_PHONE}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-ink" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Email</p>
                <a href={`mailto:${CLINIC_EMAIL}`} className="underline-offset-4 hover:underline">
                  {CLINIC_EMAIL}
                </a>
              </div>
            </li>
            {BRANCHES.map((b) => (
              <li key={b.id} className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-ink" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{b.name}</p>
                  <p className="text-sm text-muted-foreground">{b.address}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-accent p-5">
            <p className="flex items-center gap-2 font-heading text-lg font-bold">
              <Siren className="h-5 w-5 text-primary-ink" aria-hidden="true" /> Emergency line
            </p>
            <p className="mt-1 text-sm">
              For an emergency, call{' '}
              <a href={EMERGENCY_TEL} className="font-mono font-bold tabular-nums text-primary-ink underline underline-offset-4">
                {EMERGENCY_NUMBER}
              </a>{' '}
              or go to the nearest hospital. Do not wait for a reply on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button asChild size="lg" className="self-start bg-card text-foreground hover:bg-card/90">
              <a href={waLink('Hello Afya Bora, I would like to ask about a visit.')} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> WhatsApp us
              </a>
            </Button>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-muted-foreground">Follow us</p>
              <SocialIcons />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-md lg:col-span-7">
          <ContactForm />
        </div>
      </div>

      <div className="mt-12">
        <MapPlaceholder />
      </div>
    </section>
  );
}

export default ContactSection;
