/**
 * chart-series-keys.test.tsx — field names and the percent scale.
 *
 * ClassFlow (staging, 2026-10-21) plotted `{ label, fill }` rows: recharts
 * copies a datum's fields onto its bar, so `fill: 0.79` painted every bar
 * black; and its 0-1 ratios under valueFormat="percent" read "1.2%" on the axis.
 */
import { render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('recharts', async (orig) => {
    const actual = await orig<typeof import('recharts')>();
    const React = await import('react');
    // recharts v2's Bar is a class component and still honours defaultProps;
    // recharts v3 made it a function component, and React 19 dropped
    // defaultProps for function components — the old
    // `Bar.defaultProps = { isAnimationActive: false }` patch silently stopped
    // applying there, so jsdom (which never runs the animation frames) saw an
    // empty bar layer and the count assertions read 0. Version-gate the two
    // mechanisms: patch classes, wrap function components so the prop is
    // forced at the module boundary and bars render synchronously.
    const bar = actual.Bar as unknown as Function & { defaultProps?: Record<string, unknown> };
    const barIsClass = typeof bar === 'function' && !!bar.prototype?.isReactComponent;
    if (barIsClass) {
        bar.defaultProps = { ...bar.defaultProps, isAnimationActive: false };
    }
    return {
        ...actual,
        ...(barIsClass
            ? {}
            : {
                Bar: (props: Record<string, unknown>) =>
                    React.createElement(actual.Bar as never, {
                        ...props,
                        isAnimationActive: false,
                    }),
            }),
        // jsdom has no layout, so give the chart a real size to draw bars at.
        ResponsiveContainer: ({ children }: { children: ReactNode }) =>
            React.isValidElement(children)
                ? React.cloneElement(children as never, { width: 600, height: 260 })
                : null,
    };
});

import { Chart, formatPercent } from '@/components/ui/chart';

const rows = [
    { label: 'Sunrise Flow', fill: 0.79 },
    { label: 'Power', fill: 1.11 },
    { label: 'Yin', fill: 0.42 },
];

const BAR_SELECTOR = '.recharts-bar-rectangle path, .recharts-bar-rectangle rect';

// Describe what the chart actually rendered, so a zero-bar failure pinpoints
// itself instead of reading "expected 0 to be 3".
const chartDiagnostics = (container: HTMLElement) => {
    const classes = new Set<string>();
    container.querySelectorAll('[class*="recharts"]').forEach((el) => {
        for (const c of (el.getAttribute('class') ?? '').split(/\s+/)) {
            if (c.startsWith('recharts')) classes.add(c);
        }
    });
    return [
        `bar nodes: ${container.querySelectorAll(BAR_SELECTOR).length}`,
        `recharts classes: ${[...classes].sort().slice(0, 14).join(' ') || '(none)'}`,
    ].join(' | ');
};

// Bars animate in through requestAnimationFrame — on some recharts majors the
// bar layer only fills after the first frame. Poll briefly for it, then fall
// through to the diagnostics.
async function barFills(container: HTMLElement): Promise<(string | null)[]> {
    try {
        await waitFor(
            () => expect(container.querySelectorAll(BAR_SELECTOR).length).toBeGreaterThan(0),
            { timeout: 1500 },
        );
    } catch {
        // the diagnostics on the assertion below tell the story
    }
    return [...container.querySelectorAll(BAR_SELECTOR)].map((el) => el.getAttribute('fill'));
}

describe('Chart series keys', () => {
    it('a series named `fill` keeps the accent colour', async () => {
        const named = render(<Chart data={rows} xKey="label" series="fill" type="bar" />);
        const fills = await barFills(named.container);
        expect(fills.length, `named — ${chartDiagnostics(named.container)}`).toBe(3);
        for (const f of fills) expect(f).not.toMatch(/^[\d.]+$/);
        const plain = render(
            <Chart
                data={rows.map((r) => ({ label: r.label, value: r.fill }))}
                xKey="label"
                series="value"
                type="bar"
            />,
        );
        const plainFills = await barFills(plain.container);
        expect(plainFills.length, `plain — ${chartDiagnostics(plain.container)}`).toBe(3);
        expect(fills).toEqual(plainFills);
    });

    it('the x key and series keep their data under any name', async () => {
        const { container } = render(
            <Chart
                data={[
                    { stroke: 'Mon', radius: 4 },
                    { stroke: 'Tue', radius: 9 },
                ]}
                xKey="stroke"
                series="radius"
                type="bar"
            />,
        );
        const fills = await barFills(container);
        expect(fills.length, chartDiagnostics(container)).toBe(2);
        expect(container.textContent).toContain('Mon');
    });
});

describe('Chart percent', () => {
    it('takes 0-1 fractions', () => {
        expect(formatPercent(0.79)).toBe('79%');
        expect(formatPercent(1.11)).toBe('111%');
        expect(formatPercent(0.0425)).toBe('4.3%');
        expect(formatPercent(0.0425, true)).toBe('4%');
    });

    it('says so in the console when handed 0-100', () => {
        const err = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <Chart
                data={rows.map((r) => ({ ...r, fill: r.fill * 100 }))}
                xKey="label"
                series="fill"
                type="bar"
                valueFormat="percent"
            />,
        );
        expect(
            err.mock.calls.some((c) =>
                /\[Chart\] valueFormat "percent" takes a 0-1 fraction/.test(String(c[0])),
            ),
        ).toBe(true);
    });

    it('stays quiet for fractions, including an overfull 111%', () => {
        const err = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(<Chart data={rows} xKey="label" series="fill" type="bar" valueFormat="percent" />);
        expect(err.mock.calls.some((c) => /\[Chart\]/.test(String(c[0])))).toBe(false);
    });
});
