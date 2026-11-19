import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CalendarPlus, Clock, Cross, Menu, MessageCircle, Phone } from 'lucide-react';

import { NAV_SECTIONS, SITE } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SocialIcons } from '@/components/site/SocialIcons';
import { CLINIC_EMAIL, CLINIC_PHONE, EMERGENCY_NUMBER, EMERGENCY_TEL, waLink } from '@/lib/format';
import { LICENCE } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

const NAV = NAV_SECTIONS.flatMap((s) => s.items);

function BrandMark() {
    return (
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Cross className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="font-heading leading-tight">
                <span className="block text-lg font-bold">Afya Bora</span>
                <span className="block text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">Clinic</span>
            </span>
        </Link>
    );
}

function ScrollManager() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.slice(1));
            if (el) {
                el.scrollIntoView();
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
    return null;
}

function TopInfoBar() {
    return (
        <div className="band-blue">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs md:px-6 md:text-[0.8125rem]">
                <a href={EMERGENCY_TEL} className="flex items-center gap-1.5 font-semibold hover:underline">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sm:hidden">Emergency {EMERGENCY_NUMBER}</span>
                    <span className="hidden sm:inline">Emergency / after hours: {EMERGENCY_NUMBER}</span>
                </a>
                <p className="hidden items-center gap-1.5 md:flex">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Mon–Fri 7:30 am – 7 pm · Sat 8 am – 4 pm · Sun 9 am – 1 pm
                </p>
                <p className="hidden lg:block">English · Kiswahili</p>
            </div>
        </div>
    );
}

function Header() {
    const [open, setOpen] = useState(false);
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
                <BrandMark />
                <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 xl:flex">
                    {NAV.map((item) => (
                        <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end ?? item.to === '/'}
                    className={({ isActive }) =>
                        cn(
                            'rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-fast',
                            isActive ? 'bg-accent font-bold text-primary-ink' : 'text-muted-foreground hover:text-foreground',
                        )
                    }
            >
                    {item.label}
                </NavLink>
          ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
                <Button asChild className="max-sm:w-10 max-sm:px-0">
                    <Link to="/book" aria-label="Book Appointment">
                        <CalendarPlus aria-hidden="true" /> <span className="max-sm:hidden">Book Appointment</span>
                    </Link>
                </Button>
                <ThemeToggle />
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="flex w-80 flex-col gap-2 p-4">
                        <SheetTitle className="mb-2">
                            <BrandMark />
                        </SheetTitle>
                        <nav aria-label="Mobile" className="flex flex-col gap-1">
                            {NAV.map((item) => (
                                <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end ?? item.to === '/'}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    'rounded-xl px-4 py-3 text-base font-semibold',
                                    isActive ? 'bg-accent text-primary-ink' : 'text-foreground hover:bg-accent',
                                )
                            }
                  >
                            {item.label}
                        </NavLink>
                ))}
                    </nav>
                    <Button asChild size="lg" className="mt-3">
                        <Link to="/book" onClick={() => setOpen(false)}>
                            <CalendarPlus aria-hidden="true" /> Book Appointment
                        </Link>
                    </Button>
                </SheetContent>
            </Sheet>
        </div>
      </div >
    </header >
  );
}

function Footer() {
    const { pathname } = useLocation();
    return (
        <footer className={cn('band-green border-t', pathname !== '/' && 'mt-16')}>
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm md:flex-row md:items-center md:justify-between md:px-6">
                <p>
                    This website does not replace professional medical advice. In an emergency, call{' '}
                    <a href={EMERGENCY_TEL} className="font-bold underline">{EMERGENCY_NUMBER}</a> or go to the nearest hospital.
                </p>
                <p className="flex flex-wrap gap-x-4 gap-y-1">
                    <Link to="/contact#privacy" className="hover:underline">Privacy notice</Link>
                    <Link to="/contact#disclaimer" className="hover:underline">Medical disclaimer</Link>
                    <span>© {new Date().getFullYear()} Afya Bora Clinic · Licence {LICENCE}</span>
                </p>
            </div>
        </footer>
    );
}

function WhatsAppButton() {
    return (
        <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-ink))] shadow-lg transition-transform duration-base hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:right-6"
        >
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
        </a>
    );
}

/** Public-site shell: info bar, sticky nav, page, footer, floating WhatsApp. */
export function SiteLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <ScrollManager />
            <a
                href="#main"
                className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Skip to content
            </a>
            <TopInfoBar />
            <Header />
            <main id="main" className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
