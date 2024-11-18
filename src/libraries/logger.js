const winston = require("winston");
const { format } = winston;

// Custom format for timestamps and pretty printing
const customFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
  format.prettyPrint()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  defaultMeta: { service: "user-service" },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

// Example usage:
// logger.error('Error message', { error: err });
// logger.warn('Warning message', { data: someData });
// logger.info('Info message', { userId: 123 });
// logger.debug('Debug message', { query: dbQuery });

module.exports = logger;
