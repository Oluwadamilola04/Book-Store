// In-memory database storage
// In production, this would be replaced with a real database (MongoDB, PostgreSQL, etc.)

const books = [
  {
    id: 1,
    isbn: '978-0-06-112008-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence',
    publicationYear: 1960
  },
  {
    id: 2,
    isbn: '978-0-451-52493-2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel about totalitarianism',
    publicationYear: 1949
  },
  {
    id: 3,
    isbn: '978-0-7432-7356-5',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel of the Jazz Age',
    publicationYear: 1925
  },
  {
    id: 4,
    isbn: '978-0-19-283459-9',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners and marriage',
    publicationYear: 1813
  },
  {
    id: 5,
    isbn: '978-0-14-118277-8',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A fantasy adventure of a hobbit\'s unexpected journey',
    publicationYear: 1937
  }
];

const users = [];

const reviews = [];

module.exports = {
  books,
  users,
  reviews
};
