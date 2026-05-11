# #build stage
# FROM node:22 As builder

# WORKDIR /app

# COPY package*.json ./
# COPY pnpm-lock.yaml ./

# RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
# RUN pnpm install --frozen-lockfile

# COPY . .
# RUN pnpm exec prisma generate

# RUN pnpm run build

# #production stage
# FROM node:22

# WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/package*.json ./

# EXPOSE 5050

# CMD ["node", "dist/server.js"]
# Build stage
FROM node:22 AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate
RUN pnpm run build

# Production stage
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 5050

CMD ["node", "dist/server.js"]