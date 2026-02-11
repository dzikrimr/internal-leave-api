# Internal Leave Request API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A REST API for managing employee leave requests with JWT-based authentication built with <a href="https://nestjs.com/" target="blank">NestJS</a> and <a href="https://www.postgresql.org/" target="blank">PostgreSQL</a>.
</p>

## 📋 Project Overview

This is a **production-ready REST API** demonstrating modern web application development practices. It provides functionality for:

- **Authentication**: Register and authenticate users with JWT tokens
- **Leave Requests**: Create, read, and update leave requests
- **JWT Authentication**: Secure endpoints with token-based auth
- **Database Integration**: PostgreSQL with TypeORM
- **Input Validation**: Class-validator for DTO validation
- **Error Handling**: Global exception filter for consistent responses
- **E2E Testing**: Comprehensive test suite for all API endpoints
- **Swagger Documentation**: Auto-generated interactive API docs

---

## 🛠️ Development Process (Step by Step)

### Phase 1: Project Initialization

**Step 1: Create NestJS Project**
```bash
npm i -g @nestjs/cli
nest new internal-leave-api
cd internal-leave-api
```

**Step 2: Install Core Dependencies**
```bash
# Database
npm install --save @nestjs/typeorm typeorm pg

# Authentication
npm install --save @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt

# Validation & Documentation
npm install --save class-validator class-transformer @nestjs/swagger swagger-ui-express

# Testing
npm install --save-dev @nestjs/testing @nestjs/cli @nestjs/schematics
```

**Step 3: Setup Project Structure**
```
src/
├── auth/
├── users/
├── leaves/
├── common/
└── app.module.ts
```

---

### Phase 2: Database & Entity Design

**Step 4: Create User Entity**
```typescript
// src/users/entities/user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Leave, (leave) => leave.user)
  leaves: Leave[];
}
```

**Step 5: Create Leave Entity**
```typescript
// src/leaves/entities/leave.entity.ts
@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: 'PENDING' })
  status: string;

  @ManyToOne(() => User, (user) => user.leaves)
  user: User;
}
```

---

### Phase 3: Authentication Module

**Step 6: Implement Auth Service**
```typescript
// src/auth/services/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
```

**Step 7: Implement JWT Strategy**
```typescript
// src/auth/jwt/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

---

### Phase 4: CRUD Operations

**Step 8: Users Module CRUD**
- GET `/users` - Get all users (Admin only)
- GET `/users/:id` - Get user by ID
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Delete user

**Step 9: Leaves Module CRUD**
- POST `/leaves` - Create leave request
- GET `/leaves` - Get all leaves (Admin) / own leaves (User)
- GET `/leaves/:id` - Get leave by ID
- PUT `/leaves/:id` - Update leave
- PUT `/leaves/:id/approve` - Approve leave (Admin)
- PUT `/leaves/:id/reject` - Reject leave (Admin)

---

### Phase 5: Testing & Documentation

**Step 10: Implement E2E Tests**
```typescript
// test/auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register/user')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' })
      .expect(201);
  });
});
```

**Step 11: Configure Swagger**
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Internal Leave API')
  .setDescription('API for managing employee leave requests')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

---

## 🚨 Challenges & Solutions

### Challenge 1: JWT Authentication Setup

**Problem:** Initial setup of JWT authentication was confusing with multiple Passport strategies.

**Solution:**
1. Installed required packages: `@nestjs/passport`, `passport`, `passport-jwt`, `@nestjs/jwt`
2. Created a dedicated `jwt.strategy.ts` for token validation
3. Created `jwt-auth.guard.ts` to protect routes
4. Configured `AuthGuard` in controllers

**Reference Files:**
- [`src/auth/jwt/jwt.strategy.ts`](src/auth/jwt/jwt.strategy.ts)
- [`src/auth/jwt/jwt-auth.guard.ts`](src/auth/jwt/jwt-auth.guard.ts)

---

### Challenge 2: User Role-Based Access Control (RBAC)

**Problem:** Needed to restrict admin-only endpoints.

**Solution:**
1. Created custom `@Roles()` decorator in [`src/common/guards/roles.decorator.ts`](src/common/guards/roles.decorator.ts)
2. Implemented `RolesGuard` in [`src/common/guards/roles.guard.ts`](src/common/guards/roles.guard.ts)
3. Applied `@Roles('admin')` to protected endpoints

```typescript
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

---

### Challenge 3: TypeORM Entity Relationships

**Problem:** Configuring One-to-Many relationship between User and Leave entities.

**Solution:**
1. Added `@OneToMany(() => Leave, (leave) => leave.user)` in User entity
2. Added `@ManyToOne(() => User, (user) => user.leaves)` in Leave entity
3. Set up proper cascade options for automatic relationship handling

---

### Challenge 4: Password Hashing

**Problem:** Storing plain text passwords is insecure.

