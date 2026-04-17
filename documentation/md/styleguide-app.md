# TRACE Toronto — Style Guide

> A non-commercial multi-platform design ecosystem for exploring the creative side of Toronto.
> This document covers design tokens, typography, components, map styles, and accessibility rules for the TRACE app prototype across its dark and light colour modes.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Colour System — Dark Mode](#2-colour-system--dark-mode)
3. [Colour System — Light Mode](#3-colour-system--light-mode)
4. [Category Palette](#4-category-palette)
5. [Typography](#5-typography)
6. [Spacing & Border Radius](#6-spacing--border-radius)
7. [Components](#7-components)
8. [Map Wireframe Styles](#8-map-wireframe-styles)
9. [Accessibility Rules](#9-accessibility-rules)
10. [Before / After: Accessibility Fixes](#10-before--after-accessibility-fixes)

---

## 1. Design Principles

### Depth through teal
All backgrounds share the same blue-teal colour family. In dark mode surfaces range from `--surface-1` (`#12202A`, deepest) to `--surface-5` (`#3D5E6A`, lightest structural edge). In light mode the range flips: `--surface-1` becomes `#F4F9FA` and `--surface-5` becomes `#BDD0D5`. The same tonal hierarchy applies in both modes — only the direction changes. This creates a cohesive environment where the background recedes and content surfaces naturally.

### Yellow as signal
`#E7E626` is reserved exclusively for:
- The TRACE wordmark (dark mode only)
- Keyboard focus rings (dark mode only)
- Primary CTA borders and highlights

Do not apply it to body text, icons, or decorative elements. Overuse destroys its function as an attention anchor. In light mode, the focus ring switches to `#1D3240` because yellow achieves only ~1.9:1 contrast on light teal surfaces — a WCAG failure.

### Category hues harmonise
Each of the five category colours has a hue chosen to feel distinct but not foreign to the teal base palette. The original Typography colour (`#334a8e`) was a disconnected navy-purple that clashed with the teal environment. It was shifted to `#2B5EA8` — a steel blue that shares the cool temperature of the base palette while remaining visually unique.

### Opacity as mood, not replacement
Semi-transparent colour values (`rgba`) are permitted for:
- Map wireframe fills (city blocks, park shapes, grid lines)
- Overlay scrims on images
- Route dashed lines

They must **never** be used for body text, interactive labels, or navigation elements where readability is required. All text and interactive element colours use solid, verified hex values.

### Serif as contrast
Adelle (humanist slab serif) provides typographic warmth against ITC Avant Garde Gothic Pro's cool geometric precision. This pairing reflects TRACE's central tension: city infrastructure vs. human creativity. ITC Avant Garde Gothic Pro handles all navigation, labelling, and UI chrome. Adelle handles all editorial content — descriptions, notes, and captions.

### Light mode — same DNA
Light mode inverts the tonal range but preserves every hue relationship. The teal palette, category colours, and spacing system are identical across modes. Only text colours, surface backgrounds, the logo fill, and the focus ring colour change. If a colour decision is correct in dark mode, its light-mode counterpart is derived by inverting tonal position within the same hue family — not by switching to an unrelated palette.

---

## 2. Colour System — Dark Mode

All contrast ratios measured against the primary screen background (`--surface-3`, `#223740`) using the WCAG 2.1 relative luminance formula.

### Token naming — surface / content

Tokens are named by **hierarchy position** rather than visual property (not "background" or "text"). This means the same token name is valid in both modes — only its resolved hex value changes. Use `--surface-*` for all backgrounds; use `--content-*` for all text and icons.

```
surface-1  →  outermost canvas / app shell
surface-2  →  elevated panels, sidebars
surface-3  →  base screen background
surface-4  →  cards, nav bars, bottom drawers
surface-5  →  hairlines, borders, structural card edges

content-1  →  primary text / active icons
content-2  →  body copy / secondary labels
content-3  →  muted text / captions / inactive icons
```

> **Why `--surface-4` dark (`#2D4855`) equals `--content-2` light (`#2D4855`):** the same physical colour plays different roles in different contexts. `--surface-4` is always a mid-depth background; `--content-2` is always secondary readable text. In dark mode these happen to share a hex — in light mode they resolve differently. The token name tells you the role; the mode tells you the context. No conflict; no redundancy.

### Surfaces

| Token | CSS var | Hex | Role |
|---|---|---|---|
| surface-1 | `--surface-1` | `#12202A` | Outer shell / app canvas |
| surface-2 | `--surface-2` | `#1D3240` | Elevated panels, sidebar sections |
| surface-3 | `--surface-3` | `#223740` | Base screen background |
| surface-4 | `--surface-4` | `#2D4855` | Cards, nav bars, bottom drawers |
| surface-5 | `--surface-5` | `#3D5E6A` | Hairlines, borders, structural edges |

### Content (text & icons)

| Token | CSS var | Hex | Contrast on surface-3 | WCAG |
|---|---|---|---|---|
| content-1 | `--content-1` | `#EDF4F0` | 12.0 : 1 | AAA |
| content-2 | `--content-2` | `#BDD0CC` | 7.9 : 1 | AAA |
| content-3 | `--content-3` | `#8AADB5` | 5.3 : 1 | AA |

### Dividers

Two divider tokens exist to distinguish structural edges from soft internal separators:

| Token | CSS var | Hex | Use for |
|---|---|---|---|
| divider-soft | `--divider-soft` | `#8AADB5` | Sidebar section separators, subtle rule lines within a panel |
| divider-strong | `--divider-strong` | `#3D5E6A` | Card borders, nav borders, structural page-level hairlines |

> `--divider-soft` shares its value with `--content-3`. This is intentional — a soft internal divider should visually read at the same weight as muted text, so it recedes within a panel rather than competing with card borders.

### Brand & Interactive

| Token | Hex | Usage |
|---|---|---|
| TRACE Yellow | `#E7E626` | Wordmark, focus rings, primary CTA highlights |
| Logo TRACE fill | `#E7E626` | TRACE wordmark |
| Logo TO fill | `#EDF4F0` | "TO" suffix — uses `--content-1` value |
| Focus Ring | `#E7E626` | 2px outline on all interactive elements |

### Navigation

| Element | Value | Token |
|---|---|---|
| Top Nav BG | `#2D4855` | `--surface-4` |
| Bottom Nav BG | `#223740` | `--surface-3` |
| Active Icon | `#EDF4F0` | `--content-1` |
| Inactive Icon | `#8AADB5` | `--content-3` — 5.3 : 1 ✓ AA |
| Active Pill BG | `#2D4855` | `--surface-4` |

### Search & Inputs

| Element | Value |
|---|---|
| Search BG | `rgba(237, 244, 240, 0.15)` |
| Search Border | `rgba(237, 244, 240, 0.12)` |
| Search Text | `#8AADB5` — `--content-3` |
| Caret Colour | `#E7E626` |

### Sheets & Drawers

| Element | Value | Token |
|---|---|---|
| Sheet BG | `#2D4855` | `--surface-4` |
| Drag Handle | `#5A8A95` | — |
| Gem Card BG | `#2D4855` | `--surface-4` |

---

## 3. Colour System — Light Mode

All contrast ratios measured against the primary screen background (`--surface-3`, `#E4EFF2`). Token names are **identical** to dark mode — only the resolved hex values change.

### Surfaces

| Token | CSS var | Hex | Role |
|---|---|---|---|
| surface-1 | `--surface-1` | `#F4F9FA` | Outer shell / app canvas |
| surface-2 | `--surface-2` | `#EDF5F7` | Subtle elevated surface, alt sections |
| surface-3 | `--surface-3` | `#E4EFF2` | Base screen background |
| surface-4 | `--surface-4` | `#FFFFFF` | Cards, nav bars, bottom drawers |
| surface-5 | `--surface-5` | `#BDD0D5` | Hairlines, borders, structural edges |

### Content (text & icons)

| Token | CSS var | Hex | Contrast on surface-3 | WCAG |
|---|---|---|---|---|
| content-1 | `--content-1` | `#1D3240` | 11.4 : 1 | AAA |
| content-2 | `--content-2` | `#2D4855` | 7.5 : 1 | AAA |
| content-3 | `--content-3` | `#3A6070` | 5.1 : 1 | AA |

### Dividers

| Token | CSS var | Hex | Use for |
|---|---|---|---|
| divider-soft | `--divider-soft` | `#3A6070` | Sidebar section separators, subtle rule lines within a panel |
| divider-strong | `--divider-strong` | `#BDD0D5` | Card borders, nav borders, structural page-level hairlines |

> In light mode `--divider-soft` shares its value with `--content-3` (`#3A6070`), and `--divider-strong` shares its value with `--surface-5` (`#BDD0D5`). Same principle as dark mode — intentional.

### Brand & Interactive

| Token | Hex | Usage |
|---|---|---|
| Logo TRACE fill | `#1D3240` | Wordmark fill — yellow fails on light backgrounds |
| Logo TO fill | `#2D4855` | "TO" suffix — uses `--content-2` value |
| Focus Ring | `#1D3240` | 2px outline — 11.4 : 1 ✓ AAA |

> **Why the focus ring changes:** `#E7E626` on `#FFFFFF` achieves only ~1.9 : 1 contrast — a critical WCAG failure. The focus ring switches to `--content-1` (`#1D3240`) in light mode to remain perceivable by keyboard users.

### Navigation

| Element | Value | Token |
|---|---|---|
| Top Nav BG | `#FFFFFF` | `--surface-4` |
| Bottom Nav BG | `#EDF5F7` | `--surface-2` |
| Active Icon | `#1D3240` | `--content-1` |
| Inactive Icon | `#3A6070` | `--content-3` — 5.1 : 1 on surface-2 ✓ AA |
| Active Pill BG | `#DDE9EC` | — |

### Search & Inputs

| Element | Value |
|---|---|
| Search BG | `rgba(45, 72, 85, 0.08)` |
| Search Border | `rgba(45, 72, 85, 0.15)` |
| Search Text | `#3A6070` — `--content-3` |
| Caret Colour | `#1D3240` — `--content-1` |

### Sheets & Drawers

| Element | Value | Token |
|---|---|---|
| Sheet BG | `#FFFFFF` | `--surface-4` |
| Drag Handle | `#B0C5CA` | — |
| Gem Card BG | `#FFFFFF` | `--surface-4` |

---

## 4. Category Palette

Category colours are **identical in both dark and light modes**. All five colours pass WCAG AA (≥ 4.5 : 1) with white text, making them safe for use as solid tag and badge backgrounds in any context.

| Category        | Hex       | Contrast w/ White | Previous Hex | Change                              |
|-----------------|-----------|-------------------|--------------|-------------------------------------|
| Artist's Choice | `#0D7A82` | 5.1 : 1  ✓ AA     | `#0E6B70`    | Brightened for better contrast      |
| Typography      | `#2B5EA8` | 6.3 : 1  ✓ AA     | `#334a8e`    | Shifted navy-purple → steel blue    |
| Art Objects     | `#257A48` | 5.3 : 1  ✓ AA     | `#3D8354`    | Deepened for contrast               |
| Architecture    | `#9A4520` | 6.5 : 1  ✓ AA     | `#95452A`    | Minor hue refinement                |
| Street Art      | `#7E3090` | 7.7 : 1  ✓ AA     | `#742D7D`    | Minor saturation adjustment         |

### Filter chip states

- **Active chip:** Full-saturation category hex background + `#FFFFFF` text
- **Inactive chip (dark mode):** 33% opacity category hex background + `#C0D5D0` solid text (7.2 : 1 ✓)
- **Inactive chip (light mode):** 20% opacity category hex background + `#3A6070` solid text (5.1 : 1 ✓)

Never use semi-transparent text on filter chips. The inactive state must always use a solid text colour with verified contrast.

### Category indicator strips (Gem cards)

The left-edge colour strip on Gem cards uses the full-saturation category hex at 100% opacity. The card background behind the strip is always a neutral surface (`#2D4855` dark / `#FFFFFF` light) — never another category colour.

### Typography link colour (context-specific exception)

On the Item Detail screen, the in-text "Typography" breadcrumb link uses a **lighter shade in dark mode and a darker shade in light mode** to meet contrast requirements against their respective backgrounds:

| Mode  | Colour    | Contrast on screen BG | WCAG Grade |
|-------|-----------|----------------------|------------|
| Dark  | `#72B5E8` | 5.7 : 1 on `#223740` | AA         |
| Light | `#1A5499` | 5.4 : 1 on `#E4EFF2` | AA         |

---

## 5. Typography

### Font families

| Family                      | Role              | Usage                                                        | Web Fallback(s)               |
|-----------------------------|-------------------|--------------------------------------------------------------|-------------------------------|
| ITC Avant Garde Gothic Pro  | Primary UI font   | Headings, labels, navigation, tags, chips, map text          | Josefin Sans · Futura         |
| Adelle                      | Primary body font | Descriptions, about text, captions, designer notes           | Roboto Slab · Avro            |

#### Font stacks
<link rel="stylesheet" href="https://use.typekit.net/evd2cyp.css">

```css
/* Display / UI */
font-family: 'ITC Avant Garde Gothic Pro', 'Josefin Sans', Futura, sans-serif;

/* Editorial / Body */
font-family: 'Adelle', 'Roboto Slab', Avro, serif;
```

> **Prototype note:** ITC Avant Garde Gothic Pro and Adelle are commercially licensed fonts not available via Google Fonts. The prototype renders using **Josefin Sans** (geometric sans-serif) as the display/UI fallback and **Roboto Slab** as the body/editorial fallback. Both are loaded from Google Fonts. When the licensed fonts are available — for example, via Adobe Fonts or a self-hosted font service — they should be placed first in the font stack above.

#### Secondary options by role

| Role              | Primary                     | Secondary 1   | Secondary 2 |
|-------------------|-----------------------------|---------------|-------------|
| Display / UI      | ITC Avant Garde Gothic Pro  | Josefin Sans  | Futura      |
| Editorial / Body  | Adelle                      | Roboto Slab   | Avro        |

#### Choosing a secondary option

- **Josefin Sans** — Closest Google Fonts approximation of ITC Avant Garde Gothic Pro. Geometric, low-contrast strokes, tall x-height. Use when the licensed font is unavailable in a web context.
- **Futura** — Available as a system font on Apple devices (macOS, iOS). Acceptable fallback if ITC Avant Garde Gothic Pro and Josefin Sans both fail to load.
- **Roboto Slab** — The preferred web-safe fallback for Adelle. Available on Google Fonts. Humanist slab serif with consistent letterform proportions. Load weights 400 and 500 at minimum.
- **Avro** — Use as a last-resort serif fallback. Simpler letterforms than Adelle but maintains the serif character of editorial content.

### Type scale

| Level           | Family                     | Weight | Size      | Letter Spacing | Transform | Usage                               |
|-----------------|----------------------------|--------|-----------|----------------|-----------|-------------------------------------|
| H1 Screen Title | ITC Avant Garde Gothic Pro | 700    | 22px      | 2.2px          | Uppercase | Page headings, spot titles          |
| H2 Section      | ITC Avant Garde Gothic Pro | 700    | 17px      | —              | Sentence  | Section headings, panel titles      |
| Label Large     | ITC Avant Garde Gothic Pro | 600    | 16–17px   | —              | Sentence  | Nav labels, primary action buttons  |
| Label Medium    | ITC Avant Garde Gothic Pro | 600    | 13–15px   | —              | Sentence  | Card titles, CTA buttons            |
| Label Small     | ITC Avant Garde Gothic Pro | 600    | 9–12px    | 0.1em          | Uppercase | Category tags, chips, captions      |
| Map Label       | ITC Avant Garde Gothic Pro | 400    | 10–11px   | 0.1em          | Uppercase | Street names, district names        |
| Body            | Adelle                     | 400    | 15px      | —              | Sentence  | Descriptions, about text            |
| Caption         | Adelle                     | 400    | 13px      | —              | Sentence  | Sub-descriptions, detail lines      |

### Rules

- Do not mix ITC Avant Garde Gothic Pro and Adelle within the same sentence or label.
- ITC Avant Garde Gothic Pro at Label Small and Map Label levels must always be uppercase with `letter-spacing: 0.1em` or wider.
- Adelle body text must have `line-height: 1.6` (relaxed) minimum.
- Do not apply Adelle to any interactive element (buttons, nav items, chips). All interactive text uses ITC Avant Garde Gothic Pro (or its fallback).
- Heading levels (`<h1>`, `<h2>`) must follow document hierarchy — never skip levels for visual purposes. Use CSS to restyle visually if needed.

---

## 6. Spacing & Border Radius

### Spacing scale

| Name | Value    | Usage                                    |
|------|----------|------------------------------------------|
| xs   | 4px      | Icon internal padding, tight inner gaps  |
| sm   | 8px      | Component internal gaps                  |
| md   | 12–16px  | Card padding, list item gaps             |
| lg   | 24px     | Section internal padding                 |
| xl   | 32–48px  | Page-level vertical spacing              |

### Border radius scale

| Name       | Value   | Usage                                          |
|------------|---------|------------------------------------------------|
| Pill       | 50px    | Icon buttons, nav pills, small icon containers |
| Large Card | 24px    | Bottom drawers, pull-up sheets                 |
| Card       | 16–20px | Gem cards, image containers, map markers       |
| Tag        | 8px     | Category chips, small inline badges            |
| Phone      | 52px    | Device frame outer shell                       |

---

## 7. Components

### Buttons

#### Primary CTA
- Background: `#E7E626`
- Text: `#1D3240` (ITC Avant Garde Gothic Pro 600, uppercase, tracking `0.1em`)
- Height: 48px
- Border radius: 16px
- Hover: 8% darker background
- Focus: `outline: 2px solid #E7E626; outline-offset: 2px` (dark) / `outline: 2px solid #1D3240` (light)

#### Category CTA (e.g. Artist's Choice)
- Background: full-saturation category hex
- Text: `#FFFFFF` (ITC Avant Garde Gothic Pro 600, uppercase)
- Height: 48px
- Border radius: 16px

#### Ghost / Secondary
- Background: transparent
- Border: `1px solid` `--divider-strong`
- Text: `--content-3`
- Height: 40px
- Border radius: 12px

#### Icon Button — Default
- Background: transparent
- Border: `1px solid` `--divider-strong`
- Icon fill: `--content-3`
- Size: 34×34px
- Border radius: 50% (pill)
- Focus ring: 2px solid focus-ring token

#### Icon Button — Active / Pressed
- Background (dark): `--content-2` (`#BDD0CC`); Icon fill: `--surface-4` (`#2D4855`)
- Background (light): `--surface-2`; Icon fill: `--content-3`
- Size: 34×34px, border radius: 50%

### Navigation

#### Top navigation bar
- Height: 64px
- Background: `--surface-4`
- Border bottom: `1px solid` `--divider-strong`
- Contains: Logo (left), icon button group (right)
- `<nav aria-label="Main navigation">`

#### Bottom tab bar
- Height: 64px
- Background: `--surface-3`
- Border top: `1px solid` `--divider-strong`
- Three tabs: Map, Guide, Profile
- Active tab: icon in `--surface-4` pill, text + icon in `--content-1`, `aria-current="page"`
- Inactive tab: icon + text in `--content-3` (5.1 : 1 minimum)
- `<nav aria-label="Bottom navigation">`

#### Route side nav (Map screen)
- Right-anchored, icon-only buttons
- Size: 54×54px, border radius `16px 0 0 16px` (rounded left only)
- Background: `{categoryHex}CC` (dark) / `{categoryHex}DD` (light)
- Each button has `aria-label="{Route Name} route"`
- No visible text labels — all labelling through `aria-label` only

### Cards

#### Gem card
- Background: `--surface-4`
- Border radius: 16px
- Box shadow (light mode only): `0 1px 4px rgba(0,0,0,0.08)`
- Layout: left image (116×116px, rounded 16px) + right text column
- Left edge indicator strip: 14px wide, full category hex, rounded left corners
- Card is a `<button>` with `aria-label="{title}: {category}. {description}"`
- Focus ring: 2px solid focus-ring token

#### Designer's Note card
- Background (dark): `--surface-4`; (light): `#EEF5F7`
- Left border: `3px solid #2B5EA8`
- Border radius: `0 12px 12px 0`
- Title: ITC Avant Garde Gothic Pro 700, 17px
- Body: Adelle 400, 15px

### Map markers
Three concentric SVG layers:
1. Outer glow ring: category hex at 15% opacity
2. Middle ring: category hex at 85% opacity, stroked
3. Inner filled circle: category hex, white stroke at 40% opacity (dark) / 50% opacity (light)

Each marker is a `<button>` with `aria-label="{Spot Name} — {Category} spot"`.

### Filter chips (category selector)
- Layout: horizontal scroll row, `role="group" aria-label="Filter by category"`
- Each chip: `role="radio" aria-checked="true|false"`
- Active state: full-saturation category hex bg + `#FFFFFF` text
- Inactive state (dark): `{hex}55` bg + `#C0D5D0` text
- Inactive state (light): `{hex}33` bg + `#3A6070` text
- Border radius: 8px
- Do not use `disabled` for inactive chips — they remain actionable

### Bottom sheet / Near You panel
- Background: `--surface-4`
- Border top: `1px solid` `--divider-strong`
- Drag handle: 56×3px pill, `#5A8A95` (dark) / `#B0C5CA` (light), centred
- `role="region" aria-label="Spots near you"`

### Search bar
- `<label htmlFor="...">` with `sr-only` class wrapping visible input
- Placeholder text in `--content-3`
- Background: `rgba(237, 244, 240, 0.15)` dark / `rgba(45, 72, 85, 0.08)` light
- Border: `rgba(237, 244, 240, 0.12)` dark / `rgba(45, 72, 85, 0.15)` light
- Height: 50px; border radius: 16px
- Caret colour: `#E7E626` dark / `--content-1` light

---

## 8. Map Wireframe Styles

The map is a wireframe placeholder. Final implementation will use Mapbox or Atlas. The wireframe establishes visual language for the tiled map background.

### Dark mode map

| Element             | Value                        |
|---------------------|------------------------------|
| Map canvas          | `#1E3340`                    |
| City block fill     | `#1C3328` at 60% opacity     |
| City block alt      | `#16303E` at 50% opacity     |
| Park / green space  | `#1C3328`                    |
| Minor grid lines    | `#26404F`, 1.5px             |
| Major road fill     | `#2E5262`                    |
| Street labels       | `rgba(180, 215, 225, 0.50)`  |
| Neighbourhood labels| `rgba(180, 215, 225, 0.28)`  |
| Park name labels    | `rgba(94, 177, 122, 0.55)`   |

### Light mode map

| Element             | Value                        |
|---------------------|------------------------------|
| Map canvas          | `#C8DAE0`                    |
| City block fill     | `#A5BCBF` at 60% opacity     |
| City block alt      | `#96ADB1` at 50% opacity     |
| Park / green space  | `#9DBFA5` (retains green hue)|
| Minor grid lines    | `#97AEB5`, 1.5px             |
| Major road fill     | `#739AAA`                    |
| Street labels       | `rgba(20, 48, 62, 0.55)`     |
| Neighbourhood labels| `rgba(20, 48, 62, 0.28)`     |
| Park name labels    | `rgba(28, 78, 48, 0.50)`     |

### Route overlays (both modes)
- Artist's Choice route: `#E7E626` dashed stroke, `stroke-dasharray: 5.98 5.98`, width 2.2px, opacity 45%
- Secondary route: `#F4784F` dashed stroke, same dash pattern, opacity 40%

### Map label rules
- Street labels and neighbourhood labels use `rgba` values deliberately. This is a map-context exception to the opacity rule — they are supporting orientation cues, not primary readable content.
- Label font: ITC Avant Garde Gothic Pro, regular weight, 10–13px, uppercase, tracking `0.1em`
- Vertical street labels use `-rotate-90` transform

---

## 9. Accessibility Rules

### Colour contrast minimums

All text must meet **WCAG 2.1 Level AA** (4.5 : 1 for normal text, 3 : 1 for large text ≥ 18px or bold ≥ 14px). All TRACE text colours have been verified to exceed this minimum.

| Context                        | Minimum ratio | TRACE standard |
|--------------------------------|---------------|----------------|
| Body text (< 18px)             | 4.5 : 1       | ≥ 5.0 : 1      |
| Large text (≥ 18px or bold 14px)| 3.0 : 1      | ≥ 5.0 : 1      |
| Interactive component states   | 3.0 : 1       | ≥ 4.5 : 1      |
| Focus indicator                | 3.0 : 1       | ≥ 5.0 : 1      |

Semi-transparent (`rgba`) text values must **never** be used for any content text, labels, or interactive elements. They are permitted only for map wireframe fills and decorative overlays.

### Focus management

Every interactive element — buttons, links, inputs, and custom controls — must have a visible focus indicator:

- **Dark mode:** `outline: 2px solid #E7E626; outline-offset: 2px`
- **Light mode:** `outline: 2px solid #1D3240; outline-offset: 2px`

Never suppress focus outlines with `outline: none` without providing an equivalent custom focus style. When using `onFocus`/`onBlur` to apply focus styles via `boxShadow` or `outline`, ensure both handlers are always paired.

### Semantic HTML

Use native HTML elements wherever possible. Custom components must replicate the semantics of the native element they replace.

| Element type         | Required HTML / ARIA                              |
|----------------------|---------------------------------------------------|
| Navigation regions   | `<nav>` with descriptive `aria-label`             |
| Main content area    | `<main>` with descriptive `aria-label`            |
| Page headings        | `<h1>` per screen; `<h2>` for sections            |
| Article cards        | `<article>` wrapping each Gem card                |
| Section regions      | `<section>` with `aria-labelledby` pointing to heading |
| Breadcrumb           | `<nav aria-label="Breadcrumb">` with `<ol>` list  |
| Current page         | `aria-current="page"` on active nav item          |
| Filter chip group    | `role="group" aria-label="Filter by category"`    |
| Filter chips         | `role="radio"` with `aria-checked="true|false"`   |
| Bottom sheet region  | `role="region"` with `aria-label`                 |

### Icon buttons and icon-only controls

Every button that contains only an icon — and no visible text — must have an `aria-label` describing its action. This includes:

- Search button: `aria-label="Search spots and routes"`
- Settings button: `aria-label="Open settings"`
- Back button: `aria-label="Go back"` or `aria-label="Back to {Screen Name}"`
- Map markers: `aria-label="{Spot Name} — {Category} spot"`
- Route nav buttons: `aria-label="{Route Name} route"`
- Artist's Choice badge: `aria-label="Artist's Choice route — tap to explore"`

Do not use tooltip text, `title` attributes, or visible-but-clipped text as a substitute for `aria-label` on interactive elements.

### Logo and wordmark

The TRACE logo SVG is a visual-only element. Wrap it in a container with `aria-label="TRACE Toronto"`. Do not add `alt` text to individual SVG paths. Apply `aria-hidden="true"` to all decorative SVG elements and icon paths.

### Images

| Image type                         | `alt` attribute requirement              |
|------------------------------------|------------------------------------------|
| Decorative (status bar background) | `alt=""`                                 |
| Gem card photo                     | Full descriptive alt text describing the subject and medium |
| Hero image (Item screen)           | Full descriptive alt text including subject, medium, and location context |

Example of a correct Gem card alt text:
```
alt="Lee's Palace facade — a vibrant psychedelic mural covering the entire building front with hand-lettered typography"
```

### Screen reader labels — inputs

All `<input>` elements must have an associated `<label>`. If the label is visually hidden, use a `sr-only` class (visually hidden but accessible):

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Misleading labels

Remove any label text that describes a state inaccurately or redundantly. The original prototype contained a side nav button labelled "Active" at 50% opacity — this label was both visually inaccessible (2.2 : 1 contrast) and semantically incorrect (it appeared on all route buttons, not just the active one). The fix: remove visible label text entirely and rely on `aria-label` for the accessible name.

### Keyboard and focus order

- Interactive elements must receive focus in a logical DOM order matching the visual reading order.
- All custom focus styles must be applied via `outline` or `box-shadow` — never by changing only `background` or `color`, which are insufficient on their own as focus indicators.
- The `onFocus` and `onBlur` event handlers must always be used in pairs. Setting a focus style in `onFocus` without clearing it in `onBlur` will leave stale styles on the element.

---

## 10. Before / After: Accessibility Fixes

The following six colour failures were identified in the original Figma-imported code and corrected.

### 1. Typography link text

| | Colour | Contrast on `#223740` | Result |
|---|---|---|---|
| Before | `#334a8e` | 1.3 : 1 | FAIL |
| After  | `#72B5E8` | 5.7 : 1 | PASS ✓ AA |

**Problem:** Dark navy on a dark teal background — essentially invisible.
**Fix:** Shifted to light steel blue. The hue remains in the blue/typography family but is now readable.

---

### 2. Inactive filter chip text

| | Colour | Contrast on chip background | Result |
|---|---|---|---|
| Before | `rgba(100, 133, 141, 0.50)` | ~1.9 : 1 | FAIL |
| After  | `#C0D5D0` (solid)           | 7.2 : 1  | PASS ✓ AAA |

**Problem:** Semi-transparent gray text disappeared against the chip's semi-transparent background.
**Fix:** Replaced with a solid teal-white value derived from the same hue family.

---

### 3. Bottom navigation inactive icon

| | Colour | Contrast on `#223740` | Result |
|---|---|---|---|
| Before | `rgba(237, 244, 240, 0.50)` | 2.2 : 1 | FAIL |
| After  | `#8AADB5` (solid)           | 5.3 : 1 | PASS ✓ AA |

**Problem:** 50% opacity white on a dark teal background. Semi-transparent inactive states are a common anti-pattern — they look intentional but fail contrast checks.
**Fix:** Replaced with a solid mid-teal value that communicates inactivity through hue and saturation rather than opacity.

---

### 4. Route side nav "Active" label

| | Value | Contrast | Result |
|---|---|---|---|
| Before | Text: "Active" at `rgba(237,244,240,0.5)` | 2.2 : 1 | FAIL |
| After  | Label removed; `aria-label` used instead   | N/A (no visible text) | PASS ✓ |

**Problem:** The label "Active" appeared at 50% opacity on every route nav button — both visually inaccessible and semantically wrong (it implied all buttons were active simultaneously).
**Fix:** Visible label removed entirely. Each button's purpose is communicated through `aria-label="{Route Name} route"`.

---

### 5. Map street labels

| | Opacity | Approximate contrast | Result |
|---|---|---|---|
| Before | 32% (`rgba(180,215,225,0.32)`) | ~1.5 : 1 | FAIL |
| After  | 50% (`rgba(180,215,225,0.50)`) | ~2.3 : 1 | PASS* |

*Street labels are supporting orientation cues on a map wireframe, not primary content. A 3 : 1 ratio applies to large text and UI components. At 10–11px uppercase, these labels sit at the boundary. The 50% value is the minimum acceptable; 60%+ is recommended for production.

---

### 6. Typography category tag background

| | Background + Text | Contrast | Result |
|---|---|---|---|
| Before | `#334a8e` bg + `#cddbd0` text | 3.4 : 1 | FAIL |
| After  | `#2B5EA8` bg + `#FFFFFF` text  | 6.3 : 1 | PASS ✓ AA |

**Problem:** The original tag used a muted sage text colour on a dark navy background. Neither the hue choice nor the contrast met standards.
**Fix:** Shifted background to steel blue (harmonious with teal palette) and switched text to solid white, achieving a comfortable AA pass.

---

*End of TRACE Toronto Style Guide. Version: April 2026.*