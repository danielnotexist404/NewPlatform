# DECISIONS

Decisions taken while building, in the format of Part 00 §6.3 (Hebrew or English).

## 2026-10-17 · Brand defaults
- **Decision:** the owner variables were not filled, so `lib/constants.ts` uses the defaults קדימון · Kdimon · kdimon.co.il. Legal and contact variables stay `{{…}}` and are hidden in the UI by `isFilled()` until filled.
- **Effect:** `pnpm check-content --launch` (to be added) must fail while any `{{…}}` remains.

## 2026-10-17 · shadcn registry not reachable from the build environment
- **Decision:** `ui.shadcn.com` is blocked by the environment's network policy, so `shadcn create/add` cannot run. UI primitives in `components/ui/` were written by hand in the shadcn pattern on top of the `radix-ui` package from npm, with logical (RTL) classes only, following Part 01 §8.3–§8.4.
- **Alternatives:** wait for network access; vendor shadcn files manually.
- **Effect:** when the registry is reachable, `components.json` can be added and primitives re-synced; names and variants stay the same.

## 2026-10-17 · Build order: site first, infrastructure later (founder request)
- **Decision:** the founder asked to build the visible site first. The marketing site and the app UI are built on the seed files (`/seed`) and typed mock data (`lib/mock/*`), behind the same component and route names as the prompt. Supabase, OpenRouter, Meta, Grow and Morning are connected later behind the provider interfaces of Parts 04–07.
- **Effect:** M1 (data layer) runs after the UI pass; mock modules are replaced by data-access functions with the same return types.

## 2026-10-17 · UI copy location during the UI pass
- **Decision:** to let parallel builders work without merge conflicts, page copy lives in typed modules (`content/he/*.ts`) per area instead of a single `messages/he.json`. The structure mirrors the `messages/he.json` namespaces of Parts 01–03 so it can be moved with a script.
- **Effect:** the move to next-intl + `messages/he.json` is a hardening task before launch.
