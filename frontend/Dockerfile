# ---------- BUILD ----------
FROM node:20-bullseye-slim AS build
ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1 \
    NUXT_DEVTOOLS=0 \
    NITRO_PRESET=node-server
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN rm -rf .nuxt .output node_modules/.cache && pnpm build

# ---------- RUNTIME ----------
FROM node:20-bullseye-slim AS runtime
ENV NODE_ENV=production \
    NITRO_PORT=3000 \
    NITRO_HOST=0.0.0.0 \
    NUXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=512
WORKDIR /app

# įdiek **production** deps, kad būtų 'vue' ir kt.
#COPY package.json pnpm-lock.yaml ./
#RUN corepack enable && pnpm install --frozen-lockfile --prod

# dabar sukraunam .output
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]