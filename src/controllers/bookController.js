// Modules
const { Book } = require('../models');

// check valid inputs
const hasValidInputs = (data) => {
  const { title, author, pubYear, tags } = data;
  const name = /([A-Z][a-z]+\s?){1,4}/;
  const bookTitle = /\w+/;
  const genres = /[a-z]+/;
  const numbers = /\d{4}/;

  if(!bookTitle.test(title) || !name.test(author) || !numbers.test(pubYear) || !Array.isArray(tags)) return false;
  if( pubYear <= 1454 || pubYear > 2021) return false;
  const filter = tags.find(val => !genres.test(val));
  if(filter) return false;
  return true;
};

// filter books
const getBooksFilt = (books, query) => {
  // indexes will be use to store all indexes which has the values of query parameters
  let indexes = [];
  // count is used to know how many parameters to look are used
  let count = 0;

  // loop over query parameters
  for(const key in query){
    // if parameter is equal year transform it to number
    if(key === 'pubYear') query[key] = Number(query[key]);
    
    // use map over books
    books.map((current, index) => {
      // if parameter is equal tags
      if(key === 'tags'){
        // use include in order to know if tags include the one the user enter, for the moment this only works with one tag
        if(current[key].includes(query[key])){
          // if the current book has the tag then save its index in indexes
          indexes = [...indexes, index];
        }
      } else{
        // if the parameter is not tags just check the values of the current book and the query are equal
        if(current[key] === query[key]){
          // if the current book has the same value to query then save its index in indexes
          indexes = [...indexes, index];
        }
      }
    });
    // count increase by one every time the key change
    count++;

  }
  // sort indexes
  indexes.sort();
  // init val is equal to the first value of indexes
  let initVal = indexes[0];
  // counter is equal to 0
  let counter = 0;
  // array which will have the filtered books
  const filterBooks = indexes.reduce((accum, current) => {
    // if current value is equal to init value
    if(current === initVal){
      // increase counter by 1
      counter++
    } else{
      // otherwise, init value will change its value to be equal to current value
      initVal=current;
      // and counter be one
      counter = 1;
    }
    // if counter is equal to count, it means, if the current index repeats the same number as query parameters inputs
    if(counter >= count){
      // then save the book at that index, this will help save intersections
      accum = [...accum, books[current]];
    }
    return accum;
  }, []);
  // then return filtered books
  return filterBooks;
}

// get book by params
const getByParams = async (req, res) => {
  const { query } = req;
  const books = await Book.getAll();
  const booksFiltered = getBooksFilt(books, query);

  if(booksFiltered.length < 1){
    res.status(404).send({
      message: 'Ups!!! book not found',
    });
    return;
  }
  
  res.status(200).send(booksFiltered);
};

// Get all books
const getAll = async (req, res) => {
  if(Object.keys(req.query).length > 0){
    await getByParams(req, res);
    return;
  }
  const books = await Book.getAll();
  res.status(200).send(books);
};

// get book by id
const getByGuid = async (req, res) => {
  const { guid } = req.params;
  // read all books
  const books = await Book.getAll();
  const book = books.find( ent => ent.guid === guid);
  if(book){
    res.status(200).send(book);
  } else {
    res.status(404).send({
      message: 'Ups!!! Book not found',
    });
  }
};

// add new book to books
const addBook = async (req, res) => {
  const { body } = req;
  // if body has invalid inputs return error
  if(!hasValidInputs(body)){
    res.status(404).send({
      message: 'Ups!!! book not found',
    });
    return;
  }
  // read all books
  const books = await Book.getAll();
  const title = books.find( ent => ent.title === body.title);
  const author = books.find( ent => ent.author === body.author);
  const pubYear = books.find( ent => ent.pubYear === body.pubYear);
  if(title && author && pubYear){
    res.status(404).send({
      message: 'Ups!!! book not found or already exits',
    });
    return;
  }
  // create new instance
  const newBook = new Book(body);
  // save in db
  await newBook.addNewBook();
  res.send({
    message: 'Book succesfully added!!!',
    guid: newBook.getGuid(),
  });
};

// Update an existing book
const updateBook = async (req, res) => {
  const { params: { guid }, body } = req;
  // if body has invalid inputs return error
  if(!hasValidInputs(body)){
    res.status(404).send({
      message: 'Ups!!! book not found',
    });
    return;
  }
  // read all books
  const books = await Book.getAll();
  // filter by guid
  const book = books.find( ent => ent.guid === guid);

  // if book is not found return error
  if(!book){
    res.status(404).send({
      message: 'Ups!!! book not found',
    });
    return;
  }
  // update book
  Object.assign(book, body);
  await Book.update(books);
  res.status(201).send({
    message: 'Book successfully updated!!!',
  });
};

// delete book from books
const deleteBook = async (req, res) => {
  const { guid } = req.params;
  // read all books
  let books = await Book.getAll();
  const bookId = books.findIndex(ent => ent.guid === guid);

  if(bookId !== -1){
    books.splice(bookId, 1);
    await Book.update(books);
    res.status(201).send({
      message: 'Book successfully deleted!!!',
    });
  } else {
    res.status(404).send({
      message: 'Ups!!! Book not found',
    });
  }
};

module.exports = {
  getAll,
  getByGuid,
  getByParams,
  addBook,
  updateBook,
  deleteBook,
}
