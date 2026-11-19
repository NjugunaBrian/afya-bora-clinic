import {
    Activity, Baby, Dumbbell, FlaskConical, HeartPulse, ScanLine, Smile, Sparkles, Stethoscope,
    Syringe, UserRoundSearch, Users, Wind, SmilePlus, type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
    stethoscope: Stethoscope,
    'heart-pulse': HeartPulse,
    users: Users,
    baby: Baby,
    syringe: Syringe,
    smile: Smile,
    sparkles: Sparkles,
    tooth: SmilePlus,
    'flask-conical': FlaskConical,
    'scan-line': ScanLine,
    activity: Activity,
    wind: Wind,
    'user-round-search': UserRoundSearch,
    dumbbell: Dumbbell,
};

/** Service icon by the `icon` name stored on each service. */
export function ServiceIcon({ name, className }: { name: string; className?: string }) {
    const Icon = MAP[name] ?? Stethoscope;
    return <Icon className={className} aria-hidden="true" />;
}
