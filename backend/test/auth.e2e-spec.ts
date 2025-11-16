import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should reject weak passwords', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak', // No uppercase, number, or special char
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);
    });

    it('should reject passwords without uppercase', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123!', // No uppercase
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);
    });

    it('should reject passwords without special characters', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123', // No special char
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);
    });

    it('should accept strong passwords', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test${Date.now()}@example.com`, // Unique email
          password: 'SecureP@ss123',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.role).toBe('user'); // Should always be 'user'
        });
    });

    it('should enforce rate limiting on registration', async () => {
      const email = `ratelimit${Date.now()}@example.com`;
      const registerData = {
        email,
        password: 'SecureP@ss123',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send({ ...registerData, email: `${i}${email}` });
      }

      // The 6th request should be rate limited
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...registerData, email: `6${email}` })
        .expect(429);
    });
  });

  describe('/auth/login (POST)', () => {
    const testUser = {
      email: `login${Date.now()}@example.com`,
      password: 'SecureP@ss123',
      firstName: 'John',
      lastName: 'Doe',
    };

    beforeAll(async () => {
      // Create a test user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    });

    it('should successfully login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email);
        });
    });

    it('should reject login with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongP@ss123',
        })
        .expect(401);
    });

    it('should reject login with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecureP@ss123',
        })
        .expect(401);
    });

    it('should enforce rate limiting on login', async () => {
      // Make 10 requests (the limit)
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          });
      }

      // The 11th request should be rate limited
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(429);
    });
  });

  describe('Role assignment security', () => {
    it('should not allow users to self-assign admin role', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `admin${Date.now()}@example.com`,
          password: 'SecureP@ss123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'admin', // Attempting to assign admin role
        })
        .expect(201);

      // Should still be 'user' role, not 'admin'
      expect(response.body.user.role).toBe('user');
    });
  });
});
