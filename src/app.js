const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("./components/accounts/passport");
const flash = require("connect-flash");
const app = express();
const env = require("./config/env");

require("express-async-errors");

// import middlewares and routes
const router = require("./components");
const errorHandler = require("./libraries/errorHandler/errorHandler");
const notFoundHandler = require("./libraries/errorHandler/notFoundHandler");
const morgan = require("morgan");

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "components/layout");

// session middleware
app.use(
  session({
    secret: env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Set user variable in response locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// routes
app.use("/", router);

// error handler
app.use("*", notFoundHandler);
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
