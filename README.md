# Afya Bora Clinic — image fix notes

## What was wrong

The source code references these images, but none of them existed in the
project (the text export only captured source files, not binary assets), so
every `<img>` returned 404 and the pages rendered with broken images:

- `public/assets/`: hero-doctor, team, nurse-child, lab, reception,
  consult-room, waiting-area, pharmacy, dr-wanjiku, dr-otieno, dr-halima,
  dr-rotich (all `.png`)
- `public/favicon.png`, `public/apple-touch-icon.png`, `public/og.png`

## What was done

All 16 missing files were created:

- The 12 scene/doctor photos are AI-generated placeholders matched to each
  component's aspect ratio (1344×768 landscape for hero/banners/facility
  grids, 864×1152 portrait for the 4:5 doctor cards).
- The favicon, apple-touch-icon and og image were derived from the generated
  logo/hero art in the clinic's brand green (#5c940d).

They are production-safe stand-ins. To use real photography, replace the
files in `public/assets/` keeping the same filenames and roughly the same
aspect ratios — no code changes are needed.

## Verified

- `npm run build` (tsc + vite) passes.
- Dev server serves all 15 referenced image URLs with HTTP 200.
