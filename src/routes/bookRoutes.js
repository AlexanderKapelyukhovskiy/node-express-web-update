const express = require('express');
const debug = require('debug')('app:bookRoutes');
const { MongoClient, ObjectID } = require('mongodb');

const routes = (nav) => {
  const booksRouter = express.Router();
  const url = 'mongodb://localhost:27017';
  const dbName = 'libraryApp';

  booksRouter.route('/')
    .get((req, res) => {
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          const db = client.db(dbName);

          const col = await db.collection('books');
          const books = await col.find().toArray();

          res.render('bookListView', { nav, title: 'Books', books });
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });

  booksRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          const db = client.db(dbName);

          const col = await db.collection('books');
          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);

          res.render('bookView', { nav, title: 'Book', book });
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });

  return booksRouter;
};

module.exports = routes;
