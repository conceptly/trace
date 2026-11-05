<a href="https://tracedesign.art"><img src=".github/readme/trace-map.jpg" width="100%" alt="Trace on desktop: the route menu on the left, the map of downtown Toronto with photo markers, and the detail panel for Dreaming by Jaume Plensa"></a>

# Trace

A walking map of Toronto’s design landmarks: lettering and ghost signs, street art, public art objects and architecture, each with a hint to help you find it.

[Live site](https://tracedesign.art) · [Case study](https://conceptly.design/case/trace-design)

## What it does

- **Map:** a Mapbox map with filterable routes, photo markers, animated route paths and a bottom drawer for spot details on mobile.
- **City Guide:** a searchable catalogue of every spot, filtered by route and sorted A–Z or by distance.
- **About and Profile:** the story behind the routes, and a preview of route progress and badges.
- **Light and dark themes** from one set of design tokens.

## Routes

| Route | Spots | Data |
|---|---|---|
| ![Typography](https://img.shields.io/badge/Typography-3A4E9A?style=flat) | 12 | `site/js/data-typography.js` |
| ![Street Art](https://img.shields.io/badge/Street%20Art-7A3084?style=flat) | 15 | `site/js/data-street-art.js` |
| ![Art Objects](https://img.shields.io/badge/Art%20Objects-257A48?style=flat) | 18 | `site/js/data-artefacts.js` |
| ![Architecture](https://img.shields.io/badge/Architecture-9D372E?style=flat) | 17 | `site/js/data-architecture.js` |
| ![Artist’s Pick](https://img.shields.io/badge/Artist%E2%80%99s%20Pick-0D7A82?style=flat) | 10 | coming back once all ten are walked |

<sub>The Artist’s Pick is ten places recommended by Toronto muralist Jerry “Birdo” Rugg. It’s hidden on the live site until I’ve walked all ten.</sub>

## Built with

`HTML` `CSS` `JavaScript (vanilla)` `Mapbox GL JS` `GeoJSON` `Netlify` `Figma`

Design system: light and dark colour tokens checked for WCAG AA, a 4px spacing grid, two corner radii, Josefin Sans and Roboto Slab. The tokens live in Figma and in the CSS custom properties.

## What’s in this repo

```
site/                    the live site: 4 pages, CSS, JS modules, images
map-data/                GeoJSON and CSV for each route, plus the Mapbox map style
documentation/           style guide, design and build notes, 404 page concepts
screenshots-and-drafts/  early drafts and concept pages
```

## Run it locally

```
npx serve site
```

<sub>The map uses the public Mapbox token in `site/js/map.js`. If it’s restricted to tracedesign.art, add your own.</sub>

## How it was made

I designed the system and every screen in Figma, walked and photographed each spot, wrote the descriptions and hints, and built the GeoJSON. I wrote the code with an AI coding assistant, working from the Figma files and reviewing every change. Trace started as my capstone at Humber and I’m still refining it.

---

<sub>© Etual Fomina. The code is open to read; the photos and texts are not for reuse without permission.</sub>
