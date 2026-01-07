#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # Exit on error

echo "========================================="
echo "TeamLoom Backend - Render Deployment"
echo "========================================="

echo ""
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "🗂️  Collecting static files..."
python manage.py collectstatic --no-input --clear

echo ""
echo "🗄️  Running database migrations..."
python manage.py migrate --no-input

echo ""
echo "🌱 Seeding skills data..."
# Check if skills already exist to avoid duplicates
python manage.py seed_skills || echo "⚠️  Skills seeding skipped (may already exist)"

echo ""
echo "✅ Build completed successfully!"
echo "========================================="
echo "Next steps:"
echo "1. Verify health check: /api/health/"
echo "2. Create superuser: python manage.py createsuperuser"
echo "3. Update CORS_ALLOWED_ORIGINS with frontend URL"
echo "========================================="
