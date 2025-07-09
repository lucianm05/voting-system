FROM node:22.15-alpine3.20 AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.x --activate
RUN apk add bash

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .

RUN pnpm build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

EXPOSE 3333

CMD ["node", "./bin/server.js"]