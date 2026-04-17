# TRACE : Toronto — Build Instructions

**Companion to design.md. Paste both files at the start of every Claude Code session.**  
**Figma file:** https://www.figma.com/design/qWtyO6CR3xF5vrACpVBjuU/Trace-Mi-Fi-Backup-March-27?node-id=2423-4831

---

## 0. Stack Constraints — READ BEFORE WRITING ANY CODE

```
Vanilla HTML + external CSS + vanilla JavaScript (ES6 modules)
NO TypeScript
NO Tailwind
NO React, Vue, or any framework
NO build tools (no Webpack, Vite, Parcel)
NO CSS-in-JS
```

Files open directly in a browser with no compilation step.  
Deploy target: Vercel static site (drag-and-drop or GitHub push).  
Map: embedded `<iframe>` or Mapbox GL JS snippet — do NOT build map rendering from scratch.

**Fonts:** Load via `<link>` in `<head>`. The licensed fonts (ITC Avant Garde Gothic Pro and Adelle) are served via Adobe Fonts (Typekit kit `evd2cyp`). The Google Fonts line loads Josefin Sans and Roboto Slab as fallbacks in case the Adobe kit fails to load. Both links are required.

```html
<!-- Adobe Fonts (primary — ITC Avant Garde Gothic Pro + Adelle) -->
<!-- Ensure trace.design and localhost are listed in the kit's allowed domains -->
<link rel="stylesheet" href="https://use.typekit.net/evd2cyp.css">

<!-- Google Fonts (fallback — Josefin Sans + Roboto Slab) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&family=Roboto+Slab:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 1. Project File Structure

Create this exact structure. Do not invent additional folders.

```
trace-toronto/
├── index.html            ← Home / Map screen
├── guide.html            ← Guide screen (spot catalog)
├── spot.html             ← Item Guide (single spot, reads ?id= from URL)
├── css/
│   ├── tokens.css        ← ALL CSS custom properties — load first in every page
│   ├── base.css          ← Reset, body, global typography, utility classes
│   ├── nav.css           ← TopNav + BottomNav (shared across all pages)
│   ├── map.css           ← Home/Map screen layout and components
│   ├── guide.css         ← Guide screen layout
│   └── spot.css          ← Spot detail screen layout
├── js/
│   ├── spots.js          ← All spot data, exported as const spots = [...]
│   ├── routes.js         ← Route definitions (name, color token, icon)
│   ├── nav.js            ← Route filter pill state machine + BottomNav
│   └── guide.js          ← Guide: filtering by route + sort logic
└── assets/
    ├── icons/            ← SVG icons exported from Figma
    └── photos/           ← Spot photography (hero + thumbnails)
```

Every HTML file loads CSS in this order:
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/nav.css">
<link rel="stylesheet" href="css/[page-specific].css">
```

Every HTML file loads JS at the bottom of `<body>` with `type="module"`:
```html
<script type="module" src="js/nav.js"></script>
<script type="module" src="js/[page-specific].js"></script>
```

---

## 2. CSS Custom Properties (tokens.css)

This is the single source of truth for all design values.  
Variable names are taken directly from the Figma design file.

