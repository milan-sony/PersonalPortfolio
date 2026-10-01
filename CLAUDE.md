# Milan Sony — personal portfolio

Single-page portfolio: hero, about, education, skills, experience, projects, contact (with a form that emails through Resend), plus a 404 page.
Deployed on Vercel from GitHub (`milan-sony/PersonalPortfolio`). Live: https://personal-portfolio-plum-sigma-60.vercel.app

## Commands

```bash
npm install
npm run dev       # dev server
npm run build     # production build into dist/, also writes robots.txt and sitemap.xml
npm run preview   # serve the production build
npm run lint      # must stay at zero errors
```

There is no test runner. Changes are checked in a real browser (see "Checking changes"). The contact handler in `server/contact.js` is plain Node and can be exercised with a script that passes a fake `send`.

## Stack

- React 19 + Vite 7, JavaScript (`.jsx`). Only the shadcn pieces are TypeScript (`.tsx`).
- Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config`; tokens are in `src/index.css` under `@theme inline`.
- shadcn/ui on Radix (`src/components/ui`), lucide-react icons, react-router-dom 7.
- Lenis for smooth scrolling. Fonts are self-hosted through `@fontsource-variable`.
- One Vercel serverless function, `api/contact.js`, which sends email with the `resend` SDK.
- `@` is an alias for `src/`. `utils/data.js` sits outside `src`, so it is imported by relative path.

## Where content lives

**All text and lists are in `utils/data.js`.** Editing that file is enough for almost every content change.

| Export | Drives |
|---|---|
| `seo` | Page title, description, link preview, canonical URL, robots.txt, sitemap.xml |
| `personalDetails` | Hero name, title, tagline, location, time zone, resume file |
| `about` | About heading, lead line, paragraphs |
| `navbarLinks` | Desktop nav and mobile menu. `to` must be `#<section id>` |
| `contact` | Contact rows. `contact.email` is what the copy button copies and where form messages go. `contact.form` is the form heading, intro and button text |
| `socialLinks` | Footer icons |
| `educations`, `skills`, `experiences`, `projects` | Their sections |

Rules the components rely on:

- The hero "Currently" line uses the first experience whose `years` contains `Present`. The role shown is the part of `title` before `|`.
- Any experience with `Present` in `years` gets the pulsing timeline dot.
- "Live demo" shows only when a project's `demoUrl` is not empty.
- The first project card is full width. With an even number of projects the last one is too.
- The About closing sentence ("feel free to reach out…") is built from the contact links labelled `Mail` and `Phone`.
- Unknown contact labels and social icon names fall back to a generic icon (`src/lib/icons.js`). Add new icons there.
- The resume is `public/Resume-Milan_Sony.pdf`. Replace the file, or change `personalDetails.resume`.

## Structure

```
index.html              Head tags with %SEO_*% placeholders, pre-paint theme/season script
vite.config.js          seoPlugin: fills the placeholders, emits robots.txt + sitemap.xml
vercel.json             Sends every path except /api/* to index.html so the 404 page can render
utils/data.js           All content
utils/contact-validation.js  Form rules shared by the browser and the server
api/contact.js          Vercel function for POST /api/contact (thin wrapper)
server/contact.js       The contact handler: validation, spam limits, Resend call
.env.example            Environment variables the contact form needs
public/                 Resume, favicons, og-image.png, site.webmanifest
src/
  App.jsx               ThemeProvider > SeasonProvider > PreLoader or Router
  index.css             Base tokens, fonts, shared animation classes
  seasons.css           The six seasonal palettes and emblem animations
  router/Router.jsx     "/" and "*" (404)
  pages/                One folder per section, plus Index (page assembly) and PageNotFound
    Contact/ContactForm.jsx  The form under the contact links
  components/
    Navbar.jsx          Floating nav, scroll spy, mobile menu
    Section.jsx         Shared section frame: heading left, content right
    Reveal.jsx          Fade-in on scroll
    SignalLattice.jsx   Hero dot grid (canvas) that reacts to the pointer
    SeasonalAmbience.jsx  Petals, rain, leaves, mist, snow (canvas, behind content)
    ScrollProgress.jsx  Reading progress line
    season-provider.jsx   Picks the season by date, remembers a manual choice
    season-switcher.jsx   Season menu in the nav
    theme-provider.tsx    Picks light or dark by time of day, remembers a manual choice
    theme-toggle.tsx      Theme menu in the nav (despite the name, it is a menu, not a toggle)
  lib/
    seasons.js          Season dates, weather text, emblems, particle settings
    season-context.js   useSeason hook
    smooth-scroll.js    Lenis wrapper: start, pause, resume, scrollToTop
    icons.js            Icon lookups with fallbacks
  assets/seasons/       Hand-drawn SVGs used as emblems and particles
```

