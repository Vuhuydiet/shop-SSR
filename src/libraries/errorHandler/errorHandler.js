const { z } = require("zod");
const { RequestError } = require("../../core/ErrorResponse.js");

const errorHandler = (err, _req, res, _next) => {
  console.error(`ERROR HANDLER:\n ${err}`);
  console.error(err);  
  if (!(err instanceof RequestError)) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    error: err.error,
  });
};

module.exports = errorHandler;