```css
:root {

  /* ── Backgrounds ── */
  --bg-canvas:            #0F2229;   /* Deepest dark — outer app shell */
  --bg-base:              #223740;   /* Main screen background — all pages */
  --bg-card:              #2D4855;   /* Elevated cards, TopNav */
  --bg-card-glass:        rgba(45, 72, 85, 0.5);    /* Translucent card (map overlays) */
  --bg-base-glass:        rgba(34, 55, 64, 0.85);   /* Translucent base */
  --divider:              #3D5E6A;   /* Hairlines, borders, outlines */

  /* ── Text ── */
  --text-primary:         #EDF4F0;   /* H1–H3, active icons, emphasis */
  --text-primary-glass:   rgba(237, 244, 240, 0.5);  /* Dimmed / inactive text */
  --text-body:            #BDD0CC;   /* Body copy, secondary labels */
  --text-body-glass:      rgba(189, 208, 204, 0.5);
  --text-secondary:       #8AADB5;   /* Captions, metadata */

  /* ── CTA ── */
  --cta-default:          #E7E626;                   /* Primary button fill (default bg) */
  --cta-text:             #2D4855;                   /* Text ON yellow primary button */
  --cta-pressed-text:     #0D7A82;                   /* Text ON pressed state (both buttons) */
  --cta-disabled:         rgba(231, 230, 38, 0.5);   /* Primary disabled bg */
  --cta-focused-border:   #0D7A82;                   /* Focused/pressed border (Artist teal) */

  /* Secondary button tokens */
  --btn-secondary-bg:              rgba(237, 244, 240, 0.25); /* Secondary default bg */
  --btn-secondary-border:          #E7E626;                   /* Secondary default border */
  --btn-secondary-text:            #2D4855;                   /* Secondary default text */
  --btn-secondary-disabled-bg:     #BDD0CC;                   /* Secondary disabled bg */
  --btn-secondary-disabled-border: rgba(45, 72, 85, 0.75);    /* Secondary disabled border */
  --btn-secondary-disabled-text:   rgba(45, 72, 85, 0.75);    /* Secondary disabled text */

  /* Pressed state inner shadows */
  --btn-primary-pressed-shadow:    inset 4px 4px 8px rgba(45, 72, 85, 0.33);
  --btn-secondary-pressed-shadow:  inset 2px 2px 8px rgba(45, 72, 85, 0.33);

  /* ── Route colours ── */
  --route-typography:     #333DA7;   /* Typography route */
  --route-architecture:   #9D372E;   /* Architecture route */
  --route-artifacts:      #257A48;   /* Art Objects route */
  --route-streetart:      #8E2E8E;   /* Street Art / Murals route */
  --route-artist:         #0D7A82;   /* Artist's Pick route */

  /* Route pill: active background (at 50% opacity) */
  --route-typography-bg:  rgba(51,  61,  167, 0.5);
  --route-architecture-bg:rgba(157, 55,  46,  0.5);
  --route-artifacts-bg:   rgba(37,  122, 72,  0.5);
  --route-streetart-bg:   rgba(142, 46,  142, 0.5);
  --route-artist-bg:      rgba(13,  122, 130, 0.5);

  /* ── Map label colours (from Figma map layer) ── */
  --map-street-label:     rgba(180, 215, 225, 0.32);
  --map-district-label:   rgba(180, 215, 225, 0.2);
  --map-park-label:       rgba(94, 177, 122, 0.4);

  /* ── Feedback ── */
  --color-success:        #507060;
  --color-warning:        #6A5018;
  --color-error:          #602828;

  /* ── Spacing (16pt base grid) ── */
  --space-xs:    4px;
  --space-sm:    8px;
  --space-md:    12px;
  --space-base:  16px;
  --space-lg:    24px;
  --space-xl:    32px;

  /* ── Layout ── */
  --viewport-width:    402px;   /* Prototype width — use max-width on body */
  --content-width:     370px;   /* 402 − 2×16 margins */
  --top-inset:          62px;   /* Dynamic Island safe area */
  --bottom-inset:       34px;   /* Home indicator safe area */
  --topnav-height:      64px;
  --topnav-expanded:   134px;   /* TopNav with search bar */
  --bottomnav-height:   64px;

  /* ── Border radius ── */
  --radius-sm:    8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 50px;

  /* ── Typography: font families ── */
  --font-display: 'ITC Avant Garde Gothic Pro', 'Josefin Sans', Futura, sans-serif;
  --font-body:    'Adelle', 'Roboto Slab', Georgia, serif;

  /* ── Typography: weights ── */
  --weight-light:    300;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* ── Transitions ── */
  --transition-fast:   150ms ease;
  --transition-base:   300ms ease;
  --transition-slow:   500ms ease;
}
```

---

## 3. Typography Classes (base.css)

Define these classes in `base.css`. Use them via `class=""` in HTML — no inline styles.

```css
/* ── Display & Headings ── */
.h1 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: var(--weight-bold);
  line-height: 1.0;
  color: var(--text-primary);
}
.h2 {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: var(--weight-bold);
  line-height: 1.2;
  color: var(--text-primary);
}
.h3 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: var(--weight-bold);
  line-height: 1.2;
  color: var(--text-primary);
}
.h4 {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: var(--weight-bold);  /* Bold in Figma — NOT semibold */
  line-height: 1.3;
  color: #D0D0D0;
}
.h5 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: var(--weight-medium);
  line-height: 1.35;
  color: #A8A8A8;
}

/* ── Body copy ── */
.p-primary {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: var(--weight-regular);
  line-height: 1.4;
  color: var(--text-body);
}
.p-secondary {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: var(--weight-light);
  font-style: italic;
  line-height: 1.2;
  color: var(--text-secondary);
}

/* ── Captions ── */
.caption-1 {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: var(--weight-light);   /* Book weight */
  line-height: 1.2;
  color: var(--text-secondary);
}
.caption-2 {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: var(--weight-light);
  line-height: 1.2;
  color: var(--text-secondary);
}

/* ── UI labels ── */
.cta-primary {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: var(--weight-semibold);
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--cta-text);
}
.cta-secondary {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: var(--weight-semibold);
  line-height: 1.2;
  /* Sentence case — no text-transform */
  color: var(--text-primary);
}
.nav-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: var(--weight-semibold);
  line-height: 1.0;
  color: var(--text-primary);
}
.tag-label {
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: var(--weight-medium);
  line-height: 1.2;
  color: var(--text-body);
}
.map-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: var(--weight-regular);
  line-height: 1.2;
  color: var(--map-street-label);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── Special ── */
.xp-points {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  font-weight: var(--weight-bold);
  line-height: 1.0;
  color: var(--cta-default);
}
.quiz-question {
  /* Reuses H4 style with emphasis color */
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: var(--weight-bold);
  line-height: 1.3;
  color: var(--text-primary);
}
```