Not used by the page, left from the original project: `components/Layout.jsx`, `ui/card.tsx`, `ui/navigation-menu.tsx`, `assets/react.svg`.

## Design system

- **Type:** Unbounded (`font-display`) for headings and the name, Geist (`font-sans`) for everything else.
- **One accent:** `--signal`, used as `text-signal`, `bg-signal`, `border-signal`. `--primary` and `--ring` point at it.
- **Surfaces:** `--background`, `--surface` (cards, popovers), `--surface-2` (muted areas). Use the Tailwind names (`bg-background`, `bg-card`, `text-muted-foreground`) instead of hard-coded colours.
- **Layout:** `max-w-6xl`, side padding `px-5 sm:px-8`. Sections use `<Section id title>`.
- **Breakpoints:** `md` (768px) is where the mobile menu gives way to the desktop nav.
- **Shared classes** in `index.css`: `rise-line`, `fade-in`, `reveal`, `link-draw`, `spot-card`, `live-dot`, `loader-bar`. They take a `--delay` custom property.
- **Tone:** minimal and professional. No emojis in copy, sentence case, no all-caps labels. Keep one accent colour per palette.

## Themes and seasons

Two independent settings, both saved in `localStorage` and applied to `<html>`:

| Setting | Key | Applied as | Default |
|---|---|---|---|
| Theme | `vite-ui-theme` (`dark`, `light`; absent = follow the time of day) | class `dark` or `light` | by time: light 6am to 6pm |
| Season | `portfolio-season` (a season id, absent = follow the calendar) | `data-season` attribute | by date |

The nav has one menu for each: "Follow the time of day", Light, Dark; and "Follow the calendar" plus the six seasons. Choosing a "Follow…" option removes the saved key.

`theme-provider.tsx` still accepts a saved `system` value (follow the device setting) from the original project, but the menu no longer offers it.

Both automatic settings use the visitor's own clock. The theme re-checks every minute and the season every hour, so an open tab catches up by itself. A manual choice wins until the visitor picks the "Follow…" option again.

The daytime hours are set in two places that must agree: `DAY_STARTS` and `DAY_ENDS` in `src/components/theme-provider.tsx`, and the pre-paint script in `index.html`.

Seasons start on the 15th, using the visitor's own date:

| Id | From | Accent | In the air |
|---|---|---|---|
| `spring` | 15 Feb | Blossom pink | Petals |
| `summer` | 15 Apr | Mango gold | Dust on a dry wind |
| `monsoon` | 15 Jun | Rain teal | Heavy rain |
| `autumn` | 15 Aug | Rust orange | Leaves and a light drizzle |
| `prewinter` | 15 Oct | Misty lavender | Mist and dew |
| `winter` | 15 Dec | Ice blue | Snow |

To change or add a season, three places must agree:

