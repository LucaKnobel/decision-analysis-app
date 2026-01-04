
# Build stage

FROM node:24-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y \
&& apt-get install -y --no-install-recommends openssl \
&& rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate Prisma Client for Docker environment
RUN npx prisma generate

RUN npm run build


# Runtime stage

FROM node:24-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV PORT=3000

RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
