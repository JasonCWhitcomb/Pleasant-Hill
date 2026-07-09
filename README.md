# East Bay Community Partnerships — Pleasant Hill Pitch

An interactive proposal page making the case for launching **East Bay Community
Partnerships** — a public-private revenue-share partnership that generates new,
non-tax revenue for the Pleasant Hill Recreation & Park District — under the
**Kinetic Culture** brand.

## What it is

A single-page, fully interactive pitch built for the City of Pleasant Hill's
City Manager and the Recreation & Park District Board. It tells the story in the
board's own language: after Measure S (the $77M parks bond) fell just short of a
two-thirds supermajority in November 2024, this is a funding path that carries
**zero taxpayer risk**.

Highlights:

- **Interactive revenue projections** — Conservative / Foundation / Regional
  scenarios, tap any year for the 70/30 District split.
- **Sponsorship tier deep-dives** — modal windows for Silver / Gold / Presenting.
- **Asset explorer** — what's sponsorable, what it's worth, and who would buy it.
- **"The Room"** — the pitch through each decision-maker's lens.
- **Benchmarks** — real, sourced comparables from other park agencies.

## Stack

Plain HTML, CSS and vanilla JavaScript — no build step, no dependencies.
Consistent with the existing kineticculture.com pages and optimized for fast
loads on any device a board member might use in a meeting room.

- `index.html` — page structure and copy
- `styles.css` — design system (Pleasant Hill civic palette + Fraunces / Hanken / JetBrains Mono)
- `script.js` — all interactivity (scroll reveals, counters, charts, modals, contact form)
- `assets/` — favicon and static assets
- `vercel.json` — deploy config (clean URLs, caching, security headers)

## Deploy (Vercel)

This is a static site. On Vercel, import the GitHub repo and deploy — no build
command or framework preset required (Output Directory: repository root).

## Note

Independent proposal prepared by Kinetic Culture. Not an official City or
District publication. Revenue figures are illustrative projections based on
published benchmarks from comparable agencies.
