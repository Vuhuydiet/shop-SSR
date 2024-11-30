const { NotFoundError } = require("../../core/ErrorResponse");

function notFoundHandler(req, _res) {
  throw new NotFoundError({ message: `Resource not found: ${req.method} ${req.originalUrl}` });
}

module.exports = notFoundHandler;