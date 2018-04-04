const express = require('express');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');

function router(nav) {
  const url = 'mongodb://localhost:27017';
  const dbName = 'libraryApp';

  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to the server');
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = { username, password };
          const result = await col.insertOne(user);
          req.login(result.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          debug(error.stack);
        }
      }());
    });

  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('signInView', { nav, title: 'Sign In' });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;
