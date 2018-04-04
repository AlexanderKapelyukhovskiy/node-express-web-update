const debug = require('debug')('app:bookController');
const { MongoClient, ObjectID } = require('mongodb');

function bookController(bookService, nav) {
  const url = 'mongodb://localhost:27017';
  const dbName = 'libraryApp';

  function getIndex(req, res) {
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
  }

  function getBookById(req, res) {
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

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView', { nav, title: 'Book', book });
      } catch (error) {
        debug(error.stack);
      }
      client.close();
    }());
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  return { getIndex, getBookById, middleware };
}

module.exports = bookController;
