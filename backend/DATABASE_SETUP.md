# Установка PostgreSQL для Borovy

## Для Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

## Для CentOS/RHEL:
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

## Создание базы данных и пользователя:
sudo -u postgres psql

-- В консоли PostgreSQL выполните:
CREATE DATABASE borovy;
CREATE USER borovy_user WITH PASSWORD 'borovy_password';
GRANT ALL PRIVILEGES ON DATABASE borovy TO borovy_user;
\q

## Настройка подключения:
echo "DB_HOST=localhost" >> .env
echo "DB_PORT=5432" >> .env  
echo "DB_NAME=borovy" >> .env
echo "DB_USER=borovy_user" >> .env
echo "DB_PASSWORD=borovy_password" >> .env
