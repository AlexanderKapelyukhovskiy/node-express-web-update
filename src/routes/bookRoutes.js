const express = require('express');

const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');

const routes = (nav) => {
  const { getIndex, getBookById, middleware } = bookController(bookService, nav);

  const booksRouter = express.Router();

  booksRouter.use(middleware);

  booksRouter.route('/').get(getIndex);

  booksRouter.route('/:id').get(getBookById);

  return booksRouter;
};

module.exports = routes;
