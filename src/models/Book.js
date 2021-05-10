// Modules 
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { readFile, writeFile } = require('./handlers/fs_functions');

// Path to books.json
const p = path.join(path.dirname(require.main.filename), 'data', 'books.json');

function Book(data) {
  const { title, author, pubYear, tags } = data;
  this.title = title;
  this.author = author;
  this.pubYear = pubYear;
  this.tags = tags;
  this.guid = uuidv4();
}

Book.prototype.getGuid = function() {
  return this.guid;
}

Book.prototype.addNewBook = async function() {
  const books = JSON.parse(await readFile(p, 'utf-8'));
  books.push(this);
  await writeFile(p, JSON.stringify(books), 'utf-8');
}

Book.getAll = async () => {
  const books = JSON.parse(await readFile(p, 'utf-8'));
  return books;
};

Book.update = async (books) => {
  await writeFile(p, JSON.stringify(books), 'utf-8');
}

module.exports = Book;