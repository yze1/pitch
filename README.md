# Pitch & Sync

Pitch & Sync is a standalone website currently being developed inside `m/pitch/`. The landing page (`index.html`) is the reference implementation for the remaining pages and should be finalised before its systems are extended across the site.

## Objectives

- Keep the project independent of the surrounding `yze.design merge` repository.
- Preserve a clear, human-readable codebase with no unused, duplicated, obsolete, or commented-out code.
- Prefer universal HTML and CSS rules over page-specific exceptions.
- Derive presentation from context where practical—for example, typography and interaction colours should follow their section background.
- Build reusable systems only for patterns used by multiple pages. Shared markup belongs in `partials/`; shared values belong in CSS custom properties.
- Use native CSS features such as masks, filters, and blend modes instead of duplicating content solely to create visual effects.

## Structure

- `index.html` — landing page and basis for the wider site
- `css/` — project-local styles, separated by responsibility and organised into labelled sections
- `js/` — project-local behaviour, kept small and system-focused
- `partials/` — markup shared across multiple pages
- `assets/` — fonts, icons, logos, and media required by this project
- `data/` — structured project content

## Shared systems

- `css/variables.css` defines the project palette and layout scale.
- `css/layout.css` provides the reset, page structure, grid, spacing, surfaces, media defaults, and responsive rules used by Pitch & Sync.
- `css/typography.css` derives text and interaction colours from inherited `--ink` and text-noise variables.
- `css/noise.css` automatically applies the calibrated red, white, or black texture to coloured surfaces and text.
- `css/media.css` contains shared media systems, including the Mux player and `20y.svg` anniversary overlay.
- `css/landing.css` contains only landing-page presentation, including the single-layer gong transition.
- `data/carousel.json` supplies the landing-page overlapping work carousel.
- `js/media.js` starts gallery GIFs only while hovered.
- `js/carousel.js` builds the JSON-driven, scroll-overlap work carousel.
- `js/layout.js` manages spread text, underlapping sections, matched dividers, footer sizing, and the London clock.
- `js/gong.js` calculates the expanding circle radius and landing-page type layout.
- `partials/header.html` and `partials/footer.html` provide site-wide navigation.
- `partials/contact.html` provides the centred contact, mailing-list, and social-link section used by the landing and holding pages.

Press `N` to outline every surface and text element receiving noise.

## Working principles

1. Work only inside `m/pitch/`. External files may be copied into the project, but the originals must not be changed.
2. Analyse copied code and retain only rules used by Pitch & Sync.
3. Finalise and verify a system on the landing page before applying it elsewhere.
4. Consolidate genuinely repeated systems, such as the Mux player and `20y.svg` presentation shared by the landing and holding pages.
5. Keep paths project-local for now. The site is expected to move to `p&s.yze.design`, where root-relative paths can be adopted later.
6. Update this README when the project’s structure, shared systems, or guiding rules change.
