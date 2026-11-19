import { Facebook, Instagram, Music2, Twitter, Youtube, MessageCircle, type LucideIcon } from 'lucide-react';
import { waLink } from '@/lib/format';

/** Social links. URLs are placeholders: replace with the clinic's real profiles. */
export const SOCIALS: { name: string; href: string; icon: LucideIcon }[] = [
    { name: 'Facebook', href: 'https://facebook.com/afyaboraclinic', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com/afyaboraclinic', icon: Instagram },
    { name: 'X (Twitter)', href: 'https://x.com/afyaboraclinic', icon: Twitter },
    { name: 'TikTok', href: 'https://tiktok.com/@afyaboraclinic', icon: Music2 },
    { name: 'YouTube', href: 'https://youtube.com/@afyaboraclinic', icon: Youtube },
    { name: 'WhatsApp', href: waLink(), icon: MessageCircle },
];

export function SocialIcons({ className = '' }: { className?: string }) {
    return (
        <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Social media">
            {SOCIALS.map(({ name, href, icon: Icon }) => (
            <li key={name}>
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Afya Bora on ${name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary-ink transition-colors duration-fast hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
            </li>
    ))
}
    </ul >
  );
}
