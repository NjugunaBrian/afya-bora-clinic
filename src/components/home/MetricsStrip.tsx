import { useEffect, useRef, useState } from 'react';
import { METRICS } from '@/lib/demo-data';

const DURATION_MS = 1000;

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion() {
    return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

/**
 * Renders the final number straight away, so nothing ever shows 0 statically.
 * When the number first scrolls into view it counts up once from 0.
 */
function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

        let frame = 0;
        let started = false;

        const run = () => {
            started = true;
            const start = performance.now();
            setDisplay(Math.round(value * 0.7));
            const tick = (now: number) => {
                const t = Math.min(1, (now - start) / DURATION_MS);
                setDisplay(Math.round(value * (0.7 + 0.3 * easeOutCubic(t))));
                if (t < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting && !started) {
                    io.disconnect();
                    run();
                }
            },
            { threshold: 0.4 },
        );
        io.observe(el);

        return () => {
            io.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [value]);

    return (
        <span ref={ref} data-numeric className="font-mono text-4xl font-bold tabular-nums text-primary-ink md:text-5xl">
            {display.toLocaleString('en-KE')}
            {suffix}
        </span>
    );
}

/** A single soft band of four clinic numbers. Two columns on mobile, four on desktop. */
export function MetricsStrip() {
    return (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
            <dl className="grid grid-cols-2 overflow-hidden rounded-3xl bg-accent shadow-sm md:grid-cols-4">
                {METRICS.map((m) => (
                    <div
                        key={m.label}
                className="flex flex-col gap-2 p-6 md:p-8 border-border/60 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t md:[&:nth-child(even)]:border-l-0 md:[&:nth-child(n+3)]:border-t-0 md:[&:not(:first-child)]:border-l"
          >
                <dt className="order-2 text-sm font-medium text-muted-foreground">{m.label}</dt>
                <dd className="order-1 m-0">
                    <CountUp value={m.value} suffix={m.suffix} />
                </dd>
        </div>
    ))}
      </dl>
    </div>
  );
}

export default MetricsStrip;
