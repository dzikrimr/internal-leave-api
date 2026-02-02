# Internal Leave Management API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A robust REST API for managing employee leave requests with JWT-based authentication built with <a href="https://nestjs.com/" target="blank">NestJS</a> and <a href="https://www.postgresql.org/" target="blank">PostgreSQL</a>.
</p>

## 📋 Project Overview

This is a **production-ready REST API** demonstrating modern web application development practices. It provides functionality for:

- **User Management**: Register and authenticate users with JWT tokens
- **Leave Management**: Create, read, and update leave requests
- **Role-Based Access Control**: Secure endpoints with JWT authentication
- **Database Integration**: PostgreSQL with TypeORM ORM
- **Input Validation**: Class-validator for DTO validation
- **Error Handling**: Global exception filter for consistent error responses
- **E2E Testing**: Comprehensive test suite for all API endpoints

## 🧩 Architecture Pattern

### **Layered Architecture Pattern (Controllers, Services, Entities)**

This project uses a **Layered Architecture Pattern** within a Modular structure, which is the recommended approach for NestJS applications. Each feature module is organized into distinct layers:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Entities**: Define database models
- **DTOs**: Data Transfer Objects for validation

#### **Why Layered Architecture?**

1. **Separation of Concerns (SoC)**: Each layer has a specific responsibility

2. **Single Responsibility Principle (SRP)**: Each class has one reason to change

3. **Testability**: Each layer can be tested independently with mocked dependencies

4. **Maintainability**: Changes in one layer don't affect others (if interfaces remain stable)

5. **Scalability**: Easy to add new features by following the same pattern

6. **Team Collaboration**: Developers can work on different layers simultaneously

#### **Project Structure:**

```
src/
├── auth/                        # Authentication module
│   ├── controllers/
│   │   └── auth.controller.ts  # Login & Register endpoints
│   ├── services/
│   │   └── auth.service.ts     # Authentication logic (JWT, Password hashing)
│   ├── dto/
│   │   └── auth.dto.ts         # DTO for validation
│   ├── jwt/
│   │   ├── jwt.strategy.ts     # JWT validation strategy
│   │   └── jwt-auth.guard.ts   # JWT authentication guard
│   └── auth.module.ts          # Module definition
│
├── users/                       # Users module
│   ├── entities/
│   │   └── user.entity.ts      # User database entity
│   ├── controllers/
│   │   └── users.controller.ts # CRUD endpoints
│   ├── services/
│   │   └── users.service.ts    # Business logic
│   ├── dto/
│   │   └── user.dto.ts         # DTO for validation
│   └── users.module.ts         # Module definition
│
├── leaves/                      # Leaves module
│   ├── entities/
│   │   └── leave.entity.ts     # Leave database entity
│   ├── controllers/
│   │   └── leaves.controller.ts # CRUD endpoints
│   ├── services/
│   │   └── leaves.service.ts   # Business logic
│   ├── dto/
│   │   └── leave.dto.ts        # DTO for validation
│   └── leaves.module.ts        # Module definition
│
├── common/                      # Shared utilities
│   ├── filters/
│   │   └── all-exceptions.filter.ts  # Global error handler
│   └── interceptors/
│       └── response.interceptor.ts   # Response formatting
│
├── app.controller.ts           # Root controller
├── app.module.ts               # Root module (imports all feature modules)
├── app.service.ts              # Root service
└── main.ts                     # Application entry point
```

#### **Layer Responsibilities:**

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | HTTP request/response handling, Input validation, Route definitions | `@Controller()`, `@Get()`, `@Post()` |
| **Service** | Business logic, Data manipulation, Repository calls | `@Injectable()`, CRUD operations |
| **Entity** | Database schema definition, Relationships | `@Entity()`, `@Column()`, `@OneToMany()` |
| **DTO** | Input validation, Type safety | `class-validator` decorators |

## 🔐 Key Features

### 1. **JWT Authentication**
- Secure token-based authentication
- Configurable token expiration via environment variables
- Password hashing with bcrypt

### 2. **Two CRUD Operations**
- **Users**: GET, UPDATE, DELETE operations (related to leaves)
- **Leaves**: CREATE, READ, UPDATE operations (linked to users via foreign key)
- Relationship: One user has many leaves (One-to-Many relationship)

