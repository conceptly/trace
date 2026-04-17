# TRACE : Toronto — Design System

**The Route of Art & Creative Exploration**  
Design system reference for the interactive web map, zine, and marketing campaign.  
Studio: Conceptly Design · Designer: Etual Fomina · Domain: trace.design

---

## 1. Project Overview

TRACE is a non-commercial, multi-platform design ecosystem for exploring the creative side of Toronto. It bridges the gap between digital utility and physical exploration — between passive observing and a game. The app is built around four curated walking routes that map hidden gems most tourist guides ignore: ghost signs, brutalist architecture, street murals, and art objects.

**Core deliverables:**
- Responsive interactive web map (Webflow) at trace.design
- TRACE zine with fold-out print map
- Social media campaign (Instagram, LinkedIn)

**Tone of voice:** Friendly and conversational, like walking the city with a designer friend — not reading a guidebook. Calm, informed, playful.

**Primary audience:** Graphic designers, architects, photographers, design students, and culturally engaged Toronto locals. They walk or bike, they notice details, they want context and storytelling over consumption.

---

## 2. Brand Identity

### 2.1 Logo

**Wordmark:** `TRACE TO`  
The logo is set in ITC Avant Garde Gothic Pro. "TRACE" appears in light weight; "TO" appears as a separate, slightly smaller element offset to the right and set in a bolder weight — a typographic shorthand for "Toronto."

**Logo variants from Figma:**
- `logo-opt2` — primary wordmark (57.6 × 19 pt)
- `logo-mobile-fill500` — compact mobile version (63 × 16 pt)
- `logos` — full brand lockup with wordmark

