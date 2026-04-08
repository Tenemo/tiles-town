# Tiles Town

[![Netlify Status](https://api.netlify.com/api/v1/badges/e376a228-9575-47c8-bafa-1493adaee126/deploy-status)](https://app.netlify.com/sites/tiles-town/deploys)

[tiles.town](https://tiles.town)

https://github.com/user-attachments/assets/1f16c318-b9dd-48d1-8d5a-c5e3693cc033

Puzzle game with a global scoreboard requiring you to flip all tiles to the
same side. Built ages ago in jQuery as a toy project to learn JavaScript
better, then rewritten in 2016-ish to learn React + Redux, more recently
rewritten to TypeScript and now maintained as a pnpm + Turbo monorepo.

## Workspace layout

- `apps/web` contains the React frontend.
- `apps/api` contains the Express API.
- `packages/game-core` contains shared board mechanics and coordinate helpers.
- `packages/contracts` contains shared runtime schemas, route constants, and
  TypeScript types.
- `packages/testkit` contains shared board-solving helpers for integration and
  end-to-end tests.
- `tests/e2e` contains Playwright end-to-end coverage.

## Repository docs

- [apps/api/README.md](./apps/api/README.md) for API workspace usage and runtime
  configuration
- [apps/web/README.md](./apps/web/README.md) for frontend workspace usage
- [docs/endpoints.md](./docs/endpoints.md) for route behavior and payload
  expectations
- [docs/operations.md](./docs/operations.md) for local reset, verification, and
  CI workflows

## Development

Use Node `24.14.1` and `pnpm@10.33.0`.

```bash
pnpm install
pnpm run dev
```

That starts:

- Postgres on `127.0.0.1:5434`
- API on `127.0.0.1:4200`
- Web app on `127.0.0.1:3200`

The default local flow runs Postgres and the API through Docker Compose and
serves the frontend directly through Vite.

Useful commands:

```bash
pnpm run build
pnpm run clean
pnpm run local:reset
pnpm run docker:up
pnpm run docker:destroy
pnpm run docker:refresh
pnpm run dev:web
pnpm run dev:api
```

If you want to run the host-based API fallback, copy `.env.example` or
`apps/api/.env.sample` to a local `.env` file first.

Sentry stays disabled in local development and end-to-end runs. Only enable
`SENTRY_ENABLED=true` and `VITE_SENTRY_ENABLED=true` outside local development
and automated tests.

## Verification

Run the shared checks from the repository root:

```bash
pnpm run build
pnpm run tsc
pnpm run eslint
pnpm run stylelint
pnpm run test
pnpm run build
pnpm run e2e
```

The API integration tests expect Postgres to be available on `127.0.0.1:5434`.
The default `pnpm run dev` and `pnpm run docker:up` flows already provide that.
The browser tests also fail on unexpected console errors, page errors, and
failing `/api` responses.
