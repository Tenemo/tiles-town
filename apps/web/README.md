# Tiles Town web app

Frontend package for the `tiles-town` puzzle game.

## Local development

Use the repository root for the default local workflow:

```bash
pnpm install
pnpm run dev
```

That starts the backend in Docker on `http://127.0.0.1:4200` and the Vite dev
server on `http://127.0.0.1:3200`.

If you only want to run the frontend:

```bash
pnpm --filter @tiles-town/web run dev
```

In local development it uses `/api`, and the Vite dev server proxies those
requests to `http://127.0.0.1:4200`.

## Verification

Run the shared checks from the repository root:

```bash
pnpm run tsc
pnpm run eslint
pnpm run stylelint
pnpm run test
pnpm run build
pnpm run e2e
```
