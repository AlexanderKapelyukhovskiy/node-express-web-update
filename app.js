const express = require('express');
const chalk = require('chalk').default;
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const navs = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }];

const booksRouter = require('./src/routes/bookRoutes')(navs);
const adminRouter = require('./src/routes/adminRoutes')(navs);

app.use('/books', booksRouter);
app.use('/admin', adminRouter);


app.get('/', (req, res) => {
  res.render('index', { navs, title: 'My Library' });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
