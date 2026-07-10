#!/bin/sh
set -e

if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Generate one with 'php artisan key:generate --show' and set it as an env var." >&2
    exit 1
fi

# Schemas + tables are created idempotently, safe to run on every boot for a demo deployment.
if [ "$RUN_MIGRATIONS" != "false" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

php artisan storage:link || true

echo "Starting server on port ${PORT:-8080}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
