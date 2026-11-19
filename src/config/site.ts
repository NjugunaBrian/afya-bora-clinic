/**
 * site.ts — brand + navigation + layout configuration for the APP shell.
 *
 * THE AGENT EDITS THIS FILE FIRST. AppShell reads LAYOUT / CONTENT_WIDTH and the
 * nav shells read NAV_SECTIONS from here — change the app's chrome by editing
 * this config, not by re-implementing layout in a page. You MAY restyle the
 * shells (tokens, variants) to fit the brand, but keep this contract intact.
 *
 * This is an authenticated application, not a marketing site: there is no
 * FOOTER_GROUPS and no NAV_CTA. If the product needs a public marketing page,
 * build it as its own route with its own layout.
 *
 * Brand name + a starting LAYOUT are seeded at project-creation time by
 * fullstackScaffoldService; re-pick LAYOUT here on turn 0 if the brief points
 * elsewhere.
 */

/**
 * A lucide icon name. Resolves through the ICONS map in
 * components/layout/nav-icons.tsx; unknown names fall back to a neutral dot, so
 * any lucide name is safe. Common keys: 'home', 'inbox', 'users', 'calendar',
 * 'kanban', 'chart', 'settings', 'briefcase', 'file', 'package', 'activity'.
 */
export type NavIcon = string;

export type NavItem = {
    to: string;
    label: string;
    /** lucide icon name (see NavIcon). */
    icon?: NavIcon;
    /** exact-match the active route. Auto-true for '/' when omitted. */
    end?: boolean;
    /** trailing count pill, e.g. unread / overdue. */
    badge?: string | number;
    /** open in a new tab. */
    external?: boolean;
};

/** A labelled group of nav links. One unlabelled group suits small apps. */
export type NavSection = {
    /** Omit on the primary group to render it without a label. */
    heading?: string;
    items: NavItem[];
};

/**
 * The seven application shells AppShell can compose.
 *
 * Layout follows from information architecture, not house style. Every generated
 * app used to get the sidebar shell whether it suited the app or not, because
 * AppShell hardcoded it and there was no way to say otherwise. A 256px rail
 * holding two links, beside content that had nowhere to go, is the clearest tell
 * of a generated app.
 *
 *   sidebar  Persistent rail + topbar + scrolling main.
 *            Many destinations, or nav that needs labelled groups.
 *   topbar   Horizontal nav in the topbar, no rail, content clamped to 1280px.
 *            A handful of destinations, where a rail is mostly empty space.
 *   focused  Slim bar, no destination list, single centered 768px column.
 *            One view, a wizard, or a flow where nav is a distraction.
 *   canvas   Topbar + full-bleed main that does NOT scroll. The board, map or
 *            editor inside owns the viewport and its own scrolling.
 *   immersive  No bar: the scene fills the viewport and a transparent HUD
 *            strip floats over it. Games, players, creative scenes.
 *   storefront Top nav carrying search + cart, wide content, no page-title
 *            row. Shops, catalogues, marketplaces.
 *   dock     Slim bar, one column, and a bottom dock of 3-5 destinations in
 *            thumb reach. Phone-first personal apps: trackers, journals.
 */
export type LayoutArchetype =
    | 'sidebar'
    | 'topbar'
    | 'focused'
    | 'canvas'
    | 'immersive'
    | 'storefront'
    | 'dock';

/**
 * THIS APP's shell. Set it deliberately on turn 0, from the brief.
 *
 * Count the destinations a signed-in user moves between (the entries you put in
 * NAV_SECTIONS), then sanity-check against the interaction model: a board, map
 * or editor wants 'canvas' regardless of how many destinations it has.
 *
 * Change it HERE. Never edit the layout components to fake a different shape.
 */
export const LAYOUT: LayoutArchetype = 'topbar';

/**
 * Content width policy — INDEPENDENT of where navigation sits.
 *
 * Two orthogonal axes, and conflating them is a real bug: a topbar app full of
 * wide data tables must NOT be clamped, and a settings form in a sidebar app
 * should not run to 1600px.
 *
 *   fluid    Full available width. Data tables, boards, dashboards, any resource
 *            index with many columns. IBM Carbon's high-density interface model
 *            is explicit that complex product interfaces and data dashboards
 *            "use the full width of the browser".
 *   clamped  Centered, readable measure. Forms, detail records, prose, settings.
 *            WCAG 2.1 SC 1.4.8 (AAA) puts the ceiling at 80 characters per line;
 *            Baymard puts optimal body text at 50-75.
 *
 * No pixel figure is authoritative — Polaris caps a page at 998px, Carbon caps
 * its grid at 1584px and says remove it for dense UI, Atlassian never caps.
 *
 * Override a single route with the 'width' prop on AppShell.
 */
export type ContentWidth = 'fluid' | 'clamped';

export const CONTENT_WIDTH: ContentWidth = 'fluid';

export const SITE = {
    name: 'Afya Bora Clinic',
    tagline: 'Caring for you and your family',
    url: 'http://localhost:8888',
    ogImage: '/og.png',
    author: 'Afya Bora Clinic',
};

/** Every public destination. Book Appointment is the header call-to-action. */
export const NAV_SECTIONS: NavSection[] = [
    {
        items: [
            { to: '/', label: 'Home', icon: 'home', end: true },
            { to: '/about', label: 'About', icon: 'users' },
            { to: '/services', label: 'Services', icon: 'activity' },
            { to: '/doctors', label: 'Doctors', icon: 'user' },
            { to: '/fees', label: 'Fees & Insurance', icon: 'receipt' },
            { to: '/visits', label: 'My Visits', icon: 'calendar' },
            { to: '/contact', label: 'Contact', icon: 'mail' },
        ],
    },
];