---

## 4. Global Base Styles (base.css)

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background-color: var(--bg-base);
  color: var(--text-body);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

body {
  max-width: var(--viewport-width);
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  min-height: 100dvh;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
}
```

---

## 5. Submission Scope — What to Build

Build exactly these three screens for the assignment. Everything else is documented in design.md for the future real project.

| Priority | Screen | File | Must-have features |
|---|---|---|---|
| **1** | Home / Map | `index.html` | Map embed, route filter pills (5), NearYouSlider, TopNav, BottomNav |
| **2** | Guide | `guide.html` | Spot list from `spots.js`, filter by route, sort toggle, TopNav, BottomNav |
| **3** | Item Guide | `spot.html` | Full spot detail from URL `?id=`, hero image, tags, about, designer's note |

**Do NOT build for submission:** Profile, Settings, Sign Up, Login, Personal Info.

Build in this order: index.html → guide.html → spot.html. Each screen must be fully functional before moving to the next.

---

## 6. HTML Structure Patterns

### Every page shell
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TRACE : Toronto</title>
  <link rel="stylesheet" href="https://use.typekit.net/evd2cyp.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&family=Roboto+Slab:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/[page].css">
</head>
<body>
  <!-- Top safe area inset -->
  <div class="top-inset"></div>

  <!-- TopNav -->
  <header class="topnav" id="topnav">...</header>

  <!-- Page content -->
  <main class="page-content" id="main-content">...</main>

  <!-- BottomNav -->
  <nav class="bottomnav" id="bottomnav" aria-label="Main navigation">...</nav>

  <!-- Bottom safe area inset -->
  <div class="bottom-inset"></div>

  <script type="module" src="js/nav.js"></script>
  <script type="module" src="js/[page].js"></script>
</body>
</html>
```

### TopNav (from Figma node `2423:6154`)
```html
<header class="topnav">
  <div class="topnav__bar">
    <a href="index.html" class="topnav__logo" aria-label="TRACE home">
      <span class="topnav__logo-trace">TRACE</span>
      <span class="topnav__logo-to">TO</span>
    </a>
    <div class="topnav__icons">
      <button class="icon-btn" aria-label="Search"><!-- search icon SVG --></button>
      <button class="icon-btn" aria-label="Light/Dark mode"><!-- lightdark icon SVG --></button>
    </div>
  </div>
  <!-- Search bar — shown on Home, hidden on Guide/Spot by default -->
  <div class="topnav__search" id="search-container">
    <button class="search-bar" aria-label="Search for spots or routes">
      <!-- search icon -->
      <span class="p-secondary">Search for spots or routes!</span>
    </button>
  </div>
</header>
```

### BottomNav (from Figma node `2423:5964`)
```html
<nav class="bottomnav" aria-label="Main navigation">
  <a href="index.html" class="bottomnav__item" data-page="map">
    <div class="bottomnav__icon"><!-- map icon SVG --></div>
    <span class="nav-label">Map</span>
  </a>
  <a href="guide.html" class="bottomnav__item" data-page="guide">
    <div class="bottomnav__icon"><!-- guide icon SVG --></div>
    <span class="nav-label">Guide</span>
  </a>
  <a href="#" class="bottomnav__item" data-page="profile">
    <div class="bottomnav__icon"><!-- user icon SVG --></div>
    <span class="nav-label">Profile</span>
  </a>
</nav>
```

