const express = require('express');
const app = express();
const cors = require('cors');

require('express-async-errors');

// import middlewares and routes
const router = require('./components/index.js');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', router);

// error handler
router.use((_req, _res) => {
  throw new NotFoundError('Resource not found');
});

app.use((err, _req, res, _next) => {
  res.status(500).json(err);
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});