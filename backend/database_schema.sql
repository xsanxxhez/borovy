-- Удаляем существующие таблицы если есть
DROP TABLE IF EXISTS borov_vakhta_history CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS vakhtas CASCADE;
DROP TABLE IF EXISTS borovs CASCADE;
DROP TABLE IF EXISTS slons CASCADE;
DROP TABLE IF EXISTS promocodes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'borov',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица слонов
CREATE TABLE slons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Табора промокодов
CREATE TABLE promocodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    slon_id INTEGER REFERENCES slons(id),
    used_by_borov_id INTEGER,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    used_at TIMESTAMP
);

-- Таблица боровов
CREATE TABLE borovs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    slon_id INTEGER REFERENCES slons(id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    promo_code_id INTEGER REFERENCES promocodes(id),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица вахт
CREATE TABLE vakhtas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    total_places INTEGER DEFAULT 0,
    created_by_slon_id INTEGER REFERENCES slons(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица специальностей
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    vakhta_id INTEGER REFERENCES vakhtas(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary DECIMAL(10,2),
    total_places INTEGER DEFAULT 1,
    current_workers INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица истории работы боровов
CREATE TABLE borov_vakhta_history (
    id SERIAL PRIMARY KEY,
    borov_id INTEGER REFERENCES borovs(id),
    vakhta_id INTEGER REFERENCES vakhtas(id),
    specialty_id INTEGER REFERENCES specialties(id),
    status VARCHAR(20) DEFAULT 'active',
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для ускорения запросов
CREATE INDEX idx_borovs_user_id ON borovs(user_id);
CREATE INDEX idx_borovs_slon_id ON borovs(slon_id);
CREATE INDEX idx_vakhtas_dates ON vakhtas(start_date, end_date);
CREATE INDEX idx_specialties_vakhta_id ON specialties(vakhta_id);
CREATE INDEX idx_borov_history ON borov_vakhta_history(borov_id, vakhta_id);

-- Вставляем тестовые данные
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', '$2b$10$examplehash', 'admin@borovy.ru', 'admin'),
('slon1', '$2b$10$examplehash', 'slon1@borovy.ru', 'slon'),
('borov1', '$2b$10$examplehash', 'borov1@borovy.ru', 'borov');

INSERT INTO slons (user_id, name, contact_info) VALUES
(2, 'Иван Слоноров', 'ivan@example.com');

INSERT INTO borovs (user_id, slon_id, name, phone) VALUES
(3, 1, 'Петр Боровов', '+79991234567');