### Route filter pills — SideNavRoutes (from Figma node `2423:6005`)
```html
<aside class="sidenav-routes" aria-label="Route filters">
  <button class="route-pill" data-route="typography" aria-pressed="false">
    <span class="route-pill__icon" aria-hidden="true">T</span>
    <span class="route-pill__label">Typography</span>
  </button>
  <button class="route-pill" data-route="architecture" aria-pressed="false">
    <span class="route-pill__icon" aria-hidden="true"><!-- building icon --></span>
    <span class="route-pill__label">Architecture</span>
  </button>
  <button class="route-pill" data-route="artifacts" aria-pressed="false">
    <span class="route-pill__icon" aria-hidden="true"><!-- objects icon --></span>
    <span class="route-pill__label">Art Objects</span>
  </button>
  <button class="route-pill" data-route="streetart" aria-pressed="false">
    <span class="route-pill__icon" aria-hidden="true"><!-- murals icon --></span>
    <span class="route-pill__label">Street Art</span>
  </button>
  <button class="route-pill" data-route="artist" aria-pressed="false">
    <span class="route-pill__icon" aria-hidden="true"><!-- gem icon --></span>
    <span class="route-pill__label">Artist's Pick</span>
  </button>
</aside>
```

---

## 7. Key CSS Patterns (nav.css)

```css
/* ── Safe area insets ── */
.top-inset {
  height: var(--top-inset);
  background-color: var(--bg-base);
  position: sticky;
  top: 0;
  z-index: 100;
}
.bottom-inset {
  height: var(--bottom-inset);
  background-color: var(--bg-base);
}

/* ── TopNav ── */
.topnav {
  background-color: var(--bg-card);
  position: sticky;
  top: var(--top-inset);
  z-index: 90;
  width: 100%;
}
.topnav__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--topnav-height);
  padding: 0 var(--space-base);
}
.topnav__logo {
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.topnav__logo-trace {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: var(--weight-light);
  color: var(--text-primary);
  letter-spacing: 0.08em;
}
.topnav__logo-to {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: var(--weight-bold);
  color: var(--route-artist);   /* Teal accent */
}
.topnav__icons {
  display: flex;
  gap: var(--space-base);
}
.topnav__search {
  padding: 0 var(--space-base) var(--space-base);
}
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: var(--content-width);
  height: 54px;
  padding: var(--space-md);
  background-color: var(--text-primary-glass);
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
}

/* ── Icon buttons ── */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background-color: var(--text-body-glass);
  border: none;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.icon-btn:hover { opacity: 0.8; }
.icon-btn:active { opacity: 0.6; }

/* ── ButtonPrimary ── */
/*
  States: default | disabled | pressed | focused
  Size:   180px wide, padding 6px 12px
  Structure: [icon] [label] [icon] — icons optional
*/
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 180px;
  padding: 6px 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--cta-default);
  background-color: var(--cta-default);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--cta-text);
  cursor: pointer;
  position: relative;
  transition: box-shadow var(--transition-fast);
}
.btn-primary:focus-visible {
  outline: 2px solid var(--cta-focused-border);
  outline-offset: 2px;
  border-color: var(--cta-focused-border);
  color: var(--cta-pressed-text);
}
.btn-primary:active,
.btn-primary.is-pressed {
  border-color: var(--cta-focused-border);
  background-color: var(--cta-default);
  color: var(--cta-pressed-text);
  box-shadow: var(--btn-primary-pressed-shadow);
}
.btn-primary:disabled,
.btn-primary.is-disabled {
  background-color: var(--cta-disabled);
  border-color: var(--cta-default);
  color: var(--cta-default);
  cursor: not-allowed;
  pointer-events: none;
}

/* ── ButtonSecondary ── */
/*
  States: default | disabled | pressed | focused
  Size:   160px wide, padding 6px 12px
  Smaller than Primary — used for cancel/dismiss actions
*/
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 160px;
  padding: 6px 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--btn-secondary-border);
  background-color: var(--btn-secondary-bg);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: var(--weight-regular);
  color: var(--btn-secondary-text);
  cursor: pointer;
  position: relative;
  transition: box-shadow var(--transition-fast);
}
.btn-secondary:focus-visible {
  outline: 2px solid var(--cta-focused-border);
  outline-offset: 2px;
  border-color: var(--cta-focused-border);
  color: var(--cta-pressed-text);
}
.btn-secondary:active,
.btn-secondary.is-pressed {
  border-color: var(--cta-focused-border);
  background-color: var(--cta-default);
  color: var(--cta-pressed-text);
  box-shadow: var(--btn-secondary-pressed-shadow);
}
.btn-secondary:disabled,
.btn-secondary.is-disabled {
  background-color: var(--btn-secondary-disabled-bg);
  border-color: var(--btn-secondary-disabled-border);
  color: var(--btn-secondary-disabled-text);
  cursor: not-allowed;
  pointer-events: none;
}

/*
  Button state summary (both):
  Default  → full colour, interactive
  Focused  → #0D7A82 border + outline, text shifts to #0D7A82
  Pressed  → same bg as default + inset shadow + #0D7A82 text
  Disabled → faded bg, no pointer events
  Note: focused and pressed share the #0D7A82 accent — intentional per Figma.
*/

/* ── BottomNav ── */
.bottomnav {
  position: fixed;
  bottom: var(--bottom-inset);
  left: 50%;
  transform: translateX(-50%);
  width: var(--viewport-width);
  height: var(--bottomnav-height);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: var(--space-md) var(--space-base);
  background-color: var(--bg-base);
  z-index: 90;
}
.bottomnav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 30px;
  color: var(--text-primary-glass);
  transition: color var(--transition-fast);
}
.bottomnav__item.active,
.bottomnav__item[aria-current="page"] {
  color: var(--text-primary);
}
.bottomnav__icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: transparent;
  transition: background-color var(--transition-fast);
}
.bottomnav__item.active .bottomnav__icon {
  background-color: var(--bg-card);
}

/* ── Route filter pills ── */
.sidenav-routes {
  position: absolute;
  right: 0;
  top: 92px;   /* Below map top inset */
  display: flex;
  flex-direction: column;
  gap: var(--space-base);
  z-index: 50;
}

.route-pill {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  height: 48px;
  padding: 0 var(--space-md);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);  /* Left-rounded only */
  border: none;
  cursor: pointer;
  overflow: hidden;
  /* Default: icon only (54px) */
  width: 54px;
  transition: width var(--transition-base), background-color var(--transition-base);
}

/* Route colours */
.route-pill[data-route="typography"]  { background-color: var(--route-typography-bg); }
.route-pill[data-route="architecture"]{ background-color: var(--route-architecture-bg); }
.route-pill[data-route="artifacts"]   { background-color: var(--route-artifacts-bg); }
.route-pill[data-route="streetart"]   { background-color: var(--route-streetart-bg); }
.route-pill[data-route="artist"]      { background-color: var(--route-artist-bg); }

/* Active state — expanded */
.route-pill[aria-pressed="true"] {
  width: 184px;
  box-shadow: 0 0 0 2px currentColor;   /* Ring approximation — use route color */
}
.route-pill[data-route="typography"][aria-pressed="true"]  { color: var(--route-typography); }
.route-pill[data-route="architecture"][aria-pressed="true"]{ color: var(--route-architecture); }
.route-pill[data-route="artifacts"][aria-pressed="true"]   { color: var(--route-artifacts); }
.route-pill[data-route="streetart"][aria-pressed="true"]   { color: var(--route-streetart); }
.route-pill[data-route="artist"][aria-pressed="true"]      { color: var(--route-artist); }

/* Inactive state — another route is active */
.route-pill.inactive {
  opacity: 0.7;
}

.route-pill__label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: var(--weight-medium);
  color: var(--text-body);
  white-space: nowrap;
  /* Hidden when collapsed */
  opacity: 0;
  transition: opacity var(--transition-base);
}
.route-pill[aria-pressed="true"] .route-pill__label {
  opacity: 1;
}

.route-pill__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background-color: var(--text-primary-glass);
  flex-shrink: 0;
  font-family: var(--font-display);
  font-weight: var(--weight-bold);
  font-size: 12px;
  color: var(--text-body);
}
```

