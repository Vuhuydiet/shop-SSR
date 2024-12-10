const { UnauthorizedError } = require("../../core/ErrorResponse");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
};

const isAuthenicatedReturnsErrror = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  throw new UnauthorizedError('User is not authenticated');
}

// Middleware to check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isAuthenicatedReturnsErrror
};
