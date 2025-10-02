#!/bin/bash

# Script to restart the backend server

echo "🔄 Restarting Borovy backend..."

# Change to backend directory
cd "$(dirname "$0")/../backend"

# Kill processes on port 3000
echo "🔫 Killing existing processes on port 3000..."
PIDS=$(lsof -ti:3000)
if [ -n "$PIDS" ]; then
    kill -9 $PIDS
    sleep 2
fi

# Check if processes are still running
STILL_RUNNING=$(lsof -ti:3000)
if [ -n "$STILL_RUNNING" ]; then
    echo "❌ Failed to kill processes. Trying force kill..."
    kill -9 $(lsof -ti:3000) 2>/dev/null
    sleep 1
fi

# Start the server
echo "🚀 Starting backend server..."
npm run dev
