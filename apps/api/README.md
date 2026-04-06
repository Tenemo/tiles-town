## tiles.town backend

Backend for [tiles.town](https://tiles.town).

## Workspace usage

Run the monorepo from the repository root:

```bash
pnpm install
pnpm run docker:refresh
pnpm --filter @tiles-town/api run dev
```

If Docker is already running and you only need the schema ready again:

```bash
pnpm --filter @tiles-town/api run db:migrate
```

## App commands

From the repository root:

```bash
pnpm --filter @tiles-town/api run lint
pnpm --filter @tiles-town/api run typecheck
pnpm --filter @tiles-town/api run test
pnpm --filter @tiles-town/api run build
pnpm --filter @tiles-town/api run db:migrate
```

## Runtime configuration

The API configuration is centralized in `src/config.ts`.

- `DATABASE_URL` should point to PostgreSQL and defaults through `.env.example`
- `DATABASE_SSL` defaults to `true` and should be set to `false` locally
- `CORS_ALLOWED_ORIGINS` accepts a comma-separated allowlist for non-local
  frontend origins
- `PORT` defaults to `4200`
- `SENTRY_ENABLED` should stay disabled locally and only be enabled for preview
  or production deploys

`GET /api/health-check` returns plain text `OK`.
See [docs/endpoints.md](../../docs/endpoints.md) for the route contract and
[docs/operations.md](../../docs/operations.md) for the repository-level
workflow.

## Test layout

- `test/integration/game.test.ts` covers route behavior against the real app and
  database
- `test/support/api.ts` contains shared route helpers for those integration
  tests

The local Docker Postgres instance is exposed on `127.0.0.1:5434`.
