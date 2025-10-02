#!/bin/bash

# Script to kill processes running on port 3000

PORT=3001

echo "🔫 Looking for processes on port $PORT..."

# Find PIDs of processes using port 3000
PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
    echo "✅ No processes found on port $PORT"
else
    echo "🎯 Found processes: $PIDS"
    echo "💀 Killing processes..."
    kill -9 $PIDS
    echo "✅ Successfully killed processes on port $PORT"
fi
