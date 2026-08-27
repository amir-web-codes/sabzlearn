# SabzLearn

> A backend-first learning management platform built around real-world education workflows — from authentication and course management to enrollment, support tickets, media handling, and checkout.

**Node.js · Express · MongoDB · Redis · React · Cloudinary · JWT · Zod · Swagger**

## Overview

**SabzLearn** is a full-stack learning platform with a strong focus on backend architecture and real application workflows.

Instead of being limited to course CRUD operations, the backend handles authentication, roles, courses, lessons, enrollments, comments, categories, tags, support tickets, cart/order flows, media uploads, moderation, and API documentation.

A React + Vite frontend workspace is also included and is currently being developed on top of the backend API.

## Key Features

- 🔐 **Authentication & Sessions** — Signup, login, refresh tokens, logout, password changes, and profile management
- 👥 **Role-Based Access** — User, teacher, and admin permissions with ownership-aware authorization
- 🎓 **Course Management** — Course CRUD, media, filtering, students, related courses, and administrative workflows
- 📚 **Lessons & Enrollment** — Lesson management with enrollment and course-owner access rules
- 🗂️ **Categories & Tags** — Structured course discovery and classification
- 💬 **Comments & Ratings** — Course discussions with ownership and moderation rules
- 🎫 **Support Tickets** — User support workflow with replies and ticket statuses
- 🛒 **Cart & Orders** — Course cart management and checkout/order foundation
- ☁️ **Cloudinary Media** — Avatars, thumbnails, videos, lesson media, and category assets
- ⚡ **Redis Integration** — Shared high-speed application state
- 📖 **Swagger / OpenAPI** — Interactive and modular API documentation
- 🚦 **Security & Rate Limiting** — Validation, Helmet, role checks, ban checks, and endpoint-specific limits
- 🧪 **Testing Tooling** — Jest and Supertest support
- 🐳 **Docker Development** — MongoDB replica set and Redis

## Tech Stack

### Backend

| Category       | Technology              |
| -------------- | ----------------------- |
| Runtime        | Node.js                 |
| Framework      | Express 5               |
| Database       | MongoDB                 |
| ODM            | Mongoose                |
| Cache          | Redis                   |
| Authentication | JWT                     |
| Validation     | Zod / Fastest Validator |
| Media          | Cloudinary + Multer     |
| API Docs       | Swagger / OpenAPI       |
| Logging        | Pino                    |
| Testing        | Jest + Supertest        |
| Infrastructure | Docker Compose          |

### Frontend

| Category     | Technology |
| ------------ | ---------- |
| UI           | React 19   |
| Build Tool   | Vite       |
| HTTP Client  | Axios      |
| Code Quality | ESLint     |

## Architecture

The backend follows a layered structure:

```text
Request
   ↓
Router
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Mongoose Model
   ↓
MongoDB
```

Project structure:

```text
sabzlearn/
├── backend/
│   ├── src/
│   │   ├── configs/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   ├── docker-compose.yml
│   └── package.json
│
└── frontend/
    ├── src/
    └── package.json
```

This separation keeps HTTP handling, business logic, persistence, infrastructure, and documentation independent and easier to maintain.

## Main Modules

| Module     | Responsibility                                |
| ---------- | --------------------------------------------- |
| Users      | Authentication, profiles, roles, moderation   |
| Courses    | Course lifecycle, enrollment, students, media |
| Lessons    | Learning content and lesson videos            |
| Categories | Hierarchical course organization              |
| Tags       | Flexible course classification                |
| Comments   | Course comments and ratings                   |
| Tickets    | User support workflow                         |
| Cart       | Cart, checkout, and order-related operations  |

## Getting Started

### Prerequisites

Install:

- Node.js
- npm
- Git
- Docker & Docker Compose

A Cloudinary account is required for media-upload features.

### 1. Clone the Repository

