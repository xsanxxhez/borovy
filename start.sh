#!/bin/bash

# Скрипт для запуска Borovy проекта
echo "🚀 Starting Borovy Application..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для убийства процессов на порту
kill_port() {
    local port=$1
    echo -e "${YELLOW}🔫 Killing processes on port $port...${NC}"

    # Находим PID процессов на порту
    local pids=$(lsof -ti:$port)

    if [ -n "$pids" ]; then
        echo -e "${BLUE}🎯 Found processes: $pids${NC}"
        kill -9 $pids
        echo -e "${GREEN}✅ Successfully killed processes on port $port${NC}"
    else
        echo -e "${BLUE}📭 No processes found on port $port${NC}"
    fi
}

# Функция для проверки доступности порта
wait_for_port() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}⏳ Waiting for $service to start on port $port...${NC}"

    while [ $attempt -le $max_attempts ]; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${GREEN}✅ $service is running on port $port${NC}"
            return 0
        fi
        echo -e "${BLUE}📡 Attempt $attempt/$max_attempts: $service not ready yet...${NC}"
        sleep 2
        ((attempt++))
    done

    echo -e "${RED}❌ $service failed to start on port $port${NC}"
    return 1
}

# Основной скрипт
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}         BOROVY STARTUP SCRIPT          ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Убиваем процессы на портах
kill_port 3000  # Frontend
kill_port 3001  # Backend
kill_port 5432  # PostgreSQL (опционально)

# Ждем немного чтобы процессы полностью завершились
sleep 2

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}           STARTING BACKEND             ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Запускаем бэкенд
cd backend
echo -e "${YELLOW}📁 Starting backend in $(pwd)${NC}"

# Проверяем установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Запускаем бэкенд в фоне
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"

# Ждем пока бэкенд запустится
cd ..
if wait_for_port 3001 "Backend"; then
    echo -e "${GREEN}🎉 Backend is ready!${NC}"
else
    echo -e "${RED}💥 Backend failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}          STARTING FRONTEND             ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Запускаем фронтенд
cd frontend
echo -e "${YELLOW}📁 Starting frontend in $(pwd)${NC}"

# Проверяем установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Запускаем фронтенд в фоне
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"

# Ждем пока фронтенд запустится
if wait_for_port 3000 "Frontend"; then
    echo -e "${GREEN}🎉 Frontend is ready!${NC}"
else
    echo -e "${RED}💥 Frontend failed to start${NC}"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}           🎉 ALL SYSTEMS GO! 🎉         ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✅ Backend:  http://localhost:3001${NC}"
echo -e "${GREEN}✅ Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Функция для graceful shutdown
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}👋 Services stopped. Goodbye!${NC}"
    exit 0
}

# Перехватываем сигнал Ctrl+C
trap cleanup INT

# Ждем пока пользователь нажмет Ctrl+C
wait