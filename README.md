# EMS Portal - Enterprise Management System

A full-stack Enterprise Management System built with Spring Boot 3 + React + TypeScript.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Security, JWT, JPA/Hibernate, PostgreSQL
- **Frontend**: React 18, TypeScript, Tailwind CSS, Redux Toolkit, Recharts
- **Infrastructure**: Docker, Docker Compose

## Features Implemented

- Authentication (JWT + Refresh Tokens + RBAC)
- Admin Dashboard with analytics (charts, stats, activities)
- Employee Management (CRUD, profiles, search, pagination)
- Leave Management (apply, approve/reject, balance tracking)

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- Docker (optional)

### Run Backend (Development)

```bash
cd backend
mvn spring-boot:run
```

The API will start at `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Run Frontend (Development)

```bash
cd frontend
npm install
npm run dev
```

The app will start at `http://localhost:5173`

### Run with Docker

```bash
docker-compose up -d
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@ems.com | Admin@123 |
| HR Admin | hr@ems.com | Admin@123 |
| Employee | john@ems.com | Admin@123 |
| Team Lead | mike@ems.com | Admin@123 |

## API Endpoints

### Auth
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/refresh` - Refresh token

### Employees
- `GET /api/v1/employees` - List (paginated)
- `GET /api/v1/employees/{id}` - Get by ID
- `GET /api/v1/employees/me` - Current profile
- `POST /api/v1/employees` - Create
- `PUT /api/v1/employees/{id}` - Update
- `DELETE /api/v1/employees/{id}` - Delete

### Leave
- `GET /api/v1/leaves` - List all
- `GET /api/v1/leaves/my-leaves` - My leaves
- `POST /api/v1/leaves` - Apply
- `PUT /api/v1/leaves/{id}/approve` - Approve
- `PUT /api/v1/leaves/{id}/reject` - Reject
- `GET /api/v1/leaves/balance` - Leave balance

### Dashboard
- `GET /api/v1/dashboard/admin` - Admin analytics

### Departments
- `GET /api/v1/departments` - List all

## Project Structure

```
ems-portal/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/ems/
│   │   ├── config/            # Security, CORS, Swagger
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── entity/            # JPA Entities
│   │   ├── exception/         # Global exception handler
│   │   ├── repository/        # JPA Repositories
│   │   ├── security/          # JWT, Authentication
│   │   └── service/           # Business logic
│   └── src/main/resources/
│       └── application.yml    # Config
├── frontend/                   # React SPA
│   └── src/
│       ├── api/               # API client
│       ├── components/        # UI & Layout components
│       ├── hooks/             # Custom hooks
│       ├── pages/             # Route pages
│       ├── store/             # Redux Toolkit
│       ├── types/             # TypeScript types
│       └── utils/             # Utilities
└── docker-compose.yml
```
