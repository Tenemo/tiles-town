FROM node:24.14.1-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@10.33.0

WORKDIR /workspace

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/testkit/package.json packages/testkit/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages/contracts packages/contracts

RUN pnpm --filter @tiles-town/contracts run build
RUN pnpm --filter @tiles-town/api run build

EXPOSE 4200

CMD ["sh", "-c", "pnpm --filter @tiles-town/api run db:migrate:dist && pnpm --filter @tiles-town/api run start"]
