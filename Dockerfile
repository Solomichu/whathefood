# Base image
FROM node:18-buster AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Instalar dependencias necesarias para bcrypt y prisma
RUN apt-get update && apt-get install -y \
    libc6 \
    libssl-dev \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY . .

# Generar Prisma Client
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libc6 \
    && rm -rf /var/lib/apt/lists/*
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar dependencias necesarias para producción
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Instalar dependencias de producción (incluyendo bcrypt)
RUN npm ci --only=production

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]