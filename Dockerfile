# syntax=docker/dockerfile:1

# ---- Stage 1: build frontend assets (Vite + React) ----
FROM node:20-bookworm-slim AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY public ./public
COPY vite.config.js tsconfig.json components.json ./

RUN npm run build

# ---- Stage 2: PHP application ----
FROM php:8.3-cli-bookworm AS app

WORKDIR /var/www/html

# System dependencies + PHP extensions needed by this app
# (pdo_pgsql: postgres, zip/gd/bcmath/intl: dompdf/excel/qrcode packages installed in composer.json)
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libpng-dev \
        libonig-dev \
        libicu-dev \
        unzip \
        git \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        zip \
        gd \
        bcmath \
        intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader --no-progress

# Copy application source
COPY . .

# Bring in the frontend build output from stage 1
COPY --from=frontend /app/public/build ./public/build

RUN composer dump-autoload --optimize \
    && mkdir -p storage/framework/{sessions,views,cache/data} storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["entrypoint.sh"]
