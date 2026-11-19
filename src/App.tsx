import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import { SiteLayout } from '@/components/site/SiteLayout';
import { StoreProvider } from '@/lib/store';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { DoctorsPage } from '@/pages/DoctorsPage';
import { FeesPage } from '@/pages/FeesPage';
import { BookPage } from '@/pages/BookPage';
import { MyVisitsPage } from '@/pages/MyVisitsPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';

/**
 * Route table. Every page renders inside SiteLayout (info bar, sticky nav,
 * footer, floating WhatsApp button). Pages render their content bare.
 */
const router = createBrowserRouter([
    {
        element: <SiteLayout />,
        errorElement: <RouteErrorPage />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/about', element: <AboutPage /> },
            { path: '/services', element: <ServicesPage /> },
            { path: '/doctors', element: <DoctorsPage /> },
            { path: '/fees', element: <FeesPage /> },
            { path: '/book', element: <BookPage /> },
            { path: '/visits', element: <MyVisitsPage /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);

export default function App() {
    return (
        <StoreProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors closeButton />
        </StoreProvider>
    );
}