---

## 8. Route Filter State Machine (nav.js)

```javascript
// nav.js — Route filter pill interaction
// State: each pill is 'default' | 'active' | 'inactive'
// Multiple routes can be active simultaneously

const COLLAPSE_DELAY = 5000; // 5 seconds

const pills = document.querySelectorAll('.route-pill');
const collapseTimers = new Map();

function setActive(pill) {
  pill.setAttribute('aria-pressed', 'true');
  pill.classList.remove('inactive');

  // Start auto-collapse timer
  clearTimer(pill);
  const timer = setTimeout(() => collapse(pill), COLLAPSE_DELAY);
  collapseTimers.set(pill, timer);
}

function collapse(pill) {
  // Keep aria-pressed true (route still active/selected)
  // Just collapse the visual width — label hides via CSS
  pill.classList.add('collapsed');
  clearTimer(pill);
}

function deactivate(pill) {
  pill.setAttribute('aria-pressed', 'false');
  pill.classList.remove('collapsed');
  clearTimer(pill);
  updateInactiveState();
}

function clearTimer(pill) {
  if (collapseTimers.has(pill)) {
    clearTimeout(collapseTimers.get(pill));
    collapseTimers.delete(pill);
  }
}

function updateInactiveState() {
  const anyActive = [...pills].some(p => p.getAttribute('aria-pressed') === 'true');
  pills.forEach(pill => {
    if (anyActive && pill.getAttribute('aria-pressed') === 'false') {
      pill.classList.add('inactive');
    } else {
      pill.classList.remove('inactive');
    }
  });
}

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    const isActive = pill.getAttribute('aria-pressed') === 'true';
    const isCollapsed = pill.classList.contains('collapsed');

    if (!isActive) {
      // Default → Active-Expanding
      setActive(pill);
    } else if (isCollapsed) {
      // Active-Compact → re-expand
      pill.classList.remove('collapsed');
      clearTimer(pill);
      const timer = setTimeout(() => collapse(pill), COLLAPSE_DELAY);
      collapseTimers.set(pill, timer);
    } else {
      // Active-Expanding → Deactivate (second tap collapses)
      deactivate(pill);
    }

    updateInactiveState();

    // Dispatch event so guide.js can filter spots
    document.dispatchEvent(new CustomEvent('routeFilterChange', {
      detail: { activeRoutes: getActiveRoutes() }
    }));
  });
});

export function getActiveRoutes() {
  return [...pills]
    .filter(p => p.getAttribute('aria-pressed') === 'true')
    .map(p => p.dataset.route);
}

// Set active BottomNav item based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.bottomnav__item').forEach(item => {
  const page = item.dataset.page;
  if (
    (page === 'map' && (currentPage === 'index.html' || currentPage === '')) ||
    (page === 'guide' && currentPage === 'guide.html') ||
    (page === 'profile' && currentPage === 'profile.html')
  ) {
    item.classList.add('active');
    item.setAttribute('aria-current', 'page');
  }
});
```