1. `src/lib/seasons.js`: the entry in `SEASONS` (id, start date, weather, emblem, `ambience`).
2. `src/seasons.css`: two blocks, `html[data-season="id"]` and `html.dark[data-season="id"]`, each setting the eight seed variables.
3. `index.html`: the inline pre-paint script, which repeats the date logic and the list of valid ids so the right palette shows before React loads.

`--signal` and `--lattice` must be plain colour values, not `color-mix()` or `var()`, because the canvases read them with `getComputedStyle`.

## Contact form

POST `/api/contact` with JSON `{ name, email, message, website, startedAt }`. Replies `{ ok: true }` or `{ ok: false, error, fields? }` with 400 (validation, `fields` holds one message per field), 405, 429 (limits), 502 (Resend failed) or 503 (no API key).

- **One handler, two hosts.** `server/contact.js` exports `handleContact`. `api/contact.js` wraps it for Vercel; `contactApiPlugin` in `vite.config.js` mounts it on `npm run dev` and `npm run preview`, reading `.env` with Vite's `loadEnv`. No Vercel CLI needed locally.
- **Environment:** `RESEND_API_KEY` (required), `CONTACT_TO_EMAIL` (defaults to `contact.email`), `CONTACT_FROM_EMAIL` (defaults to `Portfolio <onboarding@resend.dev>`, which Resend only delivers to the address that owns the account; verify a domain to send from anything else). Set them in `.env` locally and in the Vercel project settings for the live site. Keys never reach the client bundle: only `VITE_`-prefixed variables do.
- **Email:** subject is fixed to "New message from my portfolio" in `server/contact.js`. Body lists name, email and message in text and HTML (escaped). Reply-To is the visitor's address.
- **Validation** lives in `utils/contact-validation.js` and runs in both places: name 1 to 80 characters, a valid email up to 254, message 10 to 2000. Control characters are stripped; line breaks are removed from single-line fields.
- **Spam limits** are in-memory in `server/contact.js`, so on Vercel each warm instance keeps its own counters: 5 messages per address per 10 minutes, 20 seconds between two messages, an identical message within an hour is reported sent but not re-sent. A filled honeypot (`website`) or a submit under 3 seconds after the form appeared gets a quiet `{ ok: true }`.
- **Form states:** errors appear on submit and then update as the visitor types; focus moves to the first invalid field; the button is disabled and a ref blocks double clicks while sending; the status line is a polite live region. Text colour for errors is `--destructive`, a plain hex that passes 4.5:1 on all 12 palettes.
- **Testing without a key** returns 503 with "The contact form isn't set up yet". Mock the route in Playwright to see the success state, or call `handleContact` with a fake `send`.

## Behaviour worth knowing

- **Reduced motion:** with `prefers-reduced-motion: reduce`, Lenis is not started, both canvases stop animating, and all reveal and emblem animations are off. Keep new animation behind the same check.
- **Layering:** the ambience canvas is `fixed z-0`. Page content sits in `relative z-10` wrappers in `Index.jsx`. The nav is `z-50`, the progress line `z-[60]`, the skip link `z-[70]`.
- **Nav highlight:** an IntersectionObserver sets the active link. While a clicked link is scrolling into place the observer is ignored (`jumpTarget` in `Navbar.jsx`), otherwise every link in between flashes.
- **Mobile menu:** locks body scroll and pauses Lenis while open. It closes itself when the window reaches 768px.
- **Season and theme menus:** `modal={false}` on purpose. The modal version removes the scrollbar and shifts the nav sideways. The cost: with a menu open, axe-core reports a moderate best-practice note ("region") because the menu is rendered outside the page landmarks. It is not a WCAG failure.
- **Skip link:** "Skip to content" is the first Tab stop and moves focus to `<main id="content">`.
- **Copy email:** shows "Email copied", or a message telling the visitor to select the address if the browser blocks copying.
- **Saved settings:** invalid values in `localStorage` are ignored, in both the providers and the pre-paint script.
- **Unknown addresses:** `vercel.json` sends every path to the app, which shows the 404 page and returns to the profile after five seconds.
- **Preloader:** shown for about a second, never more than three.
- **Tab title:** flips to upside-down text when the tab loses focus (script in `index.html`).
- **Browser console:** a failed contact submit logs the browser's own "Failed to load resource" line for the 4xx or 5xx response. That is not a script error.

