# Portfolio Redesign — r4rajat.com

**Date:** 2026-04-27
**Repo:** `r4rajat.github.io` (deployed to `r4rajat.com` via GitHub Pages)

## Goal

Modernize the personal portfolio at `r4rajat.com`. The current site is a 2020-era BootstrapMade template (Personal v2.1.0) that looks dated and ships a heavy vendor stack (jQuery, Bootstrap, Owl Carousel, three icon libraries, etc.). Replace with a clean, type-driven, dark-default static site. Remove personal identifying information (PII) that should not be on a public page.

## In Scope

- Modernize visual design: typography, layout, motion, color
- Remove all PII (birthday, phone number, full home address, city line)
- Keep static-only deployment via GitHub Pages on the existing CNAME (`r4rajat.com`)
- Drop heavy vendor dependencies — vanilla HTML / CSS / JS only
- Preserve existing content (experience, projects, skills, education) unchanged
- Inline the 5 project sub-pages as expandable cards on the main page (delete `/projects/` folder)
- Replace the external Google Drive resume link with a repo-hosted `/resume.pdf` (placeholder for now)
- Drop the profile photo for a fully type-driven design
- Add a dark/light theme toggle (dark default, respects `prefers-color-scheme`, persists in `localStorage`)

## Out of Scope

- Content rewrites — experience, project descriptions, skills text stay verbatim
- New sections beyond what currently exists
- Build tooling — no React, Astro, Hugo, etc.
- Backend or contact form — `mailto:` only
- Analytics setup — legacy Universal Analytics property `UA-169007209-3` is deprecated since July 2023; removing without replacement

## Architecture

- Single-page static site
  - `index.html` — markup
  - `assets/css/style.css` — styles (full rewrite of existing path)
  - `assets/js/main.js` — interactions (full rewrite of existing path)
  - `assets/js/projects.js` — static project data array
- No build step. Direct deploy via GitHub Pages.
- CNAME unchanged (`r4rajat.com`).

## Visual System

### Typography
- Body / UI: **Inter** (weights 400, 500, 600, 700)
- Display (hero name, section headings): **Instrument Serif** (weight 400)
- Mono (tech tags, accents): **JetBrains Mono** (weights 400, 500)
- Loaded from Google Fonts with `preconnect` + `display=swap`

### Color Tokens (CSS custom properties)

Dark theme (default):
- `--bg`: `#0a0a0b`
- `--surface`: `#131316`
- `--text`: `#ededed`
- `--muted`: `#8a8a93`
- `--border`: `#2a2a30`
- `--accent`: `#12d640` (preserves the green from the original site for brand continuity)
- `--accent-glow`: `rgba(18, 214, 64, 0.12)`

Light theme:
- `--bg`: `#fafafa`
- `--surface`: `#ffffff`
- `--text`: `#0a0a0b`
- `--muted`: `#6a6a72`
- `--border`: `#e5e5e8`
- `--accent`: `#0e9b30`
- `--accent-glow`: `rgba(14, 155, 48, 0.10)`

### Layout
- Max content width: 1100px, centered, generous side padding (24px mobile / 48px desktop)
- Section vertical padding: 96px desktop / 64px mobile
- Spacing tokens on an 8-pt grid

### Motion
- IntersectionObserver fade-up on section reveal (200 ms, 8px translate)
- 150 ms ease hover transitions on cards / buttons / links
- Smooth height animation on project card expand
- `prefers-reduced-motion: reduce` disables all motion (rotating role text becomes static "Developer")

## Sections

### 1. Sticky Nav
- **Left:** "Rajat Gupta" wordmark linking to top
- **Right (desktop):** anchor links (About / Experience / Projects / Skills / Education / Contact) + theme toggle + Resume button
- **Right (mobile):** theme toggle + hamburger that opens a full-screen drawer with the same anchor links
- Background transparent at top; on scroll, gains `backdrop-filter: blur(12px)` + a 1px bottom border

### 2. Hero
- Display name in serif, `clamp(48px, 8vw, 96px)`
- Rotating role line under the name: Developer → Gopher → k8s Enthusiast → RPA Enthusiast (vanilla JS, ~20 LOC; static "Developer" if reduced motion)
- One-sentence intro derived from the existing about paragraph
- Two CTAs: "Read my résumé" → `/resume.pdf`; "Get in touch" → `#contact`
- Background: subtle radial gradient using `--accent-glow`, very low opacity, off-center

### 3. About
- Single column, max ~640px line length
- Existing paragraph kept verbatim
- No photo

### 4. Experience
- Vertical timeline: thin left border line + small accent dot per entry
- 4 entries, content kept verbatim:
  - InfraCloud Technologies — Product Engineer (May 2022 – Present)
  - Apisero Inc. — Senior Software Engineer (Aug 2021 – May 2022)
  - Great Software Laboratory — Software Engineer (Sept 2020 – Aug 2021)
  - Great Software Laboratory — Software Development Intern (Aug 2019 – Sept 2020)
- Each entry: company name (link, accent on hover), role + dates, bullet list

### 5. Projects
- Filter chips above the grid: All / Python / Golang / RPA
- Responsive grid: 1 col mobile / 2 col tablet / 3 col desktop
- 5 project cards, sourced from the `projects.js` data array:
  - kanister, backstore, url_shortener_backend, netpolmgr, robot-framework-demo
