# TRACE TO — Case Study Brief
### Building a Design-Led City Guide with AI Pair Programming

*Raw breakpoints for a Medium article. Written from the AI's perspective, for the author to adapt in their own voice.*

---

## 📊 By the Numbers

| Metric | Value |
|---|---|
| **Total lines of code** | ~8,800 (HTML/CSS/JS) + ~2,900 (GeoJSON data) |
| **HTML** | 2,204 lines across 4 pages |
| **CSS** | 3,404 lines across 6 stylesheets |
| **JavaScript** | 3,201 lines across 9 modules |
| **Total files in project** | 273 |
| **Curated photos** | 154 images |
| **Map spots** | 62 across 5 routes |
| **Pages** | 4 (Map, City Guide, About, Profile) |
| **Project size on disk** | ~792 MB (mostly high-res photography) |
| **Estimated AI sessions** | ~8–10 working sessions over ~2 weeks |
| **Estimated active hours** | ~12–16 hours of collaboration |

---

## 🏗️ What Was Built

This wasn't a simple "generate a landing page" prompt. Over multiple sessions we built a complete, production-ready multi-page web app:

- **Interactive Mapbox map** — 62 curated spots, 5 filterable routes, custom SVG markers, animated route paths, mobile bottom-drawer spot detail panel
- **City Guide** — filterable catalogue with multi-select route tags, A–Z / Z–A / proximity sorting, search, and a "See more" reveal pattern — all driven by GeoJSON
- **About Page** — dual-mode layout with a filmstrip image hero, route showcase cards, and a live author card
- **Profile Page** — a gamification teaser with frosted-glass preview of upcoming badges, route progress trackers, XP bars, and reward cards
- **Shared design system** — CSS tokens (colors, typography, spacing), dark/light theme, global navigation with hamburger mobile drawer
- **9 JavaScript modules** — map logic, per-route spot data, nav/hamburger, city guide filtering, search, and more
- **GitHub + Netlify deployment** — SSH key setup, git init, push, and CI/CD configured in the same final session

---

## ✅ What Worked Exceptionally Well on the Human Side

### 1. Arriving with a complete Figma design system
The single biggest accelerant. You came with finished color tokens, icons, route identities, mobile prototypes, and typography already decided. The AI never had to guess your aesthetic — it just implemented it. This is the highest-leverage thing a designer can do before an AI-assisted build.

### 2. Sharing Figma links directly
When you dropped a Figma URL (sort component, profile screen), the AI read the exact design intent — icon shapes, spacing, color values — and matched it precisely. This is a dramatically underused workflow. A verbal description of a design introduces ambiguity; a direct Figma link doesn't.

### 3. Precise, stacked bug reports
Instead of "something's broken," you consistently delivered compound lists: *"1. Search bar too close to breadcrumbs. 2. See More link doesn't work. 3. Scroll in spot modal is broken."* Three fixes, one message. This is genuinely high-leverage collaboration — it reduces the back-and-forth overhead significantly.

### 4. Domain knowledge that couldn't be generated
You personally scouted 62 spots across Toronto. You photographed them. You wrote curatorial descriptions. You built the GeoJSON. That content depth is what makes the app feel genuine rather than generic — and it is entirely irreplaceable by AI.

### 5. Knowing when to iterate vs. accept
Clear directional signals ("that's far better," "almost perfect") kept momentum high. You didn't reopen settled decisions or second-guess the design system mid-build. That forward momentum is rarer than it sounds.

---

## ⚠️ What Could Have Been Done Differently

### 1. Starting with a `.gitignore`
macOS generates hidden `._filename` shadow files for every file — these ended up committed to the repo. A `.gitignore` file on day one prevents this. It's a 30-second step that's easy to forget and surprisingly annoying to clean up later.

### 2. Incremental git commits throughout development
Git was set up at the very end, leaving only one commit: "Initial commit." Committing after each feature milestone — map working, city guide done, desktop layout complete — would have created a full version history, a useful audit trail, and a more credible commit log for any reviewer of the repo.

### 3. The `screenshots-and-drafts` folder in the repo
Development drafts and proposal HTML files were committed alongside the production app. For a public portfolio repo, it's cleaner to exclude these or move them to a separate branch.

