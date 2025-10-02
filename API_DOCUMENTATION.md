# Borovy API Documentation

## Base URL
http://localhost:3000/api

## Authentication

### Login
POST /auth/login
Body: { "username": "admin", "password": "admin123" }

### Get Profile
GET /auth/profile
Headers: { "Authorization": "Bearer <token>" }

## Admin Routes

### Get All Slons
GET /admin/slons

### Create Slon
POST /admin/slons
Body: { "username": "slon2", "display_name": "New Slon", ... }

### Get Statistics
GET /admin/stats

## Slon Routes

### Get My Promo Codes
GET /slon/promocodes

### Create Promo Code
POST /slon/promocodes
Body: { "code": "NEW_CODE", "description": "For new campaign" }

## Borov Routes

### Register
POST /borov/register
Body: { "email": "borov@test.ru", "phone": "+79990000000", ... }

### Get Available Vakhtas
GET /borov/vakhtas/available

### Join Vakhta
POST /borov/vakhtas/join
Body: { "vakhta_id": 1 }

## Public Routes

### Get All Vakhtas
GET /vakhta

### Get Single Vakhta
GET /vakhta/1
