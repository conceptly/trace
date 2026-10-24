# TRACE : Toronto — Framer Migration Progress

Tracks the move from the static build (`trace-antigravity/`, Netlify) to Framer. The plan and working rules are in [build-instructions.md §16](build-instructions.md#16-migration-to-framer-plan-october-2026).

**Status key:** ✅ done · 🟡 in progress · ⬜ not started · ⏸ paused

**Last updated:** 25 Oct 2026

---

## Where things live

| What | Where |
|---|---|
| Framer project | "Trace.Design" (was "Youthful Scone"), project id `BTWkApQ3pJgFVyoNzc31` |
| Published test site | https://youthful-scone-296021.framer.app (last published before the Home page rebuild; everything since is unpublished) |
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
| 5 | Remaining pages and behaviour | 🟡 |
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

### Home page component rebuild

One step at a time. Each step ends with screenshots, and Etual refines the design before the next step starts.

| Step | Components | Status |
|---|---|---|
| 1 | **Photo**: Image, Radius; ratio variants 1:1 / 4:3 / 3:2 / 16:9 (fill width, height from the ratio). Used in Place card (3:2, radius 0) and the place page hero (16:9, radius 16). Alt text comes from the image itself | ✅ built, waiting for design review |
| 2 | **Buttons**: Button gets an Outline variant (with hover and pressed) and an On Click event; new **Icon button** (34px; Default / Active / hover / pressed; Icon dropdown; On Click event). Phone search uses it | ✅ built, waiting for design review |
| 2b | **Button states to Figma** (`4015:16415`, `4015:16430`): Primary 36px / Secondary 30px, new 12px "Button" text style; hover = yellow + elevated shadow; pressed = inner shadow + teal `#0D7A82` border, teal label; Primary disabled (50% yellow) and Secondary disabled (card glass). Secondary keeps a light label on dark backgrounds. Old dark Secondary removed. New **Side tab** (Quick Guide tab, `4015:16764`: 36px → 56px on hover, yellow border when pressed) and **Locate button** (`4330:7093`, 42px; elevated hover, inset pressed). Hover and the drawer opening checked in Preview | ✅ built, waiting for design review |
| 2b++ | **Button refinements** (Figma `4015:16415`, `4015:16430`, 24 Oct): padding 12/24, gap 8, radius 24, 1px borders, 18px icons; text styles **CTA Primary** (Josefin Medium 16, 0.02em; was "Button") and **CTA Secondary** (Josefin Regular 16). New colour tokens in Brand: CTA hover `#F2F040`, CTA focused border `#0D7A82`, CTA focused ring `#7A9A8E`, CTA disabled (50% yellow), Background base `#F5F9F6`, Card glass, Divider light `#CDDBD0`. Primary: default ring border, hover = CTA hover + teal border + shadow, pressed = teal border/text + inner shadow, disabled 50%. **Secondary light** = Figma Secondary (bg-base fill, ring border), with a new **Secondary light disabled**. The dark-background **Secondary** got the same sizes and states but keeps its light label and yellow border | ✅ built, waiting for design review |
| 2b+ | **Button leading icon**: new properties **Show leading icon** (off by default) and **Leading icon** (dropdown, default Back). Existing ones renamed **Show trailing icon** / **Trailing icon**. The leading icon follows the trailing icon's colour in every state. Used on the drawer's "Back to the map!" (leading back arrow, no trailing icon) | ✅ built, waiting for design review |
| 2c | **Adobe fonts**: `AdobeFonts.tsx` loads kit `evd2cyp` and swaps the text styles to ITC Avant Garde Gothic Pro and Adelle on the published site and in Preview (checked in Preview). On Home and Place pages. Still needed: add Avant Garde Medium and Demi to the kit; re-check the 3px label offset with the real fonts; drag `AdobeFonts.tsx` into **1 Foundations** | ⏸ paused (23 Oct): both "Adobe fonts (keep)" layers are hidden and the code fonts are back to Josefin Sans / Roboto Slab while Etual tests the original pair. To turn it back on, show the two layers again and put the Adobe families first in `TraceMap.tsx` and `RouteControls.tsx` |
| 2d | **Start CTA states** (Figma `4008:15091` + live build): live sizes (44px, 16px radius, 36px circle) and type (new "CTA title" 13px Medium caps, "CTA subtitle" 11px Light); Figma hover (yellow glow, yellow text) and pressed (yellow border, yellow text, inner shadow); live **Started** state per route (white border + soft ring, yellow title) with tap-again to hide the path (`toggleRoute()` in TraceStore); keyboard focus ring and Enter/Space from the override. Tested in Preview. Not built: the "Next spot" in-route variant | ✅ built, waiting for design review |
| 2e | **Day/Night toggle** matched to the live build: Day = light `#EBF2EE` pill with the knob (dark, inset shadow) on the moon; Night = dark `#2D4855` pill with the knob (light) on the sun; 0.5px `#CDDBD0` border; 56×28 (24px slots, 16px icons). Hover = Figma yellow border + faint tint on the slot you'd switch to. `withMapModeToggle` switches the map through a shared `useMapMode` store (the map's own Mode setting applies until the toggle is used); keyboard Enter/Space, `role="switch"`. Tested in Preview. Not done: brighter route colours at night (live swaps them), remembering the choice | ✅ built, waiting for design review |
| 3 | **Top nav**: **Nav item** (Active / Default + hovers; Label, Link), **Search field** (no placeholder), **Day/Night toggle** (Day / Night, click switches the look only), **Logo** (links home). The nav stays a page frame with breakpoint overrides; turning it into one Top nav component waits for the second page | ✅ built, waiting for design review |
| 4 | **Quick Guide**: **Info row**, **Guide step** (Step, Heading, Highlight, 2 rows, optional button), **Guide drawer** (340px, close button, ©). Opens as a page overlay from the Quick Guide tab, with a dimmed backdrop that closes it. Tested in Preview. "To the guide" has no link until the City Guide page exists | ✅ built, waiting for design review |
| 4b | **Quick Guide matched to the live build** (Figma `2734:11961`): drawer and steps restyled from the live CSS (title 16px light caps, plain ×, "Step N" 11px, 16px headings with a yellow rule, 80px label column, Roboto Slab Light text, no rule above ©). New text styles: Drawer title, Step label, Step heading, Info label, Info text, Footnote. Phone: Side tab "Left" variant on the left edge opens the drawer full screen. Tested in Preview on phone | ✅ built, waiting for design review |
| 5 | **Welcome card** (not on the live site; turned off on phone, kept for later) (3 pages: welcome, Step 1, Step 2; Next → Next → Let's go; × and Close the Window) and **Page dots** (1 / 2 / 3). Shown on phone over the map through a **Welcome layer** component (Open / Closed). It shows on every visit; remembering that it was closed needs a small code override. Pages 2–3 copy is a draft | 🟡 needs a Preview check |
| 6 | **Mobile menu**: **Menu tile** (Nav / Nav active / Route / Contact; Title, Subtitle, Icon, Tint, Link, On Click) and a full-screen menu overlay opened by the menu icon. Route tiles select the route and close the menu; Artist's Pick shows the "under construction" note. Tested in Preview | ✅ built, waiting for design review |
| 7 | **Near You drawer** (phone) is now a component with Open / Closed variants; tap the header to toggle. Starts closed. Tested in Preview | ✅ built, waiting for design review |
| 8 | **Spot drawer** (Figma `4187:31914` desktop, `2734:12541` mobile, values from the live CSS): canvas component bound to the Places CMS — breadcrumb with back arrow and route tag, title with route bar, author/year, address, 16:9 photo, About, Interesting fact, Designer's note box, optional Clue box, "TO THE TRACE CITY GUIDE" + "Back to the map!" (new Button variant **Secondary light**). New text styles: Spot title, Spot meta, Spot body, Breadcrumb, Route tag. New CMS fields **Route name** and **Route colour** (filled for the 6 test places; include them in the import). Map: desktop marker click toggles the 417px drawer, phone tap shows the popup whose link opens a full-screen drawer; Near You photos fly the map there (offset for the drawer) and open it; the Quick Guide tab hides while it's open. **Place page** now uses the same component on a light page (640px, with the Clue). Tested in Preview on desktop and phone. Open points: the guide button links to the place page until a City Guide page exists; Fact/Note show even when empty | ✅ built, waiting for design review |
| 10 | **4px spacing pass** (24 Oct, styleguide §6): every component, Home and City Guide snapped to the 4px grid (93 layers: e.g. nav item 9/14 → 8/16, filter rows 10 → 12 radius and 8/12 padding, gem card body 12/14/13 → 12, chips 7/8 → 8, route rows 370 → 368, map sidebar 418 → 416, spot drawer 417 → 416, icon buttons 34 → 32, locate 42 → 44, City Guide group gaps 28/14 → 32/16). Components briefly got Radius / Gap / Padding Number variables; **removed 25 Oct** (33 variables back to plain values, no visual change) because Preview ignored changes to them (found on the Near You drawer gap: canvas 20, Preview 12). Spacing is now edited in the component itself. Exceptions listed in styleguide §6 | ✅ built, waiting for design review |
| 10b | **Canvas and Preview fixes** (25 Oct): Start CTA variants follow the Typography refinements on every route (auto height, 40px circle, gap 12, title-case labels); Start CTA radius 999 and the 16px inline radius removed from `withStartCta`; Spot drawer panel at 0% opacity with clicks off on the canvas, restored by `withSpotDrawerPanel` when a place opens (tested desktop and phone); Near You drawer gap 20 | ✅ built, waiting for design review |
| 9 | **Code-driven pieces**: search suggestions, Day/Night switching the map and UI, photo markers, geolocate | ⬜ |

Images drawn by code (Near You tiles, map markers, map popup) follow the Photo component's sizes and radii but can't use the component itself.

### Breakpoints (23 Oct 2026)

Desktop 1280+ · Laptop 992–1279 (new; search field 240px) · Tablet 768–991 · Phone 0–767, matching the live site's 768px phone switch. In Framer a breakpoint's number is where it starts; it runs up to the next one. The map code uses the same 768px switch. The canvas always shows 100vh as 800px, so check real heights in Preview by typing them into its W×H fields: Desktop 1280×720, Laptop 992×640, Tablet 768×954, Phone 390×664.

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

## 5. Remaining pages and behaviour 🟡

- 🟡 City Guide page `/city-guide` (24 Oct, built from the live build and Figma mobile `2734:12063`; waiting for design review)
  - Made by duplicating Home, so the nav, menu and breakpoints carry over. City Guide is the active nav item; nav items and menu tiles link Map → `/` and City Guide → `/city-guide`; the spot drawer's "To the Trace City Guide" button links here
  - Desktop / Laptop / Tablet: dark 280px sidebar (240px on Tablet) with **Filter row** ×6 (All Routes + 5 routes, counts, checkbox) and **Sort option** ×4 (Top Picks, Proximity to you, A → Z, Z → A), "Showing N gems" and Clear filters. Light content: "City Guide" title, one group per route (dot, name, "N gems", 1px `#BDD0D5` rule) with a CMS grid of **Gem card** (16:9 Photo, 3px route stripe, name, address, route tag). Columns fill at 220px minimum
  - Phone: title with "Sort by …" (tap to cycle Top Picks / A → Z / Z → A), **Route chip** row (All + 5 routes, scrolls sideways), divider, one CMS list of **Gem row** (4px route strip, 116px square photo, caps title, route tag, 3-line description)
  - Cards link to the CMS place page (the drawer stays on the map, the page belongs to the guide)
  - `GuideControls.tsx`: multi-select route filters (none or all selected = All), counts, Clear filters, sort. A–Z / Z–A are extra copies of each CMS list sorted by name; the current sort shows one copy. On the canvas all three copies are visible, so each group looks tripled there
  - New text styles: Gem name, Gem address, Gem tag, Gem title, Gem about, Chip, Filter label, Filter count, Sidebar label. Components are in the "9 City Guide" asset folder
  - Tested in Preview (desktop): filters, counts, Z → A, card → place page. Phone checked on the canvas only
  - ⬜ Proximity sort (cards need coordinates; it shows the Top Picks order for now)
  - ⬜ "See more" per group (not needed with 6 spots)
  - ⬜ Search with suggestions
  - ⬜ Empty state for Artist's Pick (0 gems; the group shows its header only)
  - ⬜ Back arrow before the title on desktop (live: "‹ CITY GUIDE")
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
| 23 Oct 2026 | Search placeholder removed; `aria-label` as the accessible name | `4f61806` | ⬜ Framer's pill still shows "Search for spots or routes!" |
| 23 Oct 2026 | Desktop City Guide card thumbnails keep 16:9 (`aspect-ratio: 16 / 9` instead of a fixed 120px height) | `327d622` | ✅ Gem card uses the Photo component at 16:9 |
| 24 Oct 2026 | Buttons match the refined Figma / Framer Button (44px, 12/24 padding, 24px radius, 16px Josefin, 18px icons, CTA tokens, hover / pressed / disabled / focus). Typed caps removed: "To the Trace City Guide", "To the guide", Start CTA text (caps kept by CSS) | (this commit) | ✅ already in Framer |
| 25 Oct 2026 | Framer typography and spacing synced to the live site (styleguide §5 table): Section 20px, Label L 20px, Label M SemiBold, CTA title 18px title case, Spot meta 14px Light, Spot body 140%, Route tag 0.02em, Gem name 16px, Gem address 14px; Start CTA pill (48px, 40px circle, no subtitle); spot drawer section gap 4, meta gap 8, breadcrumb gaps 4 (arrow → path, inside the path), "City Guide" and slash 2px optical top padding, breadcrumbs pulled 12px left with gap 0 (desktop and phone) so the back chevron lines up with the content, breadcrumb tag 3/8/1/8 r2, actions gap 12 with 8px top padding (Framer Actions gap 15 → 12); gem card body 12, tags with optical offset; nav labels no longer wrap, nav item padding 6/12/4/12 (optical offset, as aligned in Framer); desktop Near You header on one row like Framer ("Near You" Section 20px Bold, "N spots" Caption 14px Roboto Slab, both `#8AADB5`, 3px optical offset, 12px above the photos, 20px down to the Start CTA); "Explore the Routes" heading in the same Section style with 12px below; City Guide sidebar: section labels 9 → 14px in `var(--divider-strong)` (`#BDD0D5` on this light-theme page) with 12px below, route counts 10 → 14px in `#8aadb5`, "Showing N gems" 11 → 14px, route names 13 → 14px, sort labels 12 → 14px in `#edf4f0` (Framer Sidebar label matched: 14px `#BDD0D5`, 12px below via an 8px wrapper plus the 4px stack gap; Filter label is 14px). Not synced: mobile route tab labels and the Near You dock layout (the live phone dock is built differently) | (this commit) | ✅ from Framer |
| 25 Oct 2026 | Radius pass to the 4px grid from Framer (styleguide §6): buttons, Start CTA (also padding 8/16 and a 32px icon, desktop and phone), nav items, search field (desktop and phone), route rows and the Quick Guide tab 4px; Near You box 8px with 12px padding and an 8px gap, photo tiles 8px (phone tiles 96px). Phone route tabs follow the desktop route rows: 4px left corners, 8/12 padding, 8px gap (the inner button inherits the tab's shape); desktop route rows gap 10 → 8 (Framer Route row). Mobile menu matched to Figma `2734:11998`: nav tiles 4px with titles back to Josefin Regular 16px caps (3/1 optical padding, one-line subtitles), route tiles 4px with 8/12 padding and 16px Medium labels, contact links 8px with 4/8 padding and Roboto Slab Light 15px. City Guide: filter and sort rows 4px with 8/12 padding and an 8px gap, desktop gem cards 4px (Framer Filter row, Sort option and Gem card set to 4px too). Route group counts ("12 gems") 11 → 14px in `var(--divider-soft)` (`#3A6070`, 6.2:1 on the content background; was `#8aadb5`, about 2.5:1). Framer variants missed in the pass were aligned too (Start CTA started states, Button disabled states, Route row base states). Also fixed: the default Typography selection on the map page now waits for the markers instead of a fixed 1.5s delay, which had shown the "under construction" toast on slow loads | (this commit) | ✅ from Framer |
| 25 Oct 2026 | Artist's Pick hidden everywhere until its route is ready: map sidebar row / phone tab, mobile menu tiles, City Guide filter row, chip and desktop group, About route list, Profile tracker. Massey Hall and St. Lawrence Market were wrongly tagged "Artist's Pick" in `data-architecture.js` (the source `map-data/architecture.geojson` has them as Architecture): retagged Architecture, so Architecture now has 17 spots (map sidebar count updated from 15). Uses the `hidden` attribute (plus `[hidden] { display: none !important }` in base.css); remove the attribute and uncomment the `routeOrder` entry in `city-guide.js` to bring it back | (this commit) | ⬜ decide for Framer |

---

### Known gaps (25 Oct 2026)

- ⬜ `index.html` spot drawer has a placeholder photo `assets/img/typography/lees.jpg` that doesn't exist (404 on every load since the first commit; the script swaps in the real photo when a spot opens). Remove the placeholder `src`
- ⬜ No favicon / Apple touch icons (404s in the server log)
- ⬜ Mobile menu Map tile says "5 Routes | 62 Gems" while Artist's Pick is hidden (4 routes visible)
- ⬜ Framer differs from the live site: Menu tile titles (Framer Label L 20px, live Figma 16px caps) and corners (Framer 16, live 4); Route tab corners (Framer 24px half-pill, live 4px); Start CTA phone floating position; spot drawer back-chevron alignment (live pulls the button 12px left)
- ⬜ Icon buttons: Framer 32px, live 34px; touch target 44px on phone still to do
- ⬜ Not synced from Framer: mobile route tab labels, the Near You dock layout on phone

## Decisions log

| Date | Decision |
|---|---|
| Oct 2026 | Framer over Webflow for design flexibility and ease of use; Webflow kept as the paused fallback |
| Oct 2026 | Start on Framer Basic; the city is a field, not a collection, to stay within 2 collections |
| 23 Oct 2026 | The left panel follows the live build where it deliberately differs from the Figma: glyphs on inactive routes, 75% tint on the selected row, small section labels, 418px sidebar |
| 23 Oct 2026 | Mobile inactive route tabs use solid lighter colours instead of opacity (styleguide accessibility rule) |
| 23 Oct 2026 | Place pages replace the spot drawer for now |
| 24 Oct 2026 | City Guide cards open the CMS place page, not a drawer |
| 25 Oct 2026 | No component Number variables for spacing: Preview doesn't pick up changes to them. Spacing stays as plain values in components |
| 24 Oct 2026 | City Guide sort uses CMS-sorted copies of each list (Framer-native) instead of reordering in code |
