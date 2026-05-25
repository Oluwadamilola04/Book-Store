# API Testing Guide - cURL Examples

This guide provides cURL commands to test all endpoints of the Book Store API.

## Prerequisites
- Server running on `http://localhost:5000`
- cURL installed on your system

---

## 1. HEALTH CHECK

### Test Server Status
```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{"message":"Server is running"}
```

---

## 2. BOOKS ENDPOINTS

### Get All Books
```bash
curl http://localhost:5000/api/books
```

### Search Book by ISBN
```bash
curl "http://localhost:5000/api/books/isbn/978-0-06-112008-4"
```

### Search Books by Author
```bash
curl "http://localhost:5000/api/books/author/Harper%20Lee"
```

### Search Books by Title
```bash
curl "http://localhost:5000/api/books/title/Gatsby"
```

### Get Book with Reviews
```bash
curl http://localhost:5000/api/books/1/reviews
```

---

## 3. USER AUTHENTICATION

### Register New User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login (Session-based)
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }' \
  -c cookies.txt
```

**Important:** `-c cookies.txt` saves the session cookie to a file for subsequent requests.

Response includes a JWT token:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Get Current User (Requires Session)
```bash
curl http://localhost:5000/api/users/me \
  -b cookies.txt
```

### Login with JWT (Alternative)
```bash
curl -X POST http://localhost:5000/api/users/login-jwt \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

Save the token from the response and use it in the Authorization header:
```bash
curl http://localhost:5000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Logout
```bash
curl -X POST http://localhost:5000/api/users/logout \
  -b cookies.txt
```

---

## 4. REVIEWS ENDPOINTS

### Get All Reviews
```bash
curl http://localhost:5000/api/reviews
```

### Get Reviews for Specific Book
```bash
curl http://localhost:5000/api/reviews/book/1
```

Response includes book details, all reviews, and average rating:
```json
{
  "book": {
    "id": 1,
    "isbn": "978-0-06-112008-4",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "description": "A gripping tale of racial injustice and childhood innocence",
    "publicationYear": 1960
  },
  "reviews": [...],
  "totalReviews": 2,
  "averageRating": "4.50"
}
```

### Add a New Review (Requires Authentication)
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bookId": 1,
    "rating": 5,
    "comment": "Absolutely fantastic book! A must-read."
  }'
```

### Modify a Review (User's own review only)
```bash
curl -X PUT http://localhost:5000/api/reviews/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "rating": 4,
    "comment": "Updated comment - still great but not perfect."
  }'
```

### Delete a Review (User's own review only)
```bash
curl -X DELETE http://localhost:5000/api/reviews/1 \
  -b cookies.txt
```

### Get User's Own Reviews (Requires Authentication)
```bash
curl http://localhost:5000/api/reviews/user/my-reviews \
  -b cookies.txt
```

Response:
```json
{
  "username": "john_doe",
  "reviews": [...],
  "totalReviews": 3
}
```

---

## Complete Workflow Example

Follow these steps to test the complete application flow:

### Step 1: Register a New User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice_smith",
    "email": "alice.smith@example.com",
    "password": "alicePassword123"
  }' | jq .
```

### Step 2: Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.smith@example.com",
    "password": "alicePassword123"
  }' \
  -c cookies.txt | jq .
```

### Step 3: View All Books
```bash
curl http://localhost:5000/api/books | jq .
```

### Step 4: Search Books by Title
```bash
curl "http://localhost:5000/api/books/title/Mockingbird" | jq .
```

### Step 5: Add a Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bookId": 1,
    "rating": 5,
    "comment": "An absolute masterpiece of American literature!"
  }' | jq .
```

### Step 6: View Book Reviews
```bash
curl http://localhost:5000/api/reviews/book/1 | jq .
```

### Step 7: Get Your Reviews
```bash
curl http://localhost:5000/api/reviews/user/my-reviews \
  -b cookies.txt | jq .
```

### Step 8: Update Your Review
```bash
curl -X PUT http://localhost:5000/api/reviews/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "rating": 4,
    "comment": "Updated review - still excellent but minor issues."
  }' | jq .
```

### Step 9: Logout
```bash
curl -X POST http://localhost:5000/api/users/logout \
  -b cookies.txt
```

---

## Tips for Testing

1. **Pretty Print JSON**: Add `| jq .` at the end of any command to format JSON output nicely (requires `jq` to be installed)

2. **Save Cookies**: Use `-c cookies.txt` when logging in to save session cookies
   Use `-b cookies.txt` in subsequent requests to use the saved session

3. **JWT Token Usage**: After logging in with JWT, save the token:
   ```bash
   TOKEN=$(curl -X POST http://localhost:5000/api/users/login-jwt \
     -H "Content-Type: application/json" \
     -d '{"email":"alice.smith@example.com","password":"alicePassword123"}' \
     -s | jq -r '.token')
   
   # Use the token in subsequent requests
   curl http://localhost:5000/api/users/me \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Multiple Users**: Register multiple users and test concurrent review operations

5. **Error Testing**: Try these to test error handling:
   - Modify/delete reviews you didn't create (should get 403 Forbidden)
   - Login with wrong password (should get 401 Unauthorized)
   - Add review without logging in (should get 401 Unauthorized)

---

## Testing with Postman

1. Import the collection from the `postman_collection.json` file
2. Set up environment variables for `base_url` and `token`
3. Use the pre-configured requests with proper authentication

Or manually create requests in Postman:
- **Base URL**: `http://localhost:5000/api`
- **Authentication**: Select "Cookie" and load from cookies.txt, or use "Bearer Token" for JWT

---

## Expected Status Codes

- `200 OK` - Successful GET
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Invalid input/validation error
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authorized but not allowed (e.g., modifying someone else's review)
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error
