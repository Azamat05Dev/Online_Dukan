-- Initialize PostgreSQL databases and users
-- This script runs when the container is first created

-- Create ecommerce database if not exists
SELECT 'CREATE DATABASE ecommerce'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO admin;