**Usage rules:**
- Use on dark background (#223740 or map dark overlay) by default
- Minimum size: 63px wide at mobile
- Do not add drop shadows or outlines
- Clear space: equal to the height of the "T" glyph on all sides

---

## 3. Color System

> **Source of truth: `styleguide-app.md`**
> All colour values, contrast ratios, dark/light mode pairs, route colours, and component colour rules are defined and maintained in `styleguide-app.md`. Do not duplicate or override them here. When in doubt, refer to that file.

### Token naming system — surface / content

Tokens are named by **hierarchy position**, not by visual property. This means the same token name resolves to different hex values in dark vs light mode — no token renaming needed when switching modes.

```
surface-1  →  outermost canvas / app shell
surface-2  →  elevated panels, sidebars
surface-3  →  base screen background
surface-4  →  cards, nav bars, drawers
surface-5  →  hairlines, borders, structural edges

content-1  →  primary text / active icons
content-2  →  body copy / secondary labels
content-3  →  muted text / captions / inactive icons
```

**Why surface-4 dark (`#2D4855`) equals content-2 light (`#2D4855`) — and that's fine.**
The same physical colour plays different *roles* depending on mode. In dark mode `#2D4855` is a mid-depth surface (card, nav background). In light mode it becomes readable body text on a light background. The token system handles this correctly: `--surface-4` and `--content-2` both happen to share `#2D4855` as a value, but they are used in the right semantic context in each mode. No conflict; no redundancy.

**Two divider tokens — when to use which:**

| Token | Value (dark) | Value (light) | Use for |
|---|---|---|---|
| `--divider-soft` | `#8AADB5` | `#3A6070` | Internal panel separators — sidebar sections, subtle rule lines |
| `--divider-strong` | `#3D5E6A` | `#BDD0D5` | Card borders, structural page edges, form input outlines |

### Quick reference — authoritative token values (dark mode defaults)

| Token | Dark value | Light value |
|---|---|---|
| `--surface-1` | `#12202A` | `#F4F9FA` |
| `--surface-2` | `#1D3240` | `#EDF5F7` |
| `--surface-3` | `#223740` | `#E4EFF2` |
| `--surface-4` | `#2D4855` | `#FFFFFF` |
| `--surface-5` | `#3D5E6A` | `#BDD0D5` |
| `--content-1` | `#EDF4F0` | `#1D3240` |
| `--content-2` | `#BDD0CC` | `#2D4855` |
| `--content-3` | `#8AADB5` | `#3A6070` |
| `--divider-soft` | `#8AADB5` | `#3A6070` |
| `--divider-strong` | `#3D5E6A` | `#BDD0D5` |

#### Brand & interactive (mode-agnostic)
| Token | Hex |
|---|---|
| TRACE Yellow (CTA / focus) | `#E7E626` |
| Focus / Pressed accent | `#0D7A82` |

#### Route colours (identical in both modes)
| Route | Token | Hex |
|---|---|---|
| Artist's Choice | `--route-artist` | `#0D7A82` |
| Typography | `--route-typography` | `#2B5EA8` |
| Architecture | `--route-architecture` | `#9A4520` |
| Art Objects | `--route-artifacts` | `#257A48` |
| Street Art | `--route-streetart` | `#7E3090` |

For filter chip states, button states, map wireframe colours, focus ring rules, and full accessibility audit see `styleguide-app.md`.

---

## 4. Typography

### 4.1 Typefaces

| Font | Role | Source |
|---|---|---|
| **ITC Avant Garde Gothic Pro** | Display, headings, UI labels, CTA | Licensed / Adobe Fonts (kit: `evd2cyp`) |
| **Adelle** | Body copy, editorial long-form | Licensed / Adobe Fonts (kit: `evd2cyp`) |

**Fallback stack:** `"ITC Avant Garde Gothic Pro", "Josefin Sans", Futura, sans-serif`  
**Body fallback:** `"Adelle", "Roboto Slab", Avro, serif`

> Prototype web fallbacks are **Josefin Sans** (for ITC Avant Garde Gothic Pro) and **Roboto Slab** (for Adelle), both loaded from Google Fonts. See `build-instructions.md` for the exact `<link>` tag.

### 4.2 Type Scale

Base size: 16px. Base grid: 16pt. Viewport: 375pt (iPhone 16/17 Pro).

| Style Name | Size | Weight | Line Height | Color Token | Notes |
|---|---|---|---|---|---|
| H1 | 28px | 700 Bold | 28px / 100% | `content-1` | Page titles |
| H2 | 22px | 700 Bold | 120% | `content-1` | Section headers |
| H3 | 19px | 700 Bold | 120% | `content-1` | Sub-section headers |
| H4 | 17px | 600 SemiBold | 130% | `#D0D0D0` | Must exceed 16px body |
| H5 | 16px | 500 Medium | 135% | `#A8A8A8` | Weight + color distinguish from body |
| P Body Primary | 16px | 400 Regular | 140% | `content-2` | Main reading text |
| P Body Primary Highlights | 16px | 600 SemiBold | 140% | `content-2` | Inline emphasis |
| P Body Secondary | 15px | 400 Italic | 130% | `content-3` | Captions, sub-labels |
| Caption 1 | 12px | 400 Regular | 120% | `content-3` | Metadata, timestamps |
| Caption 2 | 11px | 400 Regular | 120% | `content-3` | Floor: 11px (outdoor mobile conditions) |
| CTA Primary | 12px | 700 Bold ALL CAPS | 120% | `--cta-text` | Uppercase, recognised not read |
| CTA Secondary | 12px | 600 SemiBold Sentence case | 120% | `--cta-text` | Mixed case |
| Nav Label | 10px | 400 Regular | 100% | `content-3` | Bottom nav labels (chrome, not copy) |
| Tags / Category | 9px | 500 Medium | 120% | `content-2` | Route tags, filter pills |
| Map Location | 11px | 400 Regular | 120% | `content-3` | Map overlays |
| Map Distance | 11px | 400 Regular | 120% | `content-3` | Distance metadata |
| Map Route Label | 11px | 500 Medium | 120% | Route color | Coloured per route |
| XP Points | 13px | 700 Bold | 100% | `cta-default` | Monospace, accent — keep separate |
| Quiz Question | 17px | 600 SemiBold | 130% | `content-1` | H4 style + emphasis color override |
| Quiz Hint | 15px | 400 Italic | 120% | `content-3` | = P Body Secondary |

**Key decisions:**
- Body copy floor is 16px (Apple HIG standard). WCAG 14px is a contrast threshold, not a readability floor.
- H4 must be 17px — must visually exceed 16px body through size + weight + color together.
- H5 at 16px is differentiated by weight (500) and color (#A8A8A8) from body.
- Caption 2 floor is 11px, not 10px — outdoor mobile readability.
- 9px Tags and 10px Nav Labels are "recognised not read" UI chrome — tap targets (≥44pt) matter more than text size there.
- CTA 12px ALL CAPS is correct — recognised not read; these are buttons.
- CTA text case: Primary = ALL CAPS, Secondary = Sentence case.
- Quiz Question reuses H4 style with `content-1` color override. No separate style needed.
- XP Points kept as a separate style: monospace required for live counter updates; accent color = reward signal.

---

## 5. Layout & Spacing

**Base grid:** 16pt  
**Viewport:** 375pt wide (iPhone 16/17 Pro)  
**Content margins:** 16pt left/right  
**Content width:** 370pt (402 − 2×16)  
**Top inset (Dynamic Island area):** 62pt  
**Bottom inset (Home Indicator):** 34pt  
**Safe content start:** 62pt from top  
**BottomNav height:** 64pt  
**TopNav height:** 64pt (compact) or 134pt (with search bar)

---

## 6. Screen Inventory

All screens are 402 × 874pt (iPhone 16/17 Pro).

| Screen | Figma Node | Description |
|---|---|---|
| **Home / Map** | `2423:5226` | Interactive map view. Default landing. Shows route pills, NearYouSlider, TopNav with search. |
| **Guide** | `2423:5273` | Guidebook / catalog of all spots, filterable by route. |
| **Profile** | `2423:5282` | User profile, XP tracker, badges, routes in progress, rewards. |
| **Route** | `2423:5241` | Active route view. Shows map + route metadata (visited count, remaining spots, estimated time). |
| **Item Guide — Lee's Palace** | `2423:5539` | Spot detail. Typography route. Full gem screen with photos, about, designer's note. |
| **Item Guide — TMU** | `2423:5573` | Spot detail. Architecture route. |
| **Item Guide — Dreaming** | `2423:5556` | Spot detail. Art Objects route. |
| **Item Guide — Owl** | `2423:5590` | Spot detail. Street Art route. |
| **Item Guide — Annex Wall** | `2423:5607` | Spot detail. Street Art route. |
| **Item Guide — Giant** | `2423:5624` | Spot detail. Artist's Pick route. |
| **Item Guide — Deer** | `2423:5641` | Spot detail. Artist's Pick route. |
| **Settings** | `2423:5351` | Account, appearance (dark/light toggle), language, location permissions, notifications. |
| **Personal Information** | `2423:5445` | Name, email, phone, DOB fields. Change password. Delete account. |
| **Sign Up** | `2423:7596` | Create account form over blurred map background. Display name, email, password. |
| **Login** | `2423:7741` | Sign in form. Email + password, forgot password, Face ID / Touch ID option. |
| **Style Guide** | `2509:2879` | Internal reference frame — not a deliverable screen. |

---

## 7. Component Library

All components live in the **"components dark mode"** section of the Figma file.

### 7.1 Navigation

**BottomNav** (`2423:5964`)  
Three-tab navigation: Map, Guide, Profile.  
Height: 64pt. Icons: 30×30pt. Label: 10px Nav style.  
Variants: `state=Map` | `state=mapActive` | `state=guide` | `state=profile`

**TopNav** (`2423:6142`)  
Logo left, search bar + icon buttons right.  
Variants: `Search=On/Off` × `Mode=Default/Light/route/route2/route2search/route2light-mode` × `Route=Default/on`  
- Default with search: 134pt tall (includes SearchContainer)
- Compact without search: 64pt tall
- Route mode: shows active route indicator + route nav plate

### 7.2 Map & Route

**routes-map** (`2423:6539`)  
Full map container, 403 × 736pt. Two variants: `Route=Default` and `Route=Route2`.  
Overlaid with: SideNavRoutes, spot markers, RoutesHome or RoutesNavigator cards.

**SideNavItem1** (`2423:6005`)  
Route filter pill on the left edge of the map.  
4 states × per route:
- `state=close, mode=active default` — Default (route visible, unpressed)
- `state=open, mode=active` — Expanded (route label visible, 5s timeout before auto-collapse)
- `state=close, mode=active` — Active compact (route is selected, shows ring)
- `state=close, mode=inactive` — Inactive (70% opacity, dimmed)

**SideNavRoutes** (`2423:6026`)  
Full column of 5 route pills: Typography (T), Art Objects (A), Architecture (B for Buildings), Street Art (M for Murals), Artist's Pick (gem icon). Each is a `SideNavItem1` instance.

**Route filter state machine:**
1. Default → tap → Pressed
2. Pressed → Expanding (5s auto-collapse timeout, or second tap collapses)
3. Expanding → Active-Compact (ring appears, brighter color)
4. Any active → tap inactive route → that route becomes Active-Compact, others become Inactive
5. Reset: all routes return to Default

**spot** (`2423:6075`)  
Map pin / marker. Modes: `Active` | `Inactive` | `modal` | `task` | `hintImg` | `guide` | `nameplate` | `nameplate-inactive`

**ButtonRoutes** (`2423:6359`)  
Large primary action button at the bottom of Route screen.  
Variants: `purpose=start` | `purpose=NextSpotRoute`  
Width: 370pt, Height: 54pt.

**NearYouSlider** (`2423:5811`)  
Bottom sheet on the Home screen.  
States: `State=Closed` (156pt tall) | `State=Open` (283pt tall)  
Contains: header with "near you" label + spot count, horizontal scroll of spot cards (100×100pt), ButtonPrimary CTA.

**BufferSpace** (`2423:6818`)  
Spacer component at bottom of map when route active. States: `state=on` | `state=state2`

### 7.3 Buttons

**ButtonPrimary** (`2423:6847`)  
Width: 180pt, Height: 36pt.  
States: `state=Default` | `state=disabled` | `state=pressed`  
Text: 12px ALL CAPS, weight 700.

**ButtonSecondary** (`2423:6860`)  
Width: 160pt, Height: 30pt.  
States: `state=Default` | `state=disabled` | `state=pressed`  
Text: 12px Sentence case, weight 600.

**SearchContainer** (`2423:6805`)  
Width: 370pt, Height: 54pt.  
States: `state=Default` | `state=active-tap` | `state=state3`

### 7.4 Content Components

**GemItem** (`2423:6918`)  
Catalog list item. 369 × 116pt. Contains: thumbnail image (116×116pt), title, route label, description preview.  
Route variants: `Route=type` | `Route=artefacts` | `Route=architecture` | `Route=Murals` | `Route=artist-choice`

**gemsScreen** (`2423:7248`)  
Full gem detail screen content area. 369 × 582pt. Used inside all Item Guide screens.  
Contains: Title block, hero photo (369×211pt), photo thumbnails, Style tags, About text, Designer's Note, Previous/Next Spot links.

**guidebook-content** (`2423:7188`)  
Guide screen content, 401 × 655pt.  
Route variants: `route=Default` | `route=artist` | `route=type` | `route=artifacts` | `route=architecture` | `route=streetart` | `route=az` | `route=azlong`

**RouteTracker** (`2423:7026`)  
Profile screen component. Width: 370pt, Height: 51pt. Shows route progress.

**Badge** (`2423:7123`)  
107.3 × 92pt. States: `state=active` | `state=inactive`

**Rewards** (`2423:7130`)  
107.3 × 92pt. States: `state=active` | `state=inactive`

### 7.5 Tags & Filters

**tag** (`2423:7021`)  
Small content tag. States: `state=active` | `state=inactive`. Used inline in gem descriptions.

**tag (large)** (`2423:7178`)  
Route filter tag in Guidebook. Width: ~94pt, Height: 19pt.

**all-tag** (`2423:7183`)  
"All" filter tag. Width: 34pt, Height: 19pt.

**Sort** (`2423:7027`)  
Sort dropdown component. Variants: `variant=Top Picks` | `variant=A-Z` | `variant=Z-A` | `variant=location`

### 7.6 Icons

**Icons-opt2** (`2423:5899`)  
24×24pt icon set. All icons available:  
Map, Guide, User, Art Objects, Architecture, Street Art, Typography, Experts, Close (solid), Tap, Double Tap, Info Bubble, Light/Dark, Search, Near, Back, Chevron Right, Preferences, Close (regular), Filter, Sort, Sort Circles, Sort Z-A, Sort A-Z, Sort Z-A opt2, Sort A-Z opt2, Location/Map Pin.

**IconNav** (`2423:5879`)  
30×30pt nav icons for BottomNav.  
Modes: `Mode=Dark state=Default` | `Mode=Light state=Default` | `Mode=Dark state=active`

**SideNavIcons** — route identifier icons (30×30pt):  
T (Typography), A (Art Objects), B (Architecture/Buildings), M (Murals/Street Art), Gem (Artist's Pick)

### 7.7 Modals & Overlays

**AboutModal** (`2423:6882`)  
322 × 282pt. Variants: `window=Welcome` | `window=About` | `window=window3`

**ModalClosethePath** (`2423:6873`)  
260 × 214pt. "Stop the journey?" confirmation. Contains ButtonPrimary + ButtonSecondary.

**modal-map** (`2423:6894`)  
Small map overlay modal. Variants: `variant=home` | `variant=task` | `variant=hint` | `variant=guide`

### 7.8 Map Spot Photography

Images are used in three sizes:

| Usage | Size | Component |
|---|---|---|
| Hero (gem detail) | 369 × 211pt | `size=211-hero` |
| Catalog thumbnail | 116 × 116pt | `size=116-catalog` |
| Home slider | 100 × 100pt | `size=100Home` |
| Hint overlay | 54 × 54pt | `size=54-hint` |

---

## 8. Route Filter Interaction — Full State Specification

The side nav route pills are the primary map interaction mechanism. They are **multi-select** — multiple routes can be active simultaneously.

### State Machine

```
Default
  → [tap] → Pressed (visual only, instant)
  → [release] → Active-Expanding (route label visible, full width ~184pt)
    → [5s timeout] → Active-Compact (label hidden, ring visible, icon only ~54pt)
    → [second tap] → Active-Compact (manual collapse)
  Active-Compact
    → [tap] → Inactive (if another route active) OR Default (if only this route active)
Inactive
  → [tap] → Active-Expanding
Reset (all routes)
  → [tap Reset / tap active route when it's the only one] → all return to Default
```

### Color Behavior Per State

| State | Background | Opacity | Ring |
|---|---|---|---|
| Default | Route color @ 30% | 100% | None |
| Active-Compact | Route color, brighter | 100% | 3pt outer ring |
| Inactive | Route color @ 15% | 70% component | None |
| Active-Expanding | Same as Active-Compact | 100% | None (animation only) |

### Figma Implementation
1 base component × 4 route variants × 4 states = 16 variants + expanding width variant  
Width transitions: 54pt (closed) → 184pt (opened) — Figma Smart Animate

---

## 9. Photography & Visual Direction

**Photo specs:**
- Outdoor / editorial: 9000 × 6000px, 3:2 or 2:3 ratio, 300 dpi
- Video stories: 1080 × 1920px, 9:16, 4K 60fps

**Subject matter:**
- Ghost signs and vintage signage
- Brutalist and modernist architecture details
- Street murals (full view + detail close-ups)
- Public art objects and sculpture
- Artist portraits (documentary style)

**Visual style:**
- Slow pace, reflective mood
- Subtle human presence (suggest scale without crowds)
- Urban transitions: busy streets giving way to quiet corners
- High contrast detail shots for editorial use

---

## 10. Map Design

**Map platform:** Mapbox Studio (custom dark basemap already created, see screenshot in Figma session — `infotypography-geocoded` dataset)  
**Embed approach:** Mapme (student plan) using Mapbox Studio custom style as basemap — no-code interactivity layer for route paths, custom markers, and popup cards.

**Map data fields (from Figma data panel):**
- `About` — descriptive text
- `Author` — artist/designer attribution
- `Clue / Hint` — in-app riddle text
- `Designer Note` — curatorial voice note
- `Interesting Fact` — educational detail
- `Latitude` / `Longitude` — coordinates
- `Location` — street address

**Spot marker states:**
- Active: 44×44pt colored circle, route color
- Inactive: dimmed, 70% opacity
- Modal: expanded popup with nameplate
- Task: quiz/riddle state
- Hint image: hint overlay on approach

**Map geographic coverage:** Bloor St to Front St W, Bathurst to Yonge — downtown Toronto core.

---

## 11. Item Guide / Gem Screen Structure

Each spot's detail screen (`gemsScreen`) follows this content order:

1. **Breadcrumb nav** — Guidebook / [Route Name]
2. **Title block**
   - Spot name (H2)
   - User badge label + location icon + neighbourhood
   - Route tag (e.g. "artist's choice")
3. **Hero image** — 369 × 211pt
4. **Photo strip** — 4 × 74pt thumbnails
5. **Divider**
6. **Style section** — tag pills for stylistic categorisation
7. **Divider**
8. **About** — H3 heading + 4-line body copy (P Body Primary)
9. **Divider**
10. **Designer's Note** — H4 heading + body copy (styled differently from About)
11. **Previous Spot / Next Spot** — nav links at bottom

---

## 12. Figma File Reference

**File:** Trace-Mi-Fi-Backup-March-27  
**Key:** `qWtyO6CR3xF5vrACpVBjuU`  
**Link:** https://www.figma.com/design/qWtyO6CR3xF5vrACpVBjuU/Trace-Mi-Fi-Backup-March-27?node-id=2423-4831

**Main page node:** `2423:4831` (canvas "Trace-Hi-Fi-draft")  
**Components section:** "components dark mode" (node `2423:5661`)  
**Style Guide frame:** node `2509:2879`

---

## 13. Webflow Implementation Notes

**CMS collections needed:**
- Spots (gems) — all data fields from map data panel
- Routes — 5 routes with color tokens, icon, description
- Guide articles — zine content repurposed for web

**Responsive behaviour:**
- Primary target: 375pt mobile (iPhone 16/17 Pro)
- All screens are 402pt wide in prototype (includes device chrome)
- Webflow: design at 390px breakpoint, test at 375px
- BottomNav: fixed position, z-index above map layer
- TopNav: sticky, transitions between compact (64pt) and expanded (134pt) on search tap

**Interactions to build:**
- SideNavItem expand/collapse with Smart Animate equivalent (CSS transition, 300ms ease)
- NearYouSlider bottom sheet drag-up
- Spot marker tap → modal/popup
- Route pill 5s auto-collapse timer
- gemsScreen image strip horizontal scroll

**Domain:** trace.design  
**Platform:** Webflow CMS plan

---

## 14. Design Decisions Log

| Decision | Rationale |
|---|---|
| Body copy floor at 16px (not 15px) | Apple HIG standard; WCAG 14px is contrast threshold, not readability floor |
| H4 at 17px, H5 at 16px | H4 must visually exceed body. H5 differentiated by weight (500) + color (#A8A8A8) |
| Caption 2 floor at 11px | Outdoor mobile use — lower bound for legibility in daylight |
| CTA Primary = ALL CAPS | Buttons are recognised not read; tap target (≥44pt) matters more than text size |
| CTA Secondary = Sentence case | Mixed case system: Primary ALL CAPS, Secondary Sentence case — avoids shouting |
| Mid-fi CTA = neutral blue (#4A6EAA) | Prototype signal: "this is a UI control" without implying final brand yellow |
| Route pills: multi-select | Users may want to see multiple routes simultaneously on map |
| Active-Compact ring = 3pt | Visible without crowding the icon; ring-only (no fill change) on focus state |
| Inactive route = 70% opacity | Clearly readable but visually recedes; same shape so the column stays consistent |
| Quiz Question reuses H4 style | Avoids extra style; colour override (--content-1) provides sufficient distinction |
| XP Points kept separate | Monospace required for live digit updates; accent colour = reward visual signal |
| Map: Mapme + Mapbox Studio | Right tool for available time: Mapbox for visual style, Mapme for no-code interactivity |