---

## 9. Spot Data Structure (spots.js)

Populate with real content. The structure is fixed — add your text and image paths.

```javascript
// spots.js — All TRACE spot data
// Import in guide.js and spot.js: import { spots } from './spots.js';

export const spots = [
  {
    id: 'lees',
    name: "Lee's Palace Ghost Sign",
    route: 'typography',           // Must match route-pill data-route values
    neighbourhood: 'The Annex',
    address: '529 Bloor St W',
    lat: 43.6655,
    lng: -79.4072,
    tags: ['ghost sign', 'lettering', 'gold leaf'],
    about: 'Placeholder — replace with real content.',
    designerNote: 'Placeholder — replace with real content.',
    clue: 'Placeholder — replace with real riddle text.',
    interestingFact: 'Placeholder — replace with real content.',
    heroImage: 'assets/photos/lees-hero.jpg',
    thumbImages: [
      'assets/photos/lees-1.jpg',
      'assets/photos/lees-2.jpg',
      'assets/photos/lees-3.jpg',
      'assets/photos/lees-4.jpg'
    ]
  },
  {
    id: 'tmu',
    name: 'Toronto Metropolitan University',
    route: 'architecture',
    neighbourhood: 'Garden District',
    address: '350 Victoria St',
    lat: 43.6577,
    lng: -79.3788,
    tags: ['brutalism', 'modernist', 'campus'],
    about: 'Placeholder.',
    designerNote: 'Placeholder.',
    clue: 'Placeholder.',
    interestingFact: 'Placeholder.',
    heroImage: 'assets/photos/tmu-hero.jpg',
    thumbImages: ['assets/photos/tmu-1.jpg', 'assets/photos/tmu-2.jpg']
  },
  {
    id: 'dreaming',
    name: 'Dreaming of a Better World',
    route: 'artifacts',
    neighbourhood: 'Kensington Market',
    address: 'Placeholder address',
    lat: 43.6544,
    lng: -79.4005,
    tags: ['sculpture', 'public art'],
    about: 'Placeholder.',
    designerNote: 'Placeholder.',
    clue: 'Placeholder.',
    interestingFact: 'Placeholder.',
    heroImage: 'assets/photos/dreaming-hero.jpg',
    thumbImages: []
  },
  {
    id: 'owl',
    name: 'Owl Mural',
    route: 'streetart',
    neighbourhood: 'Kensington Market',
    address: 'Placeholder address',
    lat: 43.6541,
    lng: -79.4009,
    tags: ['mural', 'wildlife', 'large scale'],
    about: 'Placeholder.',
    designerNote: 'Placeholder.',
    clue: 'Placeholder.',
    interestingFact: 'Placeholder.',
    heroImage: 'assets/photos/owl-hero.jpg',
    thumbImages: []
  },
  {
    id: 'annex-wall',
    name: 'Annex Wall',
    route: 'streetart',
    neighbourhood: 'The Annex',
    address: 'Placeholder address',
    lat: 43.6672,
    lng: -79.4068,
    tags: ['mural', 'community'],
    about: 'Placeholder.',
    designerNote: 'Placeholder.',
    clue: 'Placeholder.',
    interestingFact: 'Placeholder.',
    heroImage: 'assets/photos/annex-wall-hero.jpg',
    thumbImages: []
  },
  {
    id: 'giant',
    name: 'Giant Mural',
    route: 'artist',
    neighbourhood: 'Downtown',
    address: 'Placeholder address',
    lat: 43.6520,
    lng: -79.3832,
    tags: ["artist's pick", 'large scale'],
    about: 'Placeholder.',
    designerNote: 'Placeholder.',
    clue: 'Placeholder.',
    interestingFact: 'Placeholder.',
    heroImage: 'assets/photos/giant-hero.jpg',
    thumbImages: []
  },
  {
    id: 'deer',
    name: 'Deer Mural',
    route: 'artist',
    neighbourhood: 'Downtown',
    address: 'Placeholder address',
    lat: 43.6515,
    lng: -79.3835,
    tags: ["artist's pick", 'wildlife'],
    about: 'Placeholder.',
    designerNote: 'Placeholder.',
    clue: 'Placeholder.',
    interestingFact: 'Placeholder.',
    heroImage: 'assets/photos/deer-hero.jpg',
    thumbImages: []
  }
  // Add remaining spots following the same structure
];

export const routes = {
  typography:   { label: 'Typography',    color: 'var(--route-typography)',   icon: 'T' },
  architecture: { label: 'Architecture',  color: 'var(--route-architecture)', icon: '🏛' },
  artifacts:    { label: 'Art Objects',   color: 'var(--route-artifacts)',    icon: '◆' },
  streetart:    { label: 'Street Art',    color: 'var(--route-streetart)',    icon: '◈' },
  artist:       { label: "Artist's Pick", color: 'var(--route-artist)',       icon: '✦' }
};
```

