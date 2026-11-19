import { CalendarCheck, Check, ClipboardCheck, HeartHandshake, Stethoscope } from 'lucide-react';
import { JOURNEY } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

const ICONS = [CalendarCheck, Stethoscope, ClipboardCheck, HeartHandshake];

/**
 * The care journey: Book → Visit → Treatment → Follow-up.
 * `active` is the index of the current step (0-3). Earlier steps show a tick.
 */
export function JourneyBar({ active, className, showBlurb = false }: { active: number; className?: string; showBlurb?: boolean }) {
    return (
        <ol className={cn('grid grid-cols-4 gap-2 sm:gap-4', className)} aria-label="Your care journey">
            {JOURNEY.map((j, i) => {
                const Icon = ICONS[i] ?? CalendarCheck;
                const done = i < active;
                const on = i === active;
                return (
            <li key={j.step} className={cn('flex min-w-0 flex-col gap-1.5', showBlurb ? 'items-start text-left' : 'items-center text-center')} aria-current={on ? 'step' : undefined}>
                <span
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-base',
                        on && 'bg-primary text-primary-foreground shadow-md',
                        done && 'bg-accent text-primary-ink',
                        !on && !done && 'bg-muted text-muted-foreground',
                    )}
                >
                    {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                </span>
                <span className={cn('text-xs font-semibold sm:text-sm', on ? 'text-primary-ink' : 'text-muted-foreground')}>{j.step}</span>
                {showBlurb ? <span className="text-sm leading-snug text-foreground/75">{j.blurb}</span> : null}
            </li>
            );
})}
    </ol >
  );
}
