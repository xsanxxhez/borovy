#!/bin/bash

# Script to setup PostgreSQL database for Borovy

echo "🗄️ Setting up Borovy database..."

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "💡 On macOS: brew services start postgresql"
    echo "💡 On Ubuntu: sudo service postgresql start"
    exit 1
fi

# Check if we can connect as postgres user
if ! psql -U postgres -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Cannot connect to PostgreSQL as 'postgres' user"
    echo "💡 You might need to run: sudo -u postgres psql"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database and user
echo "🔧 Creating database and user..."

psql -U postgres << EOSQL
-- Create database
CREATE DATABASE borovy;

-- Create user
CREATE USER borovy_user WITH PASSWORD 'borovy_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE borovy TO borovy_user;

-- Connect to database and grant schema privileges
\c borovy;
GRANT ALL ON SCHEMA public TO borovy_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO borovy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO borovy_user;

-- Make user superuser for development (remove in production)
ALTER USER borovy_user WITH SUPERUSER;
EOSQL

if [ $? -eq 0 ]; then
    echo "✅ Database 'borovy' and user 'borovy_user' created successfully!"
    echo "📊 Database connection details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: borovy"
    echo "   User: borovy_user"
    echo "   Password: borovy_password"
else
    echo "❌ Failed to create database and user"
    exit 1
fi