## SEO

`vite.config.js` imports `utils/data.js` and fills the head at build time, including JSON-LD for a `Person` and a `WebSite`. After changing the domain, update `seo.siteUrl` and rebuild.

`public/og-image.png` (1200×630) was rendered once from an HTML template and is a static file. Regenerate it by hand if the name, title or branding changes.

## Favicons

The icon set in `public/` was supplied by the owner (black serif "MS" on white). Keep these exact file names; they are referenced from two places:

| File | Referenced in | Used for |
|---|---|---|
| `favicon.ico` (16, 32, 48) | `index.html`, `site.webmanifest` | Browser tabs, bookmarks, search results |
| `favicon-32x32.png`, `favicon-16x16.png` | `index.html` | Browser tabs |
| `apple-touch-icon.png` (180) | `index.html` | iPhone and iPad home screen |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | `site.webmanifest` | Android home screen and install prompt |

The manifest icons are marked `"purpose": "any"`, not `maskable`: the letters run close to the edges and Android's maskable crop would cut them off.

## Checking changes

Before calling something done:

1. `npm run lint` and `npm run build` pass.
2. Open it in a browser at 320, 390, 768 and 1280 wide. No horizontal scrolling.
3. Try both themes and at least two seasons, using the nav menus.
4. For any new colour pair, text contrast is at least 4.5:1 (3:1 for text 24px and larger) in all 12 season and theme combinations.
5. No console errors.

The last full pass (29 Sep 2026) covered every button and link, all season date boundaries, saved settings, deep links, keyboard order, reduced motion, and an axe-core scan of all 12 combinations. All clean.

The time-of-day theme was added after that pass and tested on its own: seven clock times around 6am and 6pm, manual override, reload, and return to automatic. Not yet tested: the switch happening while a page stays open across 6am or 6pm, real touch devices, and `vercel.json` on a live deploy.

To test a date or time, fix the browser clock before loading the page, for example Playwright's `page.clock.setFixedTime(new Date("2026-06-15T19:00:00"))`. Avoid `page.clock.install`, which freezes the page's timers and hangs the preloader.

When testing with Playwright against `npm run dev`, downloading a file into `.playwright-mcp/` can crash the Vite watcher. Test downloads against `npm run preview` instead.

## Code style

- Four-space indentation in `.jsx`, double quotes, function components with a default export.
- Short comments that say why, in plain words. Match the density of the file being edited.
- `eslint-plugin-react-hooks` v7 is strict: no `setState` directly in an effect body.
- `utils/data.js` uses Windows line endings (CRLF). Scripted multi-line find-and-replace needs to account for that.

## Open items

- **Site address:** `seo.siteUrl` uses the Vercel address from the GitHub repo. The GitHub profile lists `milansony.vercel.app`, which serves a different site. Owner to confirm, or add a custom domain.
- **LinkedIn link** could not be checked automatically (LinkedIn blocks scripted requests).
- **Contact form on Vercel:** `vercel.json` now excludes `/api/` from the SPA rewrite and `RESEND_API_KEY` must be added in the Vercel project settings. Neither has been checked on a live deploy yet.

## Ideas for later

- A Certifications or Blog section: copy a simple section such as `Education.jsx`, add its data to `utils/data.js`, add it to `Index.jsx` and `navbarLinks`. More than about eight nav links will crowd the bar at tablet width.
- Project screenshots or thumbnails in the project cards.
- A setting to turn the seasonal particles off.
- Theme by real sunrise and sunset instead of fixed hours.
- A README.md for the GitHub repository (there is none).
- Remove the unused files listed under "Structure".
