# Base image with pnpm
FROM node:22.16.0-alpine3.22 AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS production-deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS build

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN pnpm build

FROM base

ENV NODE_ENV=production
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY ./bin ./bin

EXPOSE 3333
CMD ["node", "./bin/server.js"]
