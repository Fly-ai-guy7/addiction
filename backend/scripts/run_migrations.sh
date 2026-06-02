#!/bin/bash
set -e

# Run alembic migrations
echo "Running alembic migrations..."
cd /app
alembic upgrade head
echo "Migrations complete!"
