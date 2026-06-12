# DevPulse API

A backend issue tracking system built with Node.js, Express.js, TypeScript, and PostgreSQL. The application allows contributors to create bug reports and feature requests while maintainers manage the complete issue workflow through role-based access control.

## Live URL

https://programming-hero-assignment-2-bug-f.vercel.app/

## GitHub Repository

https://github.com/chinmoy567/CHINMOY-SARKAR-PROGRAMMING-HERO-L2B7-1139/tree/main/assignment-2

## Interview Video

[Watch Interview Video](https://drive.google.com/drive/folders/16KNDrlGUwcNg0XbDWbL92YEyq0DGKpfU)

---

## Features

- User Registration
- User Login with JWT Authentication
- Password Hashing using bcrypt
- Role-Based Authorization
- Create Issue
- Get All Issues
- Get Single Issue
- Update Issue
- Delete Issue
- PostgreSQL Database Integration
- Centralized Error Handling
- Environment Variable Configuration
- TypeScript Support
- Modular Folder Structure

---

## Technology Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL (Neon Database)

### Authentication

- JWT (jsonwebtoken)
- bcrypt

### Deployment

- Vercel

---

## Architecture

The project follows a modular backend architecture using Express.js, TypeScript, and PostgreSQL.

### System Flow

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

### Architecture Components

#### Server Layer

- src/server.ts
- src/app.ts

#### Route Layer

- auth.routes.ts
- issues.routes.ts

#### Middleware Layer

- auth.ts
- globalErrorHandler.ts
- notFound.ts

#### Controller Layer

- auth.controller.ts
- issues.controller.ts

#### Service Layer

- auth.service.ts
- issues.service.ts

#### Utility Layer

- sendResponse.ts

---

## File Structure

```text
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

## Installation

Clone the repository

```bash
git clone https://github.com/chinmoy567/CHINMOY-SARKAR-PROGRAMMING-HERO-L2B7-1139.git
cd assignment-2
```

Install dependencies

```bash
npm install
```


Run the development server

```bash
npm run dev
```

Build the project

```bash
npm run build
```

Start the production server

```bash
npm start
```

---

## Database Schema

### Users Table

| Column Name | Data Type |
|------------|-----------|
| id | SERIAL |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### Issues Table

| Column Name | Data Type |
|------------|-----------|
| id | SERIAL |
| title | VARCHAR |
| description | TEXT |
| type | VARCHAR |
| status | VARCHAR |
| reporter_id | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Database Relationship

- One user can create multiple issues.
- reporter_id references the users table.
- Each issue belongs to a single user.

---

## API Endpoints

### Authentication APIs

#### Register User

```http
POST /api/auth/signup
```

#### Login User

```http
POST /api/auth/login
```

### Issue APIs

#### Create Issue

```http
POST /api/issues
```

#### Get All Issues

```http
GET /api/issues
```

#### Get Single Issue

```http
GET /api/issues/:id
```

#### Update Issue

```http
PATCH /api/issues/:id
```

#### Delete Issue

```http
DELETE /api/issues/:id
```

---

## Query Parameters

### Sorting

```http
/api/issues?sort=newest
/api/issues?sort=oldest
```

### Filter By Type

```http
/api/issues?type=bug
/api/issues?type=feature_request
```

### Filter By Status

```http
/api/issues?status=open
/api/issues?status=in_progress
/api/issues?status=resolved
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

## Environment Variables

```env
PORT=5000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
```

---

## Author

**Chinmoy Sarkar**

GitHub: https://github.com/chinmoy567

---

## License

This project was developed for Programming Hero Assignment 2.