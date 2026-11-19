import { Helmet } from 'react-helmet-async';
import { SITE } from '@/config/site';

/** Per-page metadata. Title ≤ 60 chars, description ≤ 160. */
export function Seo({ title, description, noindex }: { title: string; description: string; noindex?: boolean }) {
    const full = title.length > 60 ? title.slice(0, 57) + '...' : title;
    return (
        <Helmet>
            <title>{full}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={full} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={SITE.ogImage} />
            <meta property="og:type" content="website" />
            {noindex ? <meta name="robots" content="noindex" /> : null}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'MedicalClinic',
                    name: SITE.name,
                    description: SITE.tagline,
                    telephone: '+254710268389',
                    medicalSpecialty: ['Family medicine', 'Paediatrics', 'Dentistry'],
                    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
                    openingHours: ['Mo-Fr 07:30-19:00', 'Sa 08:00-16:00', 'Su 09:00-13:00'],
                    availableService: ['General Consultation', 'Child Vaccinations', 'Dental Care', 'Laboratory'],
                })}
            </script>
        </Helmet>
    );
}