### 3. **Database**
- PostgreSQL for persistent data storage
- TypeORM as ORM for database operations
- Automatic migration support via synchronize option

### 4. **Input Validation**
- Class-validator decorators on DTOs
- Automatic validation pipe in controllers
- Consistent error responses

### 5. **Error Handling**
- Global exception filter for consistent error format
- Detailed error messages with timestamps

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Installation

1. **Clone the repository** (if using git)
```bash
cd internal-leave-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials and JWT secret
```

**`.env` file example:**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=leave_db

JWT_SECRET=secret-key-in-production
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development
```

4. **Create PostgreSQL database**
```bash
# Connect to PostgreSQL and create the database
createdb leave_db

# Or using psql:
psql -U postgres -c "CREATE DATABASE leave_db;"
```

## 📦 Project Setup & Running

### Development Mode
```bash
npm run start:dev
```
The API will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

### Other Commands
```bash
# Format code with Prettier
npm run format

# Lint and fix code with ESLint
npm run lint

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## 📚 API Documentation

### Using Postman
1. Import the `postman_collection.json` file into Postman
2. Set the `token` variable after login to use protected endpoints
3. All endpoints are pre-configured with examples

### API Endpoints

#### **Authentication**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/register` | Register a new user | ❌ (Not Required) |
| POST | `/auth/login` | Login and get JWT token | ❌ (Not Required) |

> **Note**: Authentication endpoints do NOT require a token because users need to register/login before they can be authenticated.

#### **Users**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/users` | Get all users | ✅ (Required) |
| GET | `/users/:id` | Get user by ID | ✅ (Required) |
| PUT | `/users/:id` | Update user | ✅ (Required) |
| DELETE | `/users/:id` | Delete user | ✅ (Required) |

#### **Leaves**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/leaves` | Create leave request | ✅ (Required) |
| GET | `/leaves` | Get all leave requests | ✅ (Required) |
| GET | `/leaves/:id` | Get leave by ID | ✅ (Required) |
| PUT | `/leaves/:id/status` | Update leave status | ✅ (Required) |

### Example Requests

**Register a user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get all leaves (with JWT token):**
```bash
curl -X GET http://localhost:3000/leaves \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create a leave request:**
```bash
curl -X POST http://localhost:3000/leaves \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ANNUAL",
    "startDate": "2024-03-01",
    "endDate": "2024-03-05",
    "reason": "Vacation"
  }'
```

## 🧪 Testing

### Run E2E Tests
```bash
npm run test:e2e
```

The test suite includes:
- ✅ User registration validation
- ✅ User login with JWT token generation
- ✅ Protected route access (with and without token)
- ✅ Leave CRUD operations
- ✅ User CRUD operations
- ✅ Token validation

## 🔒 Security Best Practices

1. **JWT Secret**: Change the `JWT_SECRET` in production
2. **Password Hashing**: Bcrypt with 10 rounds (configurable)
3. **CORS**: Enabled globally for API access
4. **Input Validation**: All inputs validated using class-validator
5. **Global Error Handling**: No sensitive information leaked in error responses
6. **HTTP Guard**: JWT auth guard protects sensitive endpoints

## 📦 Deployment

To deploy to a cloud platform (AWS, Heroku, Azure, etc.):

1. Build the project:
```bash
npm run build
```

2. Set environment variables on your hosting platform

3. Run the production build:
```bash
npm run start:prod
```

## 👨‍💻 Development Notes

### Common Tasks

**Adding a new feature:**
```bash
nest g module features/new-feature
nest g controller features/new-feature
nest g service features/new-feature
```

**Database migrations:**
The project uses TypeORM with `synchronize: true` in development. For production, use TypeORM migrations:
```bash
npm run typeorm migration:generate
npm run typeorm migration:run
```

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Use a different port
PORT=3001 npm run start:dev
```

**Database connection error:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**JWT token issues:**
- Token expires based on `JWT_EXPIRATION` setting
- Use login endpoint to get a new token
- Include token in `Authorization: Bearer <token>` header

## 👤 Author
Dzikri Murtadlo as Backend Developer
