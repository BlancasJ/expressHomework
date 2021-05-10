// Modules
const express = require('express');
const router = express.Router();

// Resources
const { BookResources } = require('../resources');

// All routes
router.use('/books', BookResources);

module.exports = router;