**Solution:**
1. Used `bcrypt` library with 10 salt rounds
2. Hash password during registration in [`auth.service.ts`](src/auth/services/auth.service.ts)
3. Compare hashed password during login

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
await bcrypt.compare(password, user.password);
```

---

### Challenge 5: E2E Test Database Isolation

**Problem:** Tests were interfering with each other and using real database.

**Solution:**
1. Created test configuration in [`test/jest-e2e.json`](test/jest-e2e.json)
2. Used unique test emails with timestamps: `` `admin-test-${Date.now()}@example.com` ``
3. Hash password `'adminpass123'` for all test users
4. Clean up test data after each test suite

**Test Password Reference:** `adminpass123` (used in [`test/auth.e2e-spec.ts`](test/auth.e2e-spec.ts))

---

### Challenge 6: Global Error Handling

**Problem:** Inconsistent error responses across different endpoints.

**Solution:**
1. Created `AllExceptionsFilter` in [`src/common/filters/all-exceptions.filter.ts`](src/common/filters/all-exceptions.filter.ts)
2. Created `ResponseInterceptor` in [`src/common/interceptors/response.interceptor.ts`](src/common/interceptors/response.interceptor.ts)
3. Applied consistent response format for all endpoints

---

### Challenge 7: DTO Validation

**Problem:** Invalid data reaching service layer.

**Solution:**
1. Created DTOs with `class-validator` decorators in [`src/auth/dto/auth.dto.ts`](src/auth/dto/auth.dto.ts)
2. Added `ValidationPipe` globally in `main.ts`
3. Added custom validation messages

```typescript
// Example DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

---

### Challenge 8: CORS Configuration

**Problem:** Frontend couldn't access API due to CORS restrictions.

**Solution:**
Enabled CORS in [`src/main.ts`](src/main.ts):

```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

---

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
│   ├── guards/
│   │   ├── roles.decorator.ts   # Roles decorator for RBAC
│   │   └── roles.guard.ts       # Roles guard to check user roles
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

---

## 🔐 Key Features

### 1. **JWT Authentication**
- Secure token-based authentication
- Configurable token expiration via environment variables
- Password hashing with bcrypt

### 2. **Swagger API Documentation**
- Interactive API docs at `/api`
- Auto-generated from decorators
- Request/response schemas with examples

### 3. **Role-Based Access Control (RBAC)**
- Two user roles: `user` and `admin`
- `@Roles()` decorator protects endpoints
- `RolesGuard` checks user roles before allowing access

### 4. **Two CRUD Operations**
- **Users**: GET, UPDATE, DELETE operations (related to leaves)
- **Leaves**: CREATE, READ, UPDATE operations (linked to users via foreign key)
- Relationship: One user has many leaves (One-to-Many relationship)

### 5. **Database**
- PostgreSQL for persistent data storage
- TypeORM as ORM for database operations
- Automatic migration support via synchronize option

### 6. **Input Validation**
- Class-validator decorators on DTOs
- Automatic validation pipe in controllers
- Consistent error responses

### 7. **Error Handling**
- Global exception filter for consistent error format
- Detailed error messages with timestamps

---

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

---

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

---

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available via **Swagger UI**. After starting the server, visit:

**📖 Swagger UI:** [http://localhost:3000/api](http://localhost:3000/api)

Swagger provides:
- Interactive endpoint exploration
- Request/response examples
- Schema documentation
- Easy testing of endpoints

### How to Authenticate in Swagger

1. **First, register a user**:
   - Click on `POST /auth/register/user`
   - Click "Try it out"
   - Enter email, password, and name
   - Click "Execute"

2. **Or register an admin**:
   - Click on `POST /auth/register/admin`
   - Click "Try it out"
   - Enter email, password, and name
   - Click "Execute"

3. **Then, login to get JWT token**:
   - Click on `POST /auth/login`
   - Click "Try it out"
   - Enter email and password
   - Click "Execute"
   - Copy the `access_token` from the response

4. **Authorize in Swagger**:
   - Click the "Authorize" button (🔓 icon) at the top of Swagger UI
   - Enter `Bearer YOUR_ACCESS_TOKEN` (replace with your actual token)
   - Click "Authorize"
   - Now you can test protected endpoints

### Role-Based Access Control (RBAC)

This API implements **Role-Based Access Control** with two user roles:

| Role | Description | Capabilities |
|------|-------------|-------------|
| **user** | Regular employee | Create leave requests, view leaves |
| **admin** | Administrator | Full access to all endpoints, approve/reject leaves, manage users |

#### Protected Endpoints (Admin Only)

The following endpoints require `admin` role:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| PUT | `/leaves/:id/approve` | Approve leave request |
| PUT | `/leaves/:id/reject` | Reject leave request |

#### Creating an Admin User

To create an admin user, use the admin registration endpoint:

```bash
curl -X POST http://localhost:3000/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

> **Note**: By default, all users registered via `/auth/register/user` get the `user` role. Use `/auth/register/admin` to create admin users.

### Using Postman

1. Import the `postman_collection.json` file into Postman
2. Set the `token` variable after login to use protected endpoints
3. All endpoints are pre-configured with examples

---

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

> **Note**: All API endpoints are documented in Swagger UI at `/api`. Refer to the interactive documentation for detailed request/response schemas.

---

## 🔒 Security Best Practices

1. **JWT Secret**: Change the `JWT_SECRET` in production
2. **Password Hashing**: Bcrypt with 10 rounds (configurable)
3. **CORS**: Enabled globally for API access
4. **Input Validation**: All inputs validated using class-validator
5. **Global Error Handling**: No sensitive information leaked in error responses
6. **HTTP Guard**: JWT auth guard protects sensitive endpoints

---

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

---

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

---

## 👤 Author

Dzikri Murtadlo as Backend Developer
