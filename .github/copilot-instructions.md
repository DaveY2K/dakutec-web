Project: dakutec-web (cadcam-site)

Keep guidance short and code-focused so an AI coder can be immediately productive.

- Big picture: This is a Next.js 15 App Router site (server-first) using TypeScript + Tailwind.
  - Key folders: `src/app` (App Router pages & layouts), `src/components` (UI), `src/i18n` (localization), `public` (static assets).
  - Routing: localized routes live under `src/app/[locale]/*`. Server routes use `route.ts` files under `src/app/api/*` (e.g. `src/app/api/rfq/route.ts`).

- Important architectural notes:
  - App Router is used heavily: many components are server components by default. `app/layout.tsx` demonstrates server-side APIs like `await cookies()`.
  - Localization: `src/i18n/config.ts` defines `locales = ['cs','en','de']` and `defaultLocale='en'`. Locale layouts set `dynamic = "force-static"` and implement `generateStaticParams()`.
  - Security/headers: CSP and other headers are generated in `src/next.config.ts`. Configuration is extended via env vars (e.g. `NEXT_PUBLIC_CSP_SCRIPT`, `NEXT_PUBLIC_CSP_IMG`, etc.).
  - Env helpers: `src/lib/env.ts` exposes `SITE_URL`, `PROD_HOSTS`, `IS_PROD`. Use these for behavior toggles and checks.

- Developer workflows & commands (copy-paste):
  - Dev server: `npm run dev` (uses `next dev --turbopack`).
  - Build: `npm run build` (uses `next build --turbopack`).
  - Start production: `npm run start`.
  - Lint: `npm run lint` (runs `eslint`).
  - Type-check: `npm run typecheck` (`tsc -p tsconfig.json --noEmit`).
  - Content validation: `node scripts/validate-content.ts` (run via `tsx` or `ts-node` if available). This script imports `src/i18n/dictionaries/*.json` and checks slugs and that referenced images exist in `public/`.

- Project-specific conventions & patterns:
  - Slug format: service slugs must match `/^[a-z0-9-]+$/` — enforced by `scripts/validate-content.ts`.
  - Images referenced in i18n dictionaries are expected in `public/` (paths may start with `/`). `validate-content` checks those files exist.
  - Keep locale dictionaries small and self-contained: `src/i18n/dictionaries/{cs,de,en}.json`.
  - Prefer server components for layout/root logic (see `src/app/layout.tsx` and `src/app/[locale]/layout.tsx`). Use client components only when interactivity/state is required (e.g. cookie banner, menus).
  - Static rendering: locale segment uses `dynamic = "force-static"` and `dynamicParams = false` — treat those pages as static when adding features.

- Integration & deployments:
  - `netlify.toml` exists (example) — site can be deployed to Netlify; the file expects `.next` as `publish` and Netlify Functions under `netlify/functions`.
  - README references Vercel; verify target host and environment variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PROD_HOSTS`) before pushing to production.

- When editing code, pay attention to:
  - CSP changes: update `src/next.config.ts` and prefer env-based extensions (`NEXT_PUBLIC_CSP_*`).
  - i18n additions: update `src/i18n/config.ts` (locales) and add new dictionary JSON plus static params in `[locale]/layout.tsx` if necessary.
  - API routes: use `route.ts` server handlers under `src/app/api` for endpoints that need to run on the server.

- Helpful examples (copy these in PRs or commits):
  - Add a new locale `xx`: add `xx` to `src/i18n/config.ts`, create `src/i18n/dictionaries/xx.json`, update `generateStaticParams()` in `src/app/[locale]/layout.tsx` (it maps from `locales`).
  - Add an image referenced by a work item in `en.json`: put `public/images/...`, reference `/images/...` in the dictionary, then run `node scripts/validate-content.ts`.

- Things not required / not present:
  - There is no test harness in this repo; do not add heavy test infra without owner sign-off.

If anything here is unclear or you want more detail about a specific area (deployment target, env vars, or route examples), tell me which section to expand.
