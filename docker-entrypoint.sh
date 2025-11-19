#!/bin/sh
set -e

echo "🔄 Waiting for MySQL to be ready..."

# Extract connection details from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@\([^:]*\):.*|\1|')
DB_PORT=$(echo $DATABASE_URL | sed -e 's|.*:\([0-9]*\)/.*|\1|')

# Wait for MySQL port to be available
until nc -z $DB_HOST $DB_PORT 2>/dev/null; do
  echo "⏳ MySQL is unavailable - sleeping"
  sleep 2
done

echo "✅ MySQL is ready!"

# Additional wait to ensure MySQL is fully initialized
sleep 3

echo "🔄 Running database migrations..."
node_modules/.bin/drizzle-kit push || {
  echo "❌ Migration failed!"
  exit 1
}

echo "✅ Migrations completed successfully!"
echo "🚀 Starting application..."

# Start the Next.js application
exec node server.js
