FROM node:20-alpine AS base

# Installa pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 1: Installa le dipendenze
FROM base AS deps
WORKDIR /app

# Copia i file di configurazione per le dipendenze
COPY package.json pnpm-lock.yaml* ./

# Installa solo le dipendenze di produzione
RUN pnpm install --prod --frozen-lockfile

# Stage 2: Build dell'applicazione
FROM base AS builder
WORKDIR /app

# Copia package.json e lockfile
COPY package.json pnpm-lock.yaml* ./

# Installa tutte le dipendenze (incluse devDependencies)
RUN pnpm install --frozen-lockfile

# Copia il codice sorgente
COPY . .

# Build dell'applicazione Next.js
RUN pnpm build

# Stage 3: Runtime production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4444
ENV HOSTNAME=0.0.0.0

# Crea un utente non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia package.json e dipendenze di produzione
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copia i file necessari dal builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs

# Crea la directory data con i permessi corretti
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 4444

CMD ["node_modules/.bin/next", "start", "-p", "4444", "-H", "0.0.0.0"]
