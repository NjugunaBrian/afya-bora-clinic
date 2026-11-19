import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Slide = {
    id: string;
    image: string;
    alt: string;
    eyebrow: string;
    heading: string;
    sub: string;
    cta: string;
    to: string;
};

const SLIDES: Slide[] = [
    {
        id: 'slide-welcome',
        image: '/assets/hero-doctor.png',
        alt: 'A friendly Kenyan doctor talking with a patient at Afya Bora Clinic',
        eyebrow: 'Nairobi and Nyeri',
        heading: 'Quality Healthcare, Close to You.',
        sub: 'Friendly family doctors in Nairobi and Nyeri. Book a visit in under a minute.',
        cta: 'Book Appointment',
        to: '/book',
    },
    {
        id: 'slide-team',
        image: '/assets/team.png',
        alt: 'The Afya Bora care team standing together in the clinic',
        eyebrow: 'Our team',
        heading: 'Caring Doctors. Modern Facilities. Real Results.',
        sub: 'Our team explains every step in plain words, so you always know what happens next and why.',
        cta: 'View Services',
        to: '/services',
    },
    {
        id: 'slide-family',
        image: '/assets/nurse-child.png',
        alt: 'A nurse gently caring for a young child at Afya Bora Clinic',
        eyebrow: 'For the whole family',
        heading: 'Family care for every age',
        sub: 'Paediatric and family doctors who take time with children and parents alike.',
        cta: 'Meet our doctors',
        to: '/doctors',
    },
    {
        id: 'slide-lab',
        image: '/assets/lab.png',
        alt: 'A laboratory technologist preparing samples at the Afya Bora lab',
        eyebrow: 'Specialised care',
        heading: 'Specialised care, explained simply',
        sub: 'Senior doctors and clear written plans for long-term and specialist care.',
        cta: 'See specialised treatments',
        to: '/services',
    },
    {
        id: 'slide-booking',
        image: '/assets/reception.png',
        alt: 'The bright reception desk at Afya Bora Clinic',
        eyebrow: 'Online booking',
        heading: 'Easy online booking',
        sub: 'Choose a doctor and a time that suits you. We confirm by phone or WhatsApp.',
        cta: 'Pick a time',
        to: '/book',
    },
];

const INTERVAL_MS = 6000;
const SWIPE_PX = 40;

export function HeroCarousel() {
    const count = SLIDES.length;
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const startX = useRef<number | null>(null);

    const slide = SLIDES[index]!;

    const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
    const goTo = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);

    // Respect reduced motion: start paused, and pause if the preference turns on later.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches) setPlaying(false);
        const onChange = () => {
            if (mq.matches) setPlaying(false);
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // Autoplay. The timer restarts on every slide change, so manual moves get a full interval.
    const canAutoplay = playing && !hovered && !focused;
    useEffect(() => {
        if (!canAutoplay) return;
        const t = window.setTimeout(next, INTERVAL_MS);
        return () => window.clearTimeout(t);
    }, [index, canAutoplay, next]);

    function onPointerDown(e: PointerEvent<HTMLElement>) {
        startX.current = e.clientX;
    }
    function onPointerUp(e: PointerEvent<HTMLElement>) {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (dx > SWIPE_PX) prev();
        else if (dx < -SWIPE_PX) next();
    }
    function onPointerCancel() {
        startX.current = null;
    }

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured care at Afya Bora Clinic"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            className="relative isolate h-[78vh] min-h-[30rem] w-full touch-pan-y overflow-hidden bg-muted"
        >
            {/* Slides crossfade by opacity. Only the active one is exposed to assistive tech. */}
            {SLIDES.map((s, i) => (
                <div
                    key={s.to}
            aria-hidden={i !== index}
            className={cn(
                'absolute inset-0 -z-10 transition-opacity duration-slow ease-out',
                i === index ? 'opacity-100' : 'opacity-0',
            )}
        >
            <img
                src={s.image}
                alt={s.alt}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
            />
            <div className="scrim-side absolute inset-0" aria-hidden="true" />
        </div>
    ))}

{/* Overlay card + controls share the page container (max-w-7xl). */}
<div className="absolute inset-0 z-10"><div className="relative mx-auto h-full max-w-7xl">
    <div className="absolute inset-x-4 bottom-40 mx-auto max-w-md md:inset-x-auto md:bottom-auto md:right-6 md:top-1/2 md:mx-0 md:-translate-y-1/2">
        <div key={slide.heading} className="glass animate-fade-in-up rounded-3xl p-6 md:p-8">
        <p className="on-scrim-muted text-xs font-semibold uppercase tracking-wider">{slide.eyebrow}</p>
        <h1 className="on-scrim mt-2 font-heading text-2xl font-bold leading-tight tracking-tight md:text-4xl">
            {slide.heading}
        </h1>
        <p className="on-scrim-muted mt-3">{slide.sub}</p>
        <Button asChild size="lg" className="mt-6">
            <Link to={slide.to}>
                {slide.cta}
                <ArrowRight aria-hidden="true" />
            </Link>
        </Button>
    </div>
</div>

    {/* Controls: dots, pause/play, prev/next. */}
    <div className="absolute inset-x-4 bottom-24 flex items-center justify-between gap-3 md:inset-x-6 md:bottom-28">
        <div className="flex items-center gap-1" role="group" aria-label="Choose a slide">
            {SLIDES.map((s, i) => {
                const active = i === index;
                return (
                    <button
                        key={s.to}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={active ? 'true' : undefined}
            onClick={() => goTo(i)}
            className="flex h-8 items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            <span
                className={cn(
                    'block h-2.5 rounded-full transition-[width,background-color] duration-base ease-out',
                    active ? 'w-8 bg-primary' : 'w-2.5 bg-card',
                )}
            />
        </button>
        );
          })}
    </div>

    <div className="flex items-center gap-2">
        <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => setPlaying((p) => !p)}
        >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </Button>
        <Button type="button" variant="secondary" size="icon" aria-label="Previous slide" onClick={prev}>
            <ChevronLeft aria-hidden="true" />
        </Button>
        <Button type="button" variant="secondary" size="icon" aria-label="Next slide" onClick={next}>
            <ChevronRight aria-hidden="true" />
        </Button>
    </div>
</div>
    </div></div>
    </section>
  );
}

export default HeroCarousel;
