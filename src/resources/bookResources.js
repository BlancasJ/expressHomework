// Modules
const express = require('express');
const BookResources = express.Router();

// Controllers
const { BookController } = require('../controllers');

// All book resources
BookResources.get('/', BookController.getAll);
BookResources.post('/', BookController.addBook);
BookResources.get('/:guid', BookController.getByGuid);
BookResources.put('/:guid', BookController.updateBook);
BookResources.delete('/:guid', BookController.deleteBook);

module.exports = BookResources;