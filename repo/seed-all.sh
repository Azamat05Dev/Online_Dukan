#!/bin/bash
# Master seed script - runs all database seeds
# Usage: ./seed-all.sh

echo "🌱 Starting database seeding..."
echo ""

# Check if Docker containers are running
if ! docker compose ps | grep -q "running"; then
    echo "❌ Docker containers are not running!"
    echo "   Please run: docker-compose up -d"
    exit 1
fi

echo "📦 Seeding Product Service (MySQL)..."
docker compose exec product-service python seed.py
echo ""

echo "👥 Seeding User Service (PostgreSQL)..."
docker compose exec user-service npm run seed
echo ""

echo "🎉 All databases seeded successfully!"
echo ""
echo "📝 Test Credentials:"
echo "   Admin: admin@ecommerce.uz / admin123"
echo "   User:  user@example.com / user123"
echo "   Test:  test@test.com / test123"