---

## 10. Guide Screen Logic (guide.js)

```javascript
// guide.js — Filtering and rendering the spot catalog
import { spots, routes } from './spots.js';
import { getActiveRoutes } from './nav.js';

const spotList = document.getElementById('spot-list');

function renderSpots(filteredSpots) {
  spotList.innerHTML = filteredSpots.map(spot => `
    <a href="spot.html?id=${spot.id}" class="gem-item" data-route="${spot.route}">
      <div class="gem-item__img">
        <img src="${spot.heroImage}" alt="${spot.name}" loading="lazy">
      </div>
      <div class="gem-item__info">
        <span class="caption-2" style="color: var(--route-${spot.route})">${routes[spot.route].label}</span>
        <h3 class="h4">${spot.name}</h3>
        <p class="p-secondary">${spot.neighbourhood}</p>
        <p class="caption-1">${spot.about.substring(0, 80)}...</p>
      </div>
    </a>
  `).join('');
}

function filterAndRender() {
  const activeRoutes = getActiveRoutes();
  const filtered = activeRoutes.length === 0
    ? spots
    : spots.filter(s => activeRoutes.includes(s.route));
  renderSpots(filtered);
}

// Initial render
renderSpots(spots);

// Re-render when route filters change
document.addEventListener('routeFilterChange', filterAndRender);
```

---

## 11. Spot Detail Screen Logic (spot.js)

```javascript
// spot.js — Populate spot.html from URL parameter
import { spots, routes } from './spots.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const spot = spots.find(s => s.id === id);

if (!spot) {
  // Spot not found — redirect to guide
  window.location.href = 'guide.html';
} else {
  // Populate page elements by ID
  document.getElementById('spot-name').textContent = spot.name;
  document.getElementById('spot-route').textContent = routes[spot.route].label;
  document.getElementById('spot-route').style.color = `var(--route-${spot.route})`;
  document.getElementById('spot-neighbourhood').textContent = spot.neighbourhood;
  document.getElementById('spot-about').textContent = spot.about;
  document.getElementById('spot-designer-note').textContent = spot.designerNote;
  document.getElementById('spot-hero').src = spot.heroImage;
  document.getElementById('spot-hero').alt = spot.name;

  // Tags
  const tagsContainer = document.getElementById('spot-tags');
  tagsContainer.innerHTML = spot.tags.map(tag =>
    `<span class="tag">${tag}</span>`
  ).join('');

  // Photo thumbnails
  const thumbsContainer = document.getElementById('spot-thumbs');
  thumbsContainer.innerHTML = spot.thumbImages.map((src, i) =>
    `<img src="${src}" alt="${spot.name} photo ${i + 1}" loading="lazy" class="spot-thumb">`
  ).join('');

  // Breadcrumb
  document.getElementById('breadcrumb-route').textContent = routes[spot.route].label;
  document.getElementById('breadcrumb-route').href =
    `guide.html?route=${spot.route}`;

  // Prev / Next navigation
  const currentIndex = spots.findIndex(s => s.id === id);
  const prevSpot = spots[currentIndex - 1];
  const nextSpot = spots[currentIndex + 1];

  const prevLink = document.getElementById('prev-spot');
  const nextLink = document.getElementById('next-spot');

  if (prevSpot) {
    prevLink.href = `spot.html?id=${prevSpot.id}`;
    prevLink.textContent = prevSpot.name;
  } else {
    prevLink.style.visibility = 'hidden';
  }

  if (nextSpot) {
    nextLink.href = `spot.html?id=${nextSpot.id}`;
    nextLink.textContent = nextSpot.name;
  } else {
    nextLink.style.visibility = 'hidden';
  }
}
```