```bash
git clone git@github.com:amir-web-codes/sabzlearn.git
cd sabzlearn
```

## Backend Setup

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Example local configuration:

```env
NODE_ENV=development
PORT=7000

DATABASE_URL=mongodb://localhost:27017/sabzlearn?replicaSet=rs0

ACCESS_TOKEN_KEY=your_access_token_key_min_32_chars
REFRESH_TOKEN_KEY=your_refresh_token_key_min_32_chars

ALLOWED_ORIGINS=http://localhost:5173
LOG_LEVEL=debug

REDIS_URL=redis://localhost:6378

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start MongoDB & Redis

```bash
docker compose up -d
```

MongoDB runs on `27017` and Redis is exposed locally on `6378`.

### 5. Initialize MongoDB Replica Set

This is required once for a fresh MongoDB volume:

```bash
docker exec -it mongodb mongosh --eval "rs.initiate()"
```

### 6. Start the Backend

```bash
npm run dev
```

Available locally at:

```text
API          localhost:7000
Swagger      localhost:7000/api-docs
Health       localhost:7000/health
```

## Frontend Setup

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs on:

```text
localhost:5173
```

## Available Scripts

### Backend

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start development server |
| `npm start`   | Start backend            |
| `npm test`    | Run Jest tests           |

### Frontend

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite               |
| `npm run build`   | Build for production     |
| `npm run lint`    | Run ESLint               |
| `npm run preview` | Preview production build |

## API Documentation

Interactive Swagger documentation is available while the backend is running:

```text
localhost:7000/api-docs
```

The OpenAPI layer is organized into reusable components for:

```text
schemas · responses · parameters · paths · security · tags
```

This makes the API contract easier to maintain and consume from the frontend.

## Security & Reliability

SabzLearn includes:

- Access and refresh-token authentication
- Password hashing
- Role-based authorization
- Ownership checks
- Course-owner checks
- Enrollment-aware access
- User ban protection
- Zod request validation
- Rate limiting
- Helmet security headers
- CORS configuration
- File-upload validation
- Centralized error handling
- Structured request/application logging
- `uncaughtException` and `unhandledRejection` handling
- Health endpoint

## Current Status

```text
Backend API             ✅
Authentication          ✅
Users & Roles           ✅
Courses & Lessons       ✅
Enrollment              ✅
Categories & Tags       ✅
Comments                ✅
Support Tickets         ✅
Cart / Orders           ✅
Cloudinary Media        ✅
Swagger Infrastructure  ✅
React Frontend          🚧 In Progress
Production Payments     🚧 Planned
```

> The backend is currently the main engineering focus of SabzLearn. The React application is the foundation for the complete learner, teacher, and admin interface.

## Roadmap

Planned improvements include:

- 🎨 Complete learner, teacher, and admin frontend
- 💳 Production payment gateway and payment verification
- 📈 Learning progress and lesson-completion tracking
- 🏆 Course completion and certificates
- 🎟️ Discount codes and promotional campaigns
- 🔔 Email/SMS notifications and background jobs
- 🔎 Advanced course search
- 🧪 Expanded integration and contract testing
- ⚙️ CI/CD and production deployment
- 📊 Metrics, tracing, and production observability

## Engineering Focus

SabzLearn is designed to demonstrate more than CRUD APIs.

Its main engineering concepts include:

**modular REST architecture, authentication, RBAC, ownership-based authorization, enrollment rules, media workflows, MongoDB modeling, Redis integration, reusable validation, rate limiting, OpenAPI documentation, and multi-domain business logic.**

## Author

Developed by **Amir — @amir-web-codes**

---

For a technical review, the most relevant backend directories are:

```text
backend/src/routers/
backend/src/controllers/
backend/src/services/
backend/src/models/
backend/src/middlewares/
backend/src/docs/
```

They provide a good overview of the project's API architecture, business rules, access-control strategy, persistence layer, and documentation structure.
