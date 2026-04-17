# TRACE : Toronto
### The Route of Art & Creative Exploration

**A non-commercial, multi-platform design ecosystem for exploring the creative side of Toronto.**

---

## What Is TRACE?

Most city guides tell you where to eat. TRACE tells you what to *look at*.

TRACE is a curated creative exploration platform that maps Toronto's hidden visual culture — ghost signs, brutalist architecture, public art objects, murals, and typographic landmarks that most tourists and even most locals walk past without noticing. It bridges the gap between a digital utility and a physical game: part city guide, part scavenger hunt, part design education.

The project was created by a designer, for designers — and for anyone who goes outside for inspiration rather than entertainment.

> *"Toronto is more than what you're told to look at. TRACE helps you notice what's hidden in the city and see Toronto as a design system rather than hustle and bustle."*

---

## Mission

To create a sense of belonging and recognition among Toronto's creative community by offering a new, engaging way of seeing and experiencing the city — one hidden gem at a time.

TRACE exists to:
- **Document** urban art and design before it disappears — ghost signs, temporary murals, and vernacular typography that are part of the city's visual memory
- **Connect** graphic designers, architects, photographers, and curious locals with the city's creative fabric in a way generic tourism platforms never could
- **Promote** sustainable, walkable city exploration over mass tourism
- **Educate** through designer notes, historical context, and curatorial voice — not dry plaques

---

## The Five Routes

TRACE : Toronto — Edition 1 covers **downtown Toronto** from Bloor Street to the waterfront, Bathurst to Yonge. Five curated walking routes, each with a minimum of 10–15 verified spots:

| Route  | What You'll Find |
|---|---|
| **Typography**| Ghost signs, neon marquees, brutalist lettering, civic type, storefront design |
| **Architecture** | Brutalist landmarks, modernist campus buildings, heritage facades |
| **Art Objects** | Public sculpture, installation art, permanent outdoor works |
| **Street Art** | Large-scale murals, commissioned and grassroots, documented by neighbourhood |
| **Artist's Pick**| Curator-selected cross-category gems — the unexpected finds |

Routes are multi-select: users can explore one route at a time or layer multiple routes on the same map for a combined walk.

---

## Target Audience

### Primary
- Graphic designers, illustrators, and visual artists based in Toronto
- Architecture and design students (Humber, OCAD, Ryerson/TMU, U of T)
- Creative professionals visiting from elsewhere in Canada and the US

### Secondary
- Curious locals who want to rediscover their city on foot
- Content creators and travel bloggers seeking non-generic Toronto content
- Educators using the city as a living design classroom

### Persona
**Jim, 32 — Freelance UX Designer, Toronto**
Walks or bikes everywhere. Brings a camera or sketchbook. Goes outside for inspiration, not entertainment. Frustrated by generic tourist guides and unmapped hidden gems he finds by accident. Wants something that explains *why* a place matters, not just where it is.

---

## Project Components

### 1. Interactive Web Map (trace.design)
The core product. A mobile-first responsive web app with:
- Mapbox-powered custom dark map (TRACE visual style)
- Five filterable route overlays with walking path lines
- Spot markers with rich detail: photo, about, designer's note, clue/hint, style tags
- Scavenger hunt mechanic: clues and riddles to navigate between spots
- Near You section: spots closest to the user's current location
- XP and badge system for completed routes

### 2. TRACE Zine
A quarterly printed editorial with a fold-out map insert. Bridges the digital experience with a physical object — interviews with artists, stories behind the spots, new discoveries. Validates the brand's presence in the real world.

### 3. Social Media Campaign
Instagram and LinkedIn content series: reels, carousels, and stories that reveal the stories behind spots. Designed to drive awareness and grow the TRACE community before and after the web launch.

---

## Current Progress — Edition 1 (Toronto, Downtown)

### ✅ Completed

**Research & Content**
- Field research complete for downtown Toronto (Bloor to Front, Bathurst to Yonge)
- Typography route: 12 spots researched, photographed, and written (About, Designer Note, Clue/Hint, Interesting Fact, Style Tags)
- All spot photography shot and processed; images hosted on Cloudinary with auto-optimization
- GeoJSON map data built: spot coordinates, walking route line, and all content fields embedded
- Competitive analysis complete (Atlas Obscura, DestinationToronto, Tripadvisor, Google Things To Do)

**Brand & Visual Identity**
- Logo designed: TRACE TO wordmark in ITC Avant Garde Gothic Pro
- Full colour palette defined: background system, text hierarchy, five route colours, CTA system
- Typography scale defined: 18 styles across ITC Avant Garde Gothic Pro (display) and Adelle (body)
- Iconography set designed in Figma (24pt, 5 route icons + full UI icon set)
- Brand guidelines documented

