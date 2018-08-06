const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
/* eslint-enable */

const webpackConfig = require('../webpack.config');

// models
const models = require('./models');

// routes
const indexRouter = require('./routes/index');
const apiTodosRouter = require('./routes/apiTodos');

const compiler = webpack(webpackConfig);

const app = express();

// Sync Database
models.sequelize.sync().then(() => {
  console.log('Database connected!');
}).catch((error) => {
  console.log(error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views/templates'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// webpack HMR
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  stats: 'errors-only',
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

// register routes
app.use('/', indexRouter);
app.use('/api/todos', apiTodosRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
