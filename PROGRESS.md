# Progress

> Current task tracking — cleared after each completed feature.
> Updated: 2026-07-12

## Current Task: CI/CD Pipeline

### Done
- Installed ESLint + Next.js ESLint config (`eslint`, `@next/eslint-plugin-next`, `eslint-config-next`, `typescript-eslint`)
- Added `lint` (`next lint --max-warnings 0`) and `typecheck` (`tsc --noEmit`) scripts to `package.json`
- Created `eslint.config.mjs` — Next.js 15 flat config with TypeScript rules
- Created `.github/workflows/ci.yml` — 3 parallel jobs (typecheck, lint, build) on push/PR to `main`
- Updated `AGENTS.md` — Commands table, CI/CD line

### Verification
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm run build` passes
