import request from 'supertest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { User, UserRole } from '../src/users/entities/user.entity';

describe('Auth & Leave API E2E Tests', () => {
  let app;
  let token: string;
  let adminToken: string;
  let userId: number;
  let leaveId: number;
  let userRepo: Repository<User>;
  const testEmail = `test-${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Get user repository to create admin user directly
    userRepo = moduleRef.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    // Clean up test data
    if (userRepo && userId) {
      await userRepo.delete(userId);
    }
    if (app) {
      await app.close();
    }
  });

  // auth tests
  describe('Auth (POST /auth/register & /auth/login)', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail, password: 'password123', name: 'Test User' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(testEmail);
      userId = res.body.id;
    });

    it('should reject invalid email on register', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect(400);
    });

    it('should reject short password on register', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: `test-${Date.now() + 1}@example.com`, password: '123' })
        .expect(400);
    });

    it('should login and return access token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(typeof res.body.access_token).toBe('string');
      token = res.body.access_token;
    });

    it('should reject login with wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' })
        .expect(401);
    });

    it('should reject login with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .expect(401);
    });
  });

  // protected route tests
  describe('Protected Routes (JWT Authorization)', () => {
    it('should block GET /leaves without token', () => {
      return request(app.getHttpServer()).get('/leaves').expect(401);
    });

    it('should block POST /leaves without token', () => {
      return request(app.getHttpServer())
        .post('/leaves')
        .send({ type: 'SICK', startDate: '2024-02-01', endDate: '2024-02-02' })
        .expect(401);
    });

    it('should reject request with invalid token', () => {
      return request(app.getHttpServer())
        .get('/leaves')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  // leaves CRUD tests
  describe('Leaves CRUD (POST/GET/PUT /leaves)', () => {
    it('should create a leave request with valid token', async () => {
      const res = await request(app.getHttpServer())
        .post('/leaves')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'ANNUAL',
          startDate: '2024-03-01',
          endDate: '2024-03-05',
          reason: 'Vacation',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.type).toBe('ANNUAL');
      expect(res.body.status).toBe('PENDING');
      leaveId = res.body.id;
    });

    it('should get all leaves with valid token', () => {
      return request(app.getHttpServer())
        .get('/leaves')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get single leave by ID', () => {
      return request(app.getHttpServer())
        .get(`/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(leaveId);
          expect(res.body.type).toBe('ANNUAL');
        });
    });

    it('should update leave status', async () => {
      // Create admin user directly in database for testing
      const adminEmail = `admin-test-${Date.now()}@example.com`;
      const hashedPassword = await bcrypt.hash('adminpass123', 10);
      const adminUser = await userRepo.save({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      });

      // Login as admin
      const adminRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminEmail, password: 'adminpass123' })
        .expect(200);

      expect(adminRes.body).toHaveProperty('access_token');
      adminToken = adminRes.body.access_token;

      // Update leave status (approve)
      await request(app.getHttpServer())
        .put(`/leaves/${leaveId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Clean up admin user
      await userRepo.delete(adminUser.id);
    });
  });

  // users CRUD tests (admin only)
  describe('Users CRUD (GET/PUT/DELETE /users)', () => {
    it('should get all users', async () => {
      // Create admin user directly in database for testing
      const adminEmail = `admin-test-${Date.now()}@example.com`;
      const hashedPassword = await bcrypt.hash('adminpass123', 10);
      const adminUser = await userRepo.save({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      });

      // Login as admin
      const adminRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminEmail, password: 'adminpass123' })
        .expect(200);

      adminToken = adminRes.body.access_token;

      // Get all users
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });

      // Clean up admin user
      await userRepo.delete(adminUser.id);
    });

    it('should get user by ID', async () => {
      // Create admin user directly in database for testing
      const adminEmail = `admin-test-${Date.now()}@example.com`;
      const hashedPassword = await bcrypt.hash('adminpass123', 10);
      const adminUser = await userRepo.save({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      });

      // Login as admin
      const adminRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminEmail, password: 'adminpass123' })
        .expect(200);

      adminToken = adminRes.body.access_token;

      // Get user by ID
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.email).toBe(testEmail);
        });

      // Clean up admin user
      await userRepo.delete(adminUser.id);
    });

    it('should update user', async () => {
      // Create admin user directly in database for testing
      const adminEmail = `admin-test-${Date.now()}@example.com`;
      const hashedPassword = await bcrypt.hash('adminpass123', 10);
      const adminUser = await userRepo.save({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      });

      // Login as admin
      const adminRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminEmail, password: 'adminpass123' })
        .expect(200);

      adminToken = adminRes.body.access_token;

      // Update user
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test User Updated' })
        .expect(200);

      // Clean up admin user
      await userRepo.delete(adminUser.id);
    });
  });
});
