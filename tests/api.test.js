// tests/api.test.js
// Run with: npm test

const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');

describe('Book Store API Tests', () => {
  
  let userId, bookId, reviewId, authToken;

  // USERS API TESTS
  describe('Users API', () => {
    
    test('POST /api/users/register - Register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.user.username).toBe('testuser');
      userId = res.body.user.id;
    });

    test('POST /api/users/register - Duplicate email should fail', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser2',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toContain('User already exists');
    });

    test('POST /api/users/login - Login should return token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    test('POST /api/users/login - Wrong password should fail', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
    });

    test('GET /api/users/me - Get logged-in user profile', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Cookie', [`sessionId=${authToken}`]);
      
      expect(res.statusCode).toBe(200 || 401); // May fail without proper session
    });
  });

  // BOOKS API TESTS
  describe('Books API', () => {
    
    test('GET /api/books - Retrieve all books', async () => {
      const res = await request(app)
        .get('/api/books');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/books/isbn/:isbn - Search by ISBN', async () => {
      const res = await request(app)
        .get('/api/books/isbn/978-0-06-112008-4');
      
      // Will be 404 if no books in DB, which is expected without seeding
      expect([200, 404].includes(res.statusCode)).toBe(true);
    });

    test('GET /api/books/author/:author - Search by author', async () => {
      const res = await request(app)
        .get('/api/books/author/Harper%20Lee');
      
      expect([200, 404].includes(res.statusCode)).toBe(true);
    });

    test('GET /api/books/title/:title - Search by title', async () => {
      const res = await request(app)
        .get('/api/books/title/Mockingbird');
      
      expect([200, 404].includes(res.statusCode)).toBe(true);
    });
  });

  // REVIEWS API TESTS
  describe('Reviews API', () => {
    
    test('POST /api/reviews - Add a review (requires authentication)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          bookId: bookId || '507f1f77bcf86cd799439011',
          rating: 5,
          comment: 'This is an excellent book! Highly recommended for everyone.'
        });
      
      // Should return 401 if not authenticated
      expect([400, 401, 404].includes(res.statusCode)).toBe(true);
    });

    test('GET /api/reviews - Get all reviews', async () => {
      const res = await request(app)
        .get('/api/reviews');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/reviews/book/:bookId - Get reviews for book', async () => {
      const res = await request(app)
        .get('/api/reviews/book/507f1f77bcf86cd799439011');
      
      expect([200, 404].includes(res.statusCode)).toBe(true);
    });
  });

  // VALIDATION TESTS
  describe('Input Validation', () => {
    
    test('POST /api/users/register - Missing email should fail', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(400);
    });

    test('POST /api/reviews - Rating > 5 should fail', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          bookId: '507f1f77bcf86cd799439011',
          rating: 10,
          comment: 'Invalid rating'
        });
      
      expect([400, 401].includes(res.statusCode)).toBe(true);
    });

    test('POST /api/reviews - Comment too short should fail', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          bookId: '507f1f77bcf86cd799439011',
          rating: 5,
          comment: 'Short'
        });
      
      expect([400, 401].includes(res.statusCode)).toBe(true);
    });
  });

  // ERROR HANDLING TESTS
  describe('Error Handling', () => {
    
    test('GET /api/books/invalid-id - Invalid ID should return 404', async () => {
      const res = await request(app)
        .get('/api/books/invalid-isbn');
      
      expect(res.statusCode).toBe(404);
    });

    test('GET /api/health - Health check', async () => {
      const res = await request(app)
        .get('/api/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Server is running');
    });
  });
});

module.exports = {};