**Design**
- Mid-fidelity prototype complete (Figma) — all primary screens
- Hi-fidelity design draft in progress (Figma)
- Screens designed: Home/Map, Guide, Route, Item Guide (×7 spots), Profile, Settings, Personal Info, Sign Up, Login
- Component library built: BottomNav, TopNav, SideNavRoutes, NearYouSlider, ButtonPrimary/Secondary, SearchContainer, GemItem, gemsScreen, guidebook-content, Badge, Rewards, RouteTracker, spot, tag, Sort
- Route filter state machine fully designed (5-state, multi-select, 5s auto-collapse)
- Design system documented: `design.md` (tokens, type scale, component inventory, interaction specs)
- Build instructions documented: `build-instructions.md` (stack constraints, file structure, CSS tokens as code, JS patterns)
- Mapbox custom dark map style created and live
- Map data structured as GeoJSON (Points + LineString per route)

### 🔄 In Progress

- Hi-fidelity Webflow/code prototype for final submission
- Typography route fully coded (12 spots, route line, map integration)
- Guide screen and Spot detail screen implementation

### 📋 Planned (Post-Submission)

- Remaining four routes: field research, photography, GeoJSON build
- Zine: layout, editorial content, print production
- Social media campaign: first content series
- Webflow CMS migration for long-term content management
- User testing round 2

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Map | Mapbox GL JS | Custom dark style, GeoJSON data, route lines + markers |
| Frontend | Vanilla HTML + CSS + JS | No framework, no build step, external CSS files |
| Data | GeoJSON + JS flat file | One file per route; Cloudinary for image hosting |
| Hosting | Vercel | Static site, free tier |
| Design | Figma | Prototype, component library, design system |
| Future CMS | Webflow CMS | Post-submission content management |

---

## What Makes TRACE Different

| Platform | Problem |
|---|---|
| Atlas Obscura | Global, unverified, no routes, vague collection, no map |
| DestinationToronto | Consumption-focused (restaurants, events), no interactivity, bad UI |
| Tripadvisor | Generic reviews, no niche recommendations, no map |
| Google Things To Do | Shows standard attractions, no route creation, no discovery motivation |

TRACE is the only platform that:
- Is created *by a designer, for designers* — curatorial voice, not crowd-sourced noise
- Combines a walking route mechanic with genuine editorial depth
- Has a scavenger hunt / game layer on top of city exploration
- Documents ephemeral urban design (ghost signs, temporary murals) before it's gone
- Is built for walking, not driving — neighbourhoods and streetscapes, not landmarks

---

## Future Plans

### Edition 2 — Toronto Expanded
- Four remaining routes complete: Architecture, Art Objects, Street Art, Artist's Pick
- Extend geographic coverage: East end (Leslieville, Distillery, Riverside), West end (Roncesvalles, Parkdale, Little Portugal), Midtown (Yorkville, Rosedale)
- Seasonal updates: new spots added quarterly via zine tie-in

### Edition 3 — Toronto Full City
- North York, Scarborough, Etobicoke creative districts
- Collaboration with local artists, designers, and cultural organisations
- User-submitted spot pipeline with curatorial review

### Future Cities
The TRACE model is designed to scale:
- **Montréal** — murals, Brutalism, French typography culture
- **Vancouver** — public art, Indigenous design, Pacific modernism
- **New York, Chicago, London** — longer-term international expansion

Each city edition maintains the same five route structure but adapts to local creative culture.

### Platform Evolution
- Native mobile app (iOS + Android) — turn-by-turn walking navigation, offline maps
- Postcards and souvenirs tied to completed routes
- Educational partnerships with design schools
- Artist collaboration programme — featured designers contribute notes and picks
- Community layer — verified creative professionals add discoveries

---

## Project Credits

**Studio:** Conceptly Design  
**Designer & Project Lead:** Etual Fomina  
**Roles:** UX Design, Brand Identity, Photography, Editorial, Project Management  
**Contact:** etual.conceptly@gmail.com  
**Domain:** trace.design

---

## File Index

| File | Purpose |
|---|---|
| `design.md` | Complete design system: tokens, type scale, components, interactions |
| `build-instructions.md` | Technical build spec: stack, file structure, CSS variables as code, JS patterns |
| `route-typography.geojson` | Map data: 12 spots + walking route line for Typography route |
| Figma prototype | All screens, component library, style guide — `qWtyO6CR3xF5vrACpVBjuU` |
| Mapbox style | Custom dark map — `mapbox://styles/etual-conceptly/cmmy1pnn9000301qu6z8k4zta` |