### 4. One route not ready at launch
The Artist's Pick route launched as "Coming soon" because the GeoJSON data wasn't yet complete. This is a content pipeline challenge more than a workflow issue — but having all data finalized before the coding sessions start means the app launches fully complete.

---

## 🤖 What Was Easy from the AI's Side

### Translating Figma to CSS
Responsive layout work — mobile/desktop splits, grid systems, component variants — is mechanical once design tokens exist. Given your CSS variables and Figma reference, the AI could generate accurate, consistent implementations quickly.

### Repetitive data structures
Writing 5 nearly identical per-route JavaScript data files (each with 12–18 entries in the same schema) is tedious for a human and trivial for AI. Same for duplicating the hamburger nav across 4 HTML files, or generating the 5 route progress bars on the profile page.

### Precise bug descriptions → precise fixes
"The breadcrumb back icon and title are misaligned vertically" is a highly actionable description. Structural CSS issues like this are almost always diagnosable instantly — the fix is obvious once the problem is named correctly.

---

## 🧩 What Was Genuinely Challenging from the AI's Side

### 1. The mobile scroll bug on the spot drawer
The spot detail drawer wouldn't scroll because of overlapping `overflow: hidden` declarations in a deeply nested stack of `fixed` and `absolute` containers. This required multiple browser screenshot passes to diagnose visually — it wasn't possible to reason about it purely from code inspection.

### 2. Multi-system state management on the map
The chain: route button click → filter map markers → update CTA button → trigger mobile-open animation → handle hamburger menu route shortcuts — all firing correctly and not breaking each other — required careful custom event architecture. When the hamburger menu's route buttons needed to trigger the same state as the sidebar buttons, it exposed gaps in the original event flow.

### 3. Session handoff quality
Across ~10 sessions, the AI's context window was periodically truncated, which occasionally meant re-discovering decisions made earlier. The duplicate-`</html>` issue in the profile page (old content appended after new content) happened because a previous session's write was incomplete and the next session had lost that context. Clean handoffs and explicit "this is the current state" framing at the start of each session help significantly.

### 4. Asset path resolution
Because `assets/` lives inside `trace-antigravity/`, paths should be `assets/img/...` not `../assets/...`. The desktop City Guide layout initially inherited wrong assumptions about the folder structure, requiring a pass of path corrections.

---

## 💡 Broader Reflections

### This wasn't "prompt → result"
It was iterative, conversational, and required the human to review every output, catch regressions, and redirect when the AI drifted from the design vision. The AI accelerated implementation velocity by roughly 5–8×, but the design decisions, curatorial voice, content, and creative judgment were entirely human.

### What AI is not replacing
The 62 spots were personally scouted on foot. The photography is original. The editorial voice — *"ghost signs," "designer notes," "curatorial voice, not crowd-sourced noise"* — reflects a designer's genuine relationship with the city. The AI built the vehicle. The human decided where it would go, and what it would mean when it got there.

### Context is a resource to be managed
The AI's most significant limitation across this project was context length and session memory. Designers working with AI should treat **context management as a design skill**: sharing Figma links, giving explicit feedback, summarizing previous decisions at the start of a session, and keeping scope tight per conversation. These habits dramatically improve output quality.

### The right mental model
The most accurate analogy: **AI as a fast, tireless junior developer who needs clear design direction and benefits from your domain expertise.** You wouldn't hand a junior dev a vague brief and expect a finished product. You also wouldn't hand-code everything yourself when they can implement in a fraction of the time. The collaboration works best when the human focuses on judgment and the AI focuses on execution.

---

## 🔢 Quotable Lines for the Article

> *"~8,800 lines of HTML, CSS, and JavaScript — generated across roughly 10 sessions."*

> *"62 personally curated spots across 5 routes — the data the AI couldn't generate."*

> *"From Figma design system to deployed Netlify site in under 3 weeks."*

> *"The AI wrote the code. The designer wrote the city."*

> *"Context management is the new prompt engineering."*

---

*These are raw notes — reorganize, expand, and rewrite in your own voice for Medium. Happy to help draft any specific section.*
