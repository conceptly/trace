# TRACE : Toronto — Framer Migration Progress

Tracks the move from the static build (`trace-antigravity/`, Netlify) to Framer. The plan and working rules are in [build-instructions.md §16](build-instructions.md#16-migration-to-framer-plan-october-2026).

**Status key:** ✅ done · 🟡 in progress · ⬜ not started · ⏸ paused

**Last updated:** 23 Oct 2026

---

## Where things live

| What | Where |
|---|---|
| Framer test project | "Youthful Scone", project id `BTWkApQ3pJgFVyoNzc31` |
| Published test site | https://youthful-scone-296021.framer.app (last published before the Home page rebuild; Home changes are unpublished) |
| Live site (until cutover) | https://tracedesign.art (Netlify, from `main` of `conceptly/trace`) |
| Spot data (source of truth) | `map-data/csv/*.csv`, `map-data/*.geojson` |
| Figma | Trace-Toronto file: desktop layout `4007:2`, route list states `4015:15398`, mobile map `2734:11965`, mobile route tabs `2734:12976` |
| Webflow fallback | Webflow project with style guide variables, Places CMS, playground and 36 icon components (paused) |

---

## Phase overview

| # | Phase | Status |
|---|---|---|
| 1 | Prototype (map, CMS, route lines, place pages) | ✅ |
| 2 | Foundations (styles, components, icons) | ✅ |
| 3 | Home page (desktop, tablet, phone) | 🟡 |
| 4 | Content migration (62 spots, 5 routes) | ⬜ |
| 5 | Remaining pages and behaviour | ⬜ |
| 6 | QA | ⬜ |
| 7 | Cutover to tracedesign.art | ⬜ |
| 8 | After cutover (rollback window, archive) | ⬜ |

---

## 1. Prototype ✅

- ✅ Places CMS collection with 6 test places, each with a detail page at `/places/:slug`
- ✅ Routes CMS collection, with each route's path stored as a JSON coordinate list
- ✅ `TraceMap.tsx`: Mapbox GL JS 3.21 with the day and night styles, route-coloured markers, popups linking to place pages
- ✅ Route lines: dashed line plus night glow, revealed on Start route with an opacity fade and fit to the route
- ✅ `TraceStore.ts` shared store; `PlaceMarker.tsx` and `RouteLine.tsx` bridges from the CMS to the map
- ✅ Published once to the framer.app address and checked live: markers, popups, place pages, route select and reveal

## 2. Foundations ✅

- ✅ Colour styles (surfaces, content, dividers, brand, route colours and their night versions) and text styles
- ✅ Label optical offset: 3px top padding wrapper on Button, Route pill and Place card labels
- ✅ `Icon.tsx`: 36 Streamline Sharp icons with Icon, Color and Size controls
- ✅ Button (Primary / Secondary, hover and pressed, Icon dropdown) and Route pill using the Icon component
- ✅ Place card component

## 3. Home page 🟡

- ✅ Desktop (1200): top nav, 418px sidebar, map, Quick Guide tab, locate button
- ✅ `Route row` component: glyphs on every route, selected variant (75% tint, border, yellow circle and name, description below)
- ✅ `Start CTA` component: "Select a route to begin!", then "START … ROUTE / View path details and stops"
- ✅ `NearYou.tsx`: up to six photos from the selected route, "N SPOTS" / "1 SPOT" count
- ✅ Artist's Pick "under construction" message on tap (desktop row and mobile tab)
- ✅ Tablet (810): desktop layout without the search field
- ✅ Phone (390): menu icon, search icon, full-screen map, `Route tab` component (closed / open / solid inactive), Near You drawer with CTA, locate button on the left
- ✅ Tested in the editor's Preview, desktop and phone: route rows, tabs, Near You and count, Start route
- ⬜ Check place links on a published build (they 404 in Preview only)
- ⬜ Photo markers like the live map (Framer still shows plain dots)
- ⬜ Clicking a Near You photo flies the map to the spot and opens it (live behaviour). Framer currently opens the place page
- ⬜ Search field behaviour (currently a visual placeholder)
- ⬜ Menu icon opens the mobile menu
- ⬜ Near You drawer opens and closes
- ⬜ Locate button follows the drawer height on phone

## 4. Content migration ⬜

- ⬜ Add a City option field to Places and Routes (Toronto for now)
- ⬜ Import Typography spots (12)
- ⬜ Import Architecture spots
- ⬜ Import Art Objects spots
- ⬜ Import Street Art spots
- ⬜ Upload and attach all spot photos (`trace-antigravity/assets/img/`, 161 files)
- ⬜ Import route paths from the GeoJSON LineStrings (Typography, Architecture, Art Objects, Street Art)
- ⬜ Artist's Pick route data (still "Coming soon" on the live site)
- ⬜ Spot-check every spot against the live map: route, coordinates, slug, photo

## 5. Remaining pages and behaviour ⬜

- ⬜ City Guide page: multi-select route filters, A–Z / Z–A / proximity sort, search with suggestions, "See more"
- ⬜ Place detail page: final design (breadcrumb, sections, next/previous)
- ⬜ About page
- ⬜ Profile page (gamification teaser)
- ⬜ Quick Guide drawer (3 how-it-works steps)
- ⬜ Day / night toggle switching the map and the UI
- ⬜ Geolocate (user location, Near You by distance)

## 6. QA ⬜

- ⬜ WCAG AA contrast and focus states on every page (styleguide §9)
- ⬜ Keyboard navigation and screen reader labels
- ⬜ Real-device checks (iPhone, Android)
- ⬜ Page titles, descriptions and share images, including per-place pages
- ⬜ Performance (map and photo loading)
- ⬜ Analytics

## 7. Cutover ⬜

- ⬜ Buy the Framer Basic plan (yearly, about CA$168 + tax)
- ⬜ Connect tracedesign.art and move the DNS from Netlify
- ⬜ Add the new domains to the Mapbox token's allowed URLs
- ⬜ Redirects: `/city-guide.html`, `/about.html`, `/profile.html`, `/index.html`
- ⬜ Publish and check every page on the real domain

## 8. After cutover ⬜

- ⬜ Keep the Netlify site deployable as the rollback for at least a month
- ⬜ Archive `trace-antigravity/` in the repo

---

## Changes made to the live site during the migration

Fixes still land on the current site until cutover. Port each one to Framer too.

| Date | Change | Commit | Ported to Framer |
|---|---|---|---|
| 23 Oct 2026 | Search bar and suggestions contrast (styleguide §10.7) | `3e3c1f7` | ⬜ Framer's pill is still a 32% white fill; switch it to the 15% styleguide fill and `#D6E3DF` placeholder |
| 23 Oct 2026 | Search input text weight 300 → 400 | `d7b4ea8` | ⬜ |
| 23 Oct 2026 | Search placeholder removed; `aria-label` as the accessible name | see git log | ⬜ Framer's pill still shows "Search for spots or routes!" |

---

## Decisions log

| Date | Decision |
|---|---|
| Oct 2026 | Framer over Webflow for design flexibility and ease of use; Webflow kept as the paused fallback |
| Oct 2026 | Start on Framer Basic; the city is a field, not a collection, to stay within 2 collections |
| 23 Oct 2026 | The left panel follows the live build where it deliberately differs from the Figma: glyphs on inactive routes, 75% tint on the selected row, small section labels, 418px sidebar |
| 23 Oct 2026 | Mobile inactive route tabs use solid lighter colours instead of opacity (styleguide accessibility rule) |
| 23 Oct 2026 | Place pages replace the spot drawer for now |
