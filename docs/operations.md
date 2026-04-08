# Operations guide

## Local reset

Use the repository root commands:

```bash
pnpm install
pnpm run local:reset
pnpm run dev
```

`pnpm run local:reset` recreates the Docker services, waits for PostgreSQL to
become healthy, and rebuilds the API container.

## Verification

Run the shared checks from the repository root:

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm run tsc
pnpm run eslint
pnpm run stylelint
pnpm run test
pnpm run build
pnpm run e2e
```

The backend tests expect PostgreSQL on `127.0.0.1:5434`.
The browser tests also fail on unexpected console errors, page errors, and
failing `/api` responses, so a green end-to-end run now covers more than just
DOM assertions.

## CI

`.github/workflows/ci.yml` runs the full repository verification surface on
every pull request, push to `master`, and merge queue event:

- `pnpm run lint`
- `pnpm run tsc`
- `pnpm --filter @tiles-town/api test`
- `pnpm --filter @tiles-town/web test`
- `pnpm run build`
- a built API container smoke check on `/api/health-check`
- `pnpm run e2e`
