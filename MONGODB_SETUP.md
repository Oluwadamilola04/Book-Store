# MongoDB Setup Guide

This project has been upgraded to use **MongoDB** for persistent data storage. Follow this guide to get MongoDB running.

## Option 1: Local MongoDB Installation (Windows)

### Step 1: Download and Install MongoDB Community Edition

1. Go to https://www.mongodb.com/try/download/community
2. Select **Windows**
3. Download the installer (.msi file)
4. Run the installer and follow the setup wizard
5. Select "Install MongoDB as a Service" during installation
6. Complete the installation

### Step 2: Start MongoDB Service

**On Windows:**

MongoDB should start automatically as a Windows service after installation. To verify:

```powershell
# Check if MongoDB is running (Windows)
Get-Service MongoDB | Select-Object Status

# If not running, start it
Start-Service MongoDB
```

Or manually:
```powershell
# Start MongoDB from command line
mongod
```

This will start MongoDB on `mongodb://localhost:27017` (default port).

### Step 3: Verify Connection

Once MongoDB is running, restart the Node.js server:

```bash
npm start
```

You should see in the terminal:
```
MongoDB connected successfully
```

---

## Option 2: MongoDB Atlas (Cloud Database - Recommended for Production)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create an account with your email

### Step 2: Create a Cluster

1. After logging in, click "Create" to create a new cluster
2. Select the free tier (M0 Sandbox)
3. Choose your preferred region
4. Click "Create Cluster"

### Step 3: Get Connection String

1. Click "DATABASES" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version 3.6 or higher
5. Copy the connection string

It will look like:
```
mongodb+srv://username:password@cluster-xxx.mongodb.net/bookstore?retryWrites=true&w=majority
```

### Step 4: Update .env File

Replace your `.env` file's `MONGODB_URI` with the connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster-xxx.mongodb.net/bookstore?retryWrites=true&w=majority
```

Replace `username` and `password` with your MongoDB Atlas credentials.

### Step 5: Restart Server

```bash
npm start
```

You should see:
```
MongoDB connected successfully
```

---

## Verify MongoDB Connection

After starting the server, the following endpoints will now use MongoDB:

- **Register & Login**: `POST /api/users/register`, `POST /api/users/login`
- **Books**: `GET /api/books`, `GET /api/books/isbn/:isbn`
- **Reviews**: `POST /api/reviews`, `GET /api/reviews/book/:bookId`

Data is now **persistent** - it will survive server restarts!

---

## Seed Initial Data

When you first connect to MongoDB, you'll need to populate the initial books. Use this script:

```javascript
// In a terminal or Node.js console:
const mongoose = require('mongoose');
const Book = require('./models/Book');

mongoose.connect('mongodb://localhost:27017/bookstore');

const books = [
  {
    isbn: '978-0-06-112008-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence',
    publicationYear: 1960,
    genre: 'Fiction',
    publisher: 'J.B. Lippincott & Co.',
    pages: 281
  },
  // ... add other books here
];

Book.insertMany(books).then(() => {
  console.log('Books seeded!');
  mongoose.connection.close();
});
```

---

## Troubleshooting

### "MongoNetworkError: Failed to parse server address"
- MongoDB URI is invalid
- Check your connection string in `.env`

### "ECONNREFUSED 127.0.0.1:27017"
- MongoDB is not running locally
- Start MongoDB with `mongod` command
- Or use MongoDB Atlas (cloud) instead

### "authentication failed"
- MongoDB Atlas credentials are wrong
- Check username and password in connection string
- Ensure IP address is whitelisted in MongoDB Atlas

---

## Next Steps

Your application now has:

✅ User authentication with persistent storage  
✅ Book management with MongoDB  
✅ Review system with ratings tracking  
✅ User profiles with review counts  

The data will now persist between server restarts!
