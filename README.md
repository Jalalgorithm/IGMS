# IGMS — frontend

Public landing site for **Integrated Global Menospace Solutions CIC**, with a
programme waitlist. Vite + React 19 + TypeScript (strict) + Tailwind CSS v4.

No backend. The waitlist submits through a mock service that behaves like the
real endpoint will.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview
npm run typecheck
```

Copy `.env.example` to `.env` and set `VITE_DONATE_URL` to the live Stripe
Payment Link before going anywhere near production. This is the preferred
donation setup for this static site: checkout happens on Stripe and no card
details or Stripe secret key pass through the frontend. A Stripe publishable
key is safe to expose, but is not needed for a Payment Link and must never be
used in place of a server-side secret key for custom Checkout or PaymentIntents.

---

## Structure

```
src/
├── assets/            images, brand marks, global styles
├── components/
│   ├── ui/            Button, Card, Field, Checkbox, Toggle,
│   │                  SegmentedControl, StatusChip, Tag
│   └── shared/        ErrorBoundary, Loading, Reveal, SectionHeading,
│                      Swoosh, PlaceholderBlock, SkipLink
├── features/
│   ├── landing/       every section of the page + navigation data
│   ├── waitlist/      form, programme catalogue, mock service, queries
│   ├── legal/         Termageddon policy pages + Usercentrics consent
│   └── accessibility/ the floating reader-controls widget
├── hooks/             useLocalStorage, useMediaQuery, useFocusTrap,
│                      useOnClickOutside, useScrollReveal
├── lib/               apiClient (axios + interceptors), queryClient
├── providers/         AppProviders → ErrorBoundary → Query → Accessibility
├── routes/            route definitions, NotFound
├── stores/            Zustand: accessibility prefs, waitlist UI state
├── types/             global declarations, shared API types
└── utils/             classNames, formatDate, scrollToSection, validation
```

Conventions held throughout:

- **Named exports only.** No default exports anywhere in `src`.
- **Every screen belongs to a feature.** There is no `pages/` folder.
- Each feature owns its `components/`, `types/`, and (where it has them)
  `hooks/` and `services/`, and exposes only what the outside needs through
  its `index.ts`.
- **Server state → TanStack Query**, inside the feature's `services/`.
  **Client state → Zustand**, in `stores/`.
- `strict`, `noUnusedLocals`, `noUnusedParameters` are all on.

### On Tailwind v4 and `tailwind.config.js`

There isn't one, and that is deliberate — v4 moved configuration into CSS.
The design tokens live in the `@theme` block at the top of
`src/assets/styles/index.css`, and content detection is automatic, so a
`tailwind.config.js` would be an empty file that reads as though it were
doing something. `postcss.config.js` is absent for the same reason: the
`@tailwindcss/vite` plugin replaces the PostCSS pipeline.

---

## The waitlist

`src/features/waitlist/`. Eight programmes, grouped as Wellbeing / STEM /
LaunchPad101 / Resources — exactly the programmes the page describes
elsewhere, nothing invented. A visitor picks any number of them.

Collected: name, email, optional phone, how they are joining
(participant / parent or carer / referrer / partner organisation / other),
an optional free-text access-requirements field, and explicit consent.

**Swapping in a real backend.** Set `VITE_USE_MOCK_API=false` and point
`VITE_API_URL` at the API. `submitWaitlistEntry` in
`services/waitlistApi.ts` then issues `POST /waitlist` through the shared
axios client instead of the mock. Nothing else changes: the mock already
rejects with the same `ApiErrorShape` that the axios interceptor produces,
including per-field errors, so the form's error handling is already
exercising the real contract.

The mock persists to `localStorage`, rejects duplicate email addresses with a
409-shaped field error, and treats any address beginning `fail@` as a server
error — useful for checking the error path without breaking anything.

---

## Accessibility

The widget in the bottom-right corner is a first-class feature, not a bolt-on:

- **Text size** — Normal / Large / X-Large, scaling the root font size. Every
  size on the page is in `rem`, so the whole layout grows rather than just
  the body copy.
- **High contrast** — swaps the token values for a stronger palette, drops
  the photographic grade, and replaces soft shadows with hard borders.
- **Reduce motion** — disables the reveals and smooth scrolling. The OS-level
  `prefers-reduced-motion` setting is honoured independently, always.
- **Read this screen aloud** — Web Speech API, chunked so a long page reads
  end to end. The widget marks itself `data-read-aloud="skip"` so it never
  reads its own controls.

Preferences persist across visits. They are applied as `data-*` attributes on
`<html>` by `AccessibilityProvider`; every visual consequence lives in CSS.

Also throughout: a skip link as the first tab stop, visible focus rings on
everything interactive, anchor navigation that moves focus rather than just
the viewport, real radios and `role="switch"` buttons instead of styled divs,
a focus trap in the panel, and alt text on every image that describes what is
actually in the frame.

### Colour rules

Enforced in `index.css`, and worth not breaking:

| Token | Use |
| --- | --- |
| Marigold `#F5A623` | Accent only. **Never** text on a light ground (1.9:1), never with white (2.1:1). Charcoal on marigold is correct (8.2:1). |
| Terracotta `#C84B1E` | Headlines, large text, solid button fills with ivory text (4.9:1). Not for small body copy. |
| Charcoal `#231F1B` | All body copy. Also the right text colour on a marigold surface. |
| Ivory `#FAF7F2` | Primary background. |

