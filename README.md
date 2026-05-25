# Book Store RESTful API

A Node.js and Express.js based RESTful web service for managing books, ratings, and reviews in an online bookstore.

## Features

✅ Retrieve all books in the bookshop  
✅ Search for books by ISBN, author, or title  
✅ Retrieve reviews/comments for specific books  
✅ User registration and authentication (Session & JWT)  
✅ Add, modify, and delete reviews (for logged-in users)  
✅ Multiple concurrent users access with async/await  
✅ Secure review management (users can only modify/delete their own reviews)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Session + JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Middleware**: CORS, Body Parser
- **Environment**: dotenv

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Oluwadamilola04/Book-Store.git
   cd Book-Store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   NODE_ENV=development
   PORT=5000
   SESSION_SECRET=your-session-secret-key
   JWT_SECRET=your-jwt-secret-key
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

### Books

#### Get All Books
```
GET /api/books
Response: Array of all books
```

#### Search Book by ISBN
```
GET /api/books/isbn/:isbn
Example: GET /api/books/isbn/978-0-06-112008-4
```

#### Search Books by Author
```
GET /api/books/author/:author
Example: GET /api/books/author/Harper%20Lee
```

#### Search Books by Title
```
GET /api/books/title/:title
Example: GET /api/books/title/Mockingbird
```

#### Get Book with Reviews
```
GET /api/books/:id/reviews
Returns: Book details with all associated reviews and average rating
```

### Users

#### Register New User
```
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: User created successfully with user ID
```

#### Login (Session-based)
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User (Requires Authentication)
```
GET /api/users/me
Headers: 
  - Cookie: (session cookie from login)
  - Authorization: Bearer <jwt_token> (if using JWT)
```

#### Logout
```
POST /api/users/logout
Headers: Cookie: (session cookie)
```

### Reviews

#### Get All Reviews
```
GET /api/reviews
```

#### Get Reviews for a Specific Book
```
GET /api/reviews/book/:bookId
Example: GET /api/reviews/book/1

Response includes:
- Book details
- All reviews for the book
- Total number of reviews
- Average rating
```

#### Add a New Review (Requires Authentication)
```
POST /api/reviews
Headers:
  - Cookie: (session cookie from login)
  - Content-Type: application/json

Body:
{
  "bookId": 1,
  "rating": 5,
  "comment": "Excellent book! Highly recommended."
}

Response: Newly created review with review ID
```

#### Modify a Review (Requires Authentication - User's own review only)
```
PUT /api/reviews/:reviewId
Headers:
  - Cookie: (session cookie)
  - Content-Type: application/json

Body:
{
  "rating": 4,
  "comment": "Updated review comment"
}

Note: User can only modify their own reviews
```

#### Delete a Review (Requires Authentication - User's own review only)
```
DELETE /api/reviews/:reviewId
Example: DELETE /api/reviews/1

Note: User can only delete their own reviews
```

#### Get User's Own Reviews (Requires Authentication)
```
GET /api/reviews/user/my-reviews
Headers: Cookie: (session cookie)
```

## Authentication

### Session-based Authentication
- User logs in and receives a session cookie
- Cookie is automatically sent with subsequent requests
- Session expires after 24 hours

### JWT Authentication (Alternative)
- User logs in and receives a JWT token
- Include token in Authorization header: `Authorization: Bearer <token>`
- Token expires after 24 hours

## Testing with cURL/Postman

### Example: Register and Add Review

1. **Register a user**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"username":"alice","email":"alice@example.com","password":"pass123"}'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"pass123"}' \
     -c cookies.txt
   ```

3. **Get all books**
   ```bash
   curl http://localhost:5000/api/books
   ```

4. **Add a review** (requires session cookie)
   ```bash
   curl -X POST http://localhost:5000/api/reviews \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{"bookId":1,"rating":5,"comment":"Amazing book!"}'
   ```

## Concurrency & Async Operations

All database operations use async/await to ensure:
- Multiple users can access the API simultaneously
- Operations don't block each other
- Better performance under load

## Project Structure

```
book-store/
├── server.js              # Main Express server
├── db.js                  # In-memory database
├── .env                   # Environment configuration
├── .gitignore             # Git ignore file
├── package.json           # Dependencies
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   ├── books.js           # Book endpoints
│   ├── users.js           # User registration/login
│   └── reviews.js         # Review CRUD endpoints
└── README.md              # This file
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authorization failed
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Future Enhancements

- Replace in-memory database with MongoDB/PostgreSQL
- Add input validation with Joi/express-validator
- Implement rate limiting
- Add comprehensive error logging
- Create unit and integration tests
- Deploy to production (Heroku, AWS, etc.)
- Implement password reset functionality
- Add email verification for registration

## License

MIT

## Author

Oluwadamilola04
