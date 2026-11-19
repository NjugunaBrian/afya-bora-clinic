import { Seo } from '@/components/site/Seo';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { QuickActions } from '@/components/home/QuickActions';
import { MetricsStrip } from '@/components/home/MetricsStrip';
import { AboutAndWhyUs } from '@/components/home/AboutAndWhyUs';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { BookingSteps } from '@/components/home/BookingSteps';
import { Facilities } from '@/components/home/Facilities';
import { TeamPreview } from '@/components/home/TeamPreview';
import { FeesPreview } from '@/components/home/FeesPreview';
import { Testimonials } from '@/components/home/Testimonials';
import { ContactSection } from '@/components/home/ContactSection';

/**
 * Home — the gallery layout. Each section carries its own rhythm; this page
 * only sets the order and the one notice strip that sits above the contact block.
 */
export function HomePage() {
    return (
        <>
            <Seo
                title="Afya Bora Clinic | Caring for you and your family"
                description="Family healthcare in Kasarani, Nairobi and Nyeri. See our services, trust our doctors, check KES prices and book a visit in under a minute."
            />
            <HeroCarousel />
            <QuickActions />
            <MetricsStrip />
            <div className="band-cream">
                <AboutAndWhyUs />
            </div>
            <ServicesPreview />
            <div className="band-green-soft">
                <BookingSteps />
            </div>
            <div className="band-cream">
                <Facilities />
            </div>
            <TeamPreview />
            <div className="band-green-mist">
                <FeesPreview />
            </div>
            <div className="band-cream">
                <Testimonials />
            </div>
            <div className="band-green">
                <section className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
                    <div
                        role="note"
                        className="rounded-2xl bg-card px-5 py-3 text-sm font-semibold leading-relaxed text-foreground shadow-xs md:px-6"
                    >
                        This website does not replace professional medical advice. In an emergency, call 0720 555 014 or go to the nearest hospital.
                    </div>
                </section>
                <ContactSection />
            </div>
        </>
    );
}

export default HomePage;