Large-area section grounds use an 8–12% tint, never full saturation.

---

## Brand assets

`src/assets/brand/` holds the supplied logo with its background knocked out
(`igms-logo.png`) and the figure mark alone (`igms-mark.png`). Favicons in
`public/` are generated from the mark — the wordmark is unreadable at 32px.

The header and footer pair the mark with the organisation name as real text
rather than using the full lockup: the supplied wordmark is marigold, which
fails contrast on ivory, and its strapline is illegible at header size.

## Photography

Sourced from Pexels (free to use, no attribution required). One grade —
`sepia(0.28) saturate(1.25)` — is applied to every photo so the set reads as
a single commissioned shoot; the hero uses a slightly lighter variant under
its gradient. High contrast mode removes the grade entirely.

---

## Legal pages and cookie consent

Four Termageddon policies are served at real URLs, because people link to and
bookmark them: `/privacy-policy`, `/terms-of-service`, `/disclaimer`,
`/cookie-policy`. Each is a React Router route rendering `PolicyEmbed`, which
appends Termageddon's script and lets it fill a div keyed by the policy id.

`PolicyEmbed` watches for the policy actually arriving and falls back to a
direct Termageddon link if it does not within 8 seconds — otherwise a visitor
whose ad blocker eats the script is left reading "Please wait" forever.

**These routes have no files behind them.** A direct hit or a refresh on
`/disclaimer` must be rewritten to `index.html` or it 404s. Configs for the
common hosts are included: `public/_redirects` (Netlify, Cloudflare Pages),
`vercel.json`, `public/staticwebapp.config.json` (Azure). On nginx or Apache
you will need the equivalent `try_files` / rewrite rule.

The **Usercentrics** consent manager loads from `index.html`. `uc-block` is
loaded synchronously and ahead of the CMP on purpose: it is what holds
third-party tags until a choice is made, and deferring it defeats it.

The footer's **Privacy Settings** control is a real `<button>` calling
`UC_UI.showSecondLayer()`, not the `javascript:` href Usercentrics documents —
that URL scheme is the first thing a Content-Security-Policy blocks. It renders
only once the CMP has actually loaded, so it is never a dead click.

---

## What is still a placeholder

Marked on the page with the shared `StatusChip`, so nothing reads as broken:

- The Lift Project logo
- Testimonial quotes
- Impact figures in the About collage
- Resources & Guidebooks library (the waitlist collects interest meanwhile)
- The Donate link, until the Stripe Payment Link URL is set

## Documents and embeds

`public/documents/` holds the two Lift Project PDFs, served as static files so
their URLs stay stable and `download` works. They are referenced by
`DownloadLink`, which states the file type and size up front.

The STEM Sports video is a Canva embed. The link originally supplied resolved
to a Canva **`/edit`** URL, which would have given every visitor edit rights on
the source design — the site uses the view-only `/watch?embed` form of the same
design instead.

The iframe carries `data-usercentrics="Canva"`. For the consent manager to
actually gate and then release it, **Canva has to exist as a service in the
Usercentrics configuration**; if it is not there, the frame simply loads
normally.
