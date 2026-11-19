import type { ReactNode } from 'react';

/** Inner-page banner: photo, dark scrim, the page's single <h1> and a one-line description. */
export function PageBanner({
    title,
    description,
    image,
    alt,
    children,
}: {
    title: string;
    description: string;
    image: string;
    alt: string;
    children?: ReactNode;
}) {
    return (
        <section className="relative isolate overflow-hidden">
            <img src={image} alt={alt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div className="scrim-side absolute inset-0 -z-10" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                <h1 className="on-scrim max-w-2xl font-heading text-3xl font-bold md:text-5xl">{title}</h1>
                <p className="on-scrim-muted mt-3 max-w-xl text-base md:text-lg">{description}</p>
                {children ? <div className="mt-6">{children}</div> : null}
            </div>
        </section>
    );
}