- Card collapsed: title, monospace tech pills, 1-line description, expand chevron
- Click → expands in place: full description (folded in from current sub-pages) + GitHub link
- Smooth height transition; `aria-expanded` toggles on click
- The `/projects/` folder and its 5 HTML files are deleted

### 6. Skills
- Three category headers: Languages & Databases / Frameworks / Tools & Technology
- Each skill rendered as a monospace pill (text only, no logo images)
- Skill list preserved from the current site:
  - Languages & DBs: Python, Golang, MongoDB, MySQL
  - Frameworks: Kubernetes client-go, Flask, FastAPI, Django, Jinja, Node.js, Robot Framework
  - Tools: Git, Docker, Kubernetes, Mulesoft, Codefresh, Jenkins, AWS, DigitalOcean, Google Cloud, Azure, Ansible, Blue Prism, Jira, JetBrains

### 7. Education + Certifications
- Two-column layout (collapses to one column on mobile)
- **Left:** LPU B.Tech (Hons.) Computer Science card with coursework list
- **Right:** three certification cards stacked: Mulesoft Certified Developer L1, Coursera "Getting Started with Go", EFSET English

### 8. Contact
- Centered, generous vertical space
- Three icon + label buttons:
  - LinkedIn → `linkedin.com/in/rajat-gupta`
  - GitHub → `github.com/r4rajat`
  - Email → `mailto:hello@r4rajat.com`
- No form, no address, no phone
- Note: The contact email uses the `r4rajat.com` domain. The mailbox must be set up at the DNS / mail-host layer to actually receive mail.

### 9. Footer
- Single line: "© 2026 Rajat Gupta"
- Three social icons mirroring the contact section

## Data Flow

- Most content lives in `index.html` directly
- `assets/js/projects.js` exports a static array; each item:
  ```
  { id, title, filters: ['python'|'golang'|'rpa'], tech: [], blurb, body, github }
  ```
- `main.js` reads the array on load, renders project cards into a placeholder `<div>`, wires up filter and expand/collapse handlers

## Theme Toggle Behavior

1. First visit: read `prefers-color-scheme`; apply matching theme
2. User clicks toggle: write `'dark'` or `'light'` to `localStorage['theme']`
3. Subsequent visits: `localStorage` value wins over OS preference
4. Toggle button: `aria-pressed` reflects current theme; visible focus ring; smooth color transition (200 ms)

## Files Removed

- `index1.html` (stub)
- `projects/` (entire folder, 5 HTML files — content folded into project cards)
- `assets/vendor/` (entire folder — Bootstrap, jQuery, Owl, VenoBox, Boxicons, Icofont, Remixicon, Typed.js, Waypoints, Counterup, Isotope, php-email-form)
- `assets/img/me.jpg` (profile photo no longer used)
- All Google Tag Manager + Universal Analytics scripts in HTML head
- BootstrapMade template attribution comments

## Files Added

- `resume.pdf` — placeholder PDF (1 page, "Résumé coming soon"). User will replace later.
- `assets/js/projects.js` — project data array

## Files Updated (full rewrite)

- `index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `README.md` — short refresh: domain, tech stack, how to run locally

## Files Kept Untouched

- `CNAME`
- `favicon.png`
- `LICENSE`
- `.git/`
- `assets/img/education/lpu.png`
- `assets/img/education/efset.png`
- `assets/img/certification/*` (if referenced after audit)
- `assets/img/project/*` (kept and used in expanded project cards)
- `assets/img/background/*` (kept if referenced after audit)

## PII Removal Inventory

Categories removed from `index.html`:
- Date of birth (full date)
- Phone number (international format, two occurrences)
- Personal Gmail address — replaced with the domain-bound `hello@r4rajat.com` for public contact
- Full street address (multi-line)
- City + state line

Public contact email going forward is `hello@r4rajat.com` (domain-bound; the mailbox must be configured at the DNS / mail-host layer to actually receive mail).

## Accessibility

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Skip link to `<main>`
- Visible focus rings (1.5px accent outline, 2px offset)
- Color contrast ≥ WCAG AA in both themes
- All interactive elements keyboard-navigable in logical tab order
- `aria-expanded` on project cards, `aria-pressed` on theme toggle
- Alt text on all `<img>` elements
- `prefers-reduced-motion: reduce` disables fade-ups and rotating role typer
- Heading hierarchy: one `h1` (hero name), `h2` per section, `h3` within

## Testing Plan

- **Local serve:** `python3 -m http.server 8000` from repo root → visit `http://localhost:8000`
- **Responsive:** Chrome + Safari at 375 / 768 / 1280 / 1920 px viewport widths
- **Theme:** verify toggle persists across reloads; verify OS preference is honored on first load (test in fresh incognito)
- **Project cards:** each card expands/collapses smoothly; filter chips correctly hide non-matching cards; "All" restores
- **Keyboard:** tab through entire page, every interactive element reachable in logical order, focus visible
- **Lighthouse:** target ≥ 95 across Performance / Accessibility / Best Practices / SEO
- **HTML validation:** W3C validator on the rendered page
- **Final check:** click every external link to confirm correct URL

## Open Questions

None.

## Approval

User reviewed and approved this design summary in conversation before this spec was written.
