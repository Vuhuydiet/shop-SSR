const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

require('express-async-errors');

// import middlewares and routes
const router = require('./components');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'components/layout');


// routes
app.use('/', router);

// error handler
app.use('*', (_req, _res, next) => {
  const err = new Error('Resource not found');
  err.status = 404;
  next(err);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json(err);
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});