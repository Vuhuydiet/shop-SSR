const { NotFoundError } = require("../../core/ErrorResponse");

function notFoundHandler(req, _res) {
  throw new NotFoundError(`Resource not found: ${req.method} ${req.originalUrl}`);
}

module.exports = notFoundHandler;