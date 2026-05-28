# Programming Hero Assignment 2  (Bug & Feature Tracking System)

A backend API for tracking bugs and feature requests with authentication, authorization, filtering, sorting, and validation support.

---

## Table of Contents

- [Overview](#overview)
- [Live URL](#live-url)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Query Parameters](#query-parameters)
- [Database Schema](#database-schema)
- [Setup Steps](#setup-steps)

---

# Overview

This project is a backend issue tracking system where users can create, manage, update, and track bugs or feature requests.

The system includes:

- JWT Authentication
- Role-Based Authorization
- Issue Filtering & Sorting
- Input Validation
- Global Error Handling
- PostgreSQL Database Integration

# Live URL

```bash
https://programming-hero-assignment-2-bug-f.vercel.app
```

# Features

- User Registration & Login
- JWT Authentication
- Role-Based Authorization
- Create Issues
- Update Issues
- Delete Issues
- Issue Filtering
- Issue Sorting
- Query Validation
- Global Error Handling
- Secure Password Hashing
- PostgreSQL Integration
- RESTful API Design
- CORS Configuration

---

# Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL

### Authentication

- JWT (jsonwebtoken)
- bcryptjs

### Deployment

- Vercel

### Other Tools

- tsup
- dotenv
- cors
- pg
- tsx
- http-status-codes

---

# Architecture

The project follows a modular backend architecture using Express.js, TypeScript, and PostgreSQL.

## System Flow

```text
Client Request
      ↓
 Express Server
      ↓
    Routes
      ↓
 Middleware
      ↓
  Controllers
      ↓
  Services
      ↓
 PostgreSQL DB
      ↓
 API Response
```

## Architecture Components

### Server Layer

- `src/server.ts`
- `src/app.ts`

### Route Layer

- `auth.routes.ts`
- `issues.routes.ts`

### Middleware Layer

- `auth.ts`
- `globalErrorHandler.ts`
- `notFound.ts`

### Controller Layer

- `auth.controller.ts`
- `issues.controller.ts`

### Service Layer

- `auth.service.ts`
- `issues.service.ts`

### Utility Layer

- `sendResponse.ts`

---

# File Structure

```bash
assignment-2/
│
├── src/
│   ├── config/
│   │   └── index.ts
│   │
│   ├── db/
│   │   └── index.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   └── issues/
│   │       ├── issues.controller.ts
│   │       ├── issues.interface.ts
│   │       ├── issues.routes.ts
│   │       └── issues.service.ts
│   │
│   ├── utils/
│   │   └── sendResponse.ts
│   │
│   ├── app.ts
│   │
│   └── server.ts
│
├── .env
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vercel.json
└── README.md
```

---

# API Endpoints

## Authentication APIs

### Register User

```http
POST /api/auth/signup
```

### Login User

```http
POST /api/auth/login
```

---

## Issue APIs

### Create Issue

```http
POST /api/issues
```

### Get All Issues

```http
GET /api/issues
```

### Get Single Issue

```http
GET /api/issues/:id
```

### Update Issue

```http
PATCH /api/issues/:id
```

### Delete Issue

```http
DELETE /api/issues/:id
```

---

# Query Parameters

## Sorting

```http
/api/issues?sort=newest
/api/issues?sort=oldest
```

## Filter By Type

```http
/api/issues?type=bug
/api/issues?type=feature_request
```

## Filter By Status

```http
/api/issues?status=open
/api/issues?status=in_progress
/api/issues?status=resolved
```

---

# Database Schema

## Users Table

| Column Name | Data Type |
| --- | --- |
| id | SERIAL |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## Issues Table

| Column Name | Data Type |
| --- | --- |
| id | SERIAL |
| title | VARCHAR |
| description | TEXT |
| type | VARCHAR |
| status | VARCHAR |
| reporter_id | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## Database Relationship

- One user can create multiple issues
- `reporter_id` references the users table

---

# Setup Steps

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

## 2. Move Into the Project Folder

```bash
cd assignment-2
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run the Development Server

```bash
npm run dev
```

## 5. Build the Project

```bash
npm run build
```

## 6. Start Production Server

```bash
npm start
```