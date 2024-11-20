const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const app = express();

require("express-async-errors");

// import middlewares and routes
const router = require('./components');
const errorHandler = require('./libraries/errorHandler/errorHandler');
const notFoundHandler = require('./libraries/errorHandler/notFoundHandler');
const morgan = require("morgan");

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "components/layout");

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
// Set user variable in response locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// routes
app.use("/", router);
// error handler
app.use("*", (_req, _res, next) => {
  const err = new Error("Resource not found");
  err.status = 404;
  next(err);
});

// error handler
app.use('*', notFoundHandler);
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