---

## 12. Map Embed Instructions (index.html)

The map is **not built from scratch**. Embed your Mapbox or Atlas map as follows.

**Option A — Atlas embed (simplest):**
```html
<div class="map-container" id="map-container">
  <iframe
    src="YOUR_ATLAS_EMBED_URL"
    title="TRACE Toronto Map"
    frameborder="0"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>
```

**Option B — Mapbox GL JS (if you have your access token and style URL):**
```html
<!-- In <head> -->
<link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>

<!-- In map section -->
<div id="mapbox-container" style="width:100%;height:100%;"></div>

<script>
mapboxgl.accessToken = 'YOUR_TOKEN_HERE';
const map = new mapboxgl.Map({
  container: 'mapbox-container',
  style: 'YOUR_CUSTOM_STYLE_URL',  // Your dark TRACE style from Mapbox Studio
  center: [-79.3832, 43.6532],      // Downtown Toronto
  zoom: 13.5
});
</script>
```

**Map container CSS:**
```css
.map-container {
  position: absolute;
  top: var(--topnav-expanded); /* Below expanded TopNav */
  left: 0;
  right: 0;
  bottom: calc(var(--bottomnav-height) + var(--bottom-inset));
  overflow: hidden;
}
.map-container iframe,
#mapbox-container {
  width: 100%;
  height: 100%;
  border: none;
}
```

---

## 13. Session Starter Prompt for Claude Code

Copy and paste this at the beginning of each Claude Code session:

```
I'm building TRACE : Toronto, a mobile web app for exploring creative spots in Toronto.

Please read the attached design.md and build-instructions.md before writing any code.

Key constraints:
- Vanilla HTML + external CSS + vanilla JavaScript ES6 modules only
- NO TypeScript, NO Tailwind, NO React, NO build tools
- CSS in separate .css files using CSS custom properties
- JS in separate .js files using ES6 module import/export
- Target: mobile-first at 402px max-width, deploy to Vercel as static site

Today's task: [describe what you want to build, e.g. "Build index.html — the Home/Map screen"]

The Figma prototype for reference:
https://www.figma.com/design/qWtyO6CR3xF5vrACpVBjuU/Trace-Mi-Fi-Backup-March-27?node-id=2423-4831

Start by creating the file structure, then build [specific screen/component].
Do not install any packages. Do not use npm. Files should open directly in a browser.
```

---

## 14. Figma Make Prompt (if using Figma Make instead of Claude Code)

If generating from Figma Make, use this prompt in the generation settings:

```
Generate using vanilla HTML, external CSS files, and vanilla JavaScript ES6 modules.
No TypeScript. No Tailwind. No React or any framework. No build step.
CSS custom properties (variables) for all design tokens.
CSS in separate files: tokens.css, base.css, nav.css, and one per screen.
JS in separate files with type="module".
Mobile-first layout, max-width 402px centred on body.
Font fallbacks: Josefin Sans for ITC Avant Garde Gothic Pro, Roboto Slab for Adelle.
```

---

## 15. Figma Node ID Quick Reference

Use these if Claude Code has Figma plugin access.

| Component | Node ID |
|---|---|
| Home / Map screen | `2423:5226` |
| Guide screen | `2423:5273` |
| Item Guide — Lee's | `2423:5539` |
| Route screen | `2423:5241` |
| TopNav (expanded) | `2423:6143` |
| TopNav (compact) | `2423:6154` |
| BottomNav (all variants) | `2423:5964` |
| SideNavItem1 (route pill) | `2423:6005` |
| NearYouSlider | `2423:5811` |
| ButtonPrimary | `2423:6847` |
| ButtonSecondary | `2423:6860` |
| SearchContainer | `2423:6805` |
| GemItem (catalog card) | `2423:6918` |
| gemsScreen (spot detail) | `2423:7248` |
| guidebook-content | `2423:7188` |
| Style Guide frame | `2509:2879` |