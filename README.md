# SabzLearn

SabzLearn is a full-featured backend API for an online learning platform inspired by modern education marketplaces. It provides a solid foundation for managing users, instructors, courses, lessons, enrollments, comments, and support tickets in a secure and scalable way.

This project is more than a simple CRUD app. It demonstrates real-world backend engineering concepts such as authentication, authorization, role-based access control, validation, security hardening, pagination, and modular architecture.

---

## Why this project is impressive

SabzLearn was built to look and feel like a production-grade backend service. It focuses on practical business logic and clean architecture rather than just basic API endpoints.

What makes this project strong for a portfolio or job interview:

- It solves a real-world problem: online course management
- It includes user roles such as student, teacher, and admin
- It implements secure authentication with JWT and refresh-token support
- It includes admin moderation workflows and user protection features
- It uses a structured MVC-style backend architecture
- It shows attention to security, validation, and reliability

---

## Main Features

### 1. User authentication and account management

- Sign up and login
- Secure password handling with hashing
- JWT access tokens and refresh-token flow
- Logout support
- Profile viewing and profile updates
- Password change functionality
- Account deletion

### 2. Role-based access control

- Users can register as students by default
- Teachers can create and manage courses
- Admins can manage users, requests, and moderation actions
- Role request workflow for users who want to become teachers

### 3. Course management

- Create, edit, and delete courses
- Slug-based course access
- Course details and course listing with pagination
- Course enrollment and cancellation
- Course student and comment management
- Course rating metadata support

### 4. Lesson management

- Add lessons to existing courses
- Edit or delete lessons
- Retrieve lessons by course or globally

### 5. Enrollment system

- Users can enroll in courses
- Users can cancel their enrollment
- Enrollment actions are protected by middleware and rate limiting

### 6. Comments and community interaction

- Users can leave comments on courses
- Comment ownership and edit/delete protection
- Comment retrieval for users and course authors

### 7. Support ticket system

- Users can create support tickets
- Tickets can receive replies
- Ticket status can be changed by authorized users
- Admin and teacher visibility for ticket management

### 8. Admin tools and moderation

- Ban and unban users
- Change user roles
- Review pending role requests
- Accept or reject role requests
- Manage tickets and course-related data responsibly

### 9. Security and reliability

- Input validation using schema-based validation
- CORS configuration
- Helmet middleware for secure headers
- Rate limiting for sensitive actions
- Centralized error handling
- Health check endpoint
- Cookie-based refresh-token handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- helmet
- express-rate-limit
- Jest
- Supertest

---

## Project Structure

```text
controllers/     # Request handlers
services/        # Core business logic
models/          # Mongoose schemas
routers/         # Route definitions
middlewares/     # Auth, validation, role checks, error handling
configs/         # Database, CORS, middleware setup
utils/           # Helper utilities
```

---

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a .env file with the required environment variables:

```env
PORT=7000
NODE_ENV=development
DATABASEURL=your_mongodb_connection_string
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ALLOWED_ORIGINS=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

---

## Scripts

```bash
npm run dev
npm start
npm test
```

---

## Example API Areas

Some of the main API routes include:

- POST /users/auth/signup
- POST /users/auth/login
- POST /users/auth/logout
- POST /users/refresh-token
- GET /courses/getAll
- POST /courses/create
- POST /courses/:slug/enroll
- GET /lessons/getAll
- POST /comments/:slug/create
- POST /tickets/create

---

## Future improvements

Potential next steps for the project:

- Payment integration
- Email verification and password reset
- File upload for course images and videos
- Advanced analytics dashboard
- Unit and integration test expansion
- Docker support
