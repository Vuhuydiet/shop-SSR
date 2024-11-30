const ErrorStatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

const ErrorMessage = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

/*

type ErrorObject = {
  statusCode: ErrorStatusCode;
  message: string;
  error?: any;
};

*/

class RequestError extends Error {
  constructor({
    statusCode = ErrorStatusCode.INTERNAL_SERVER_ERROR,
    message = ErrorMessage.INTERNAL_SERVER_ERROR,
    error
  }) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

class NotFoundError extends RequestError {
  constructor({ message = ErrorMessage.NOT_FOUND, error }) {
    super({ statusCode: ErrorStatusCode.NOT_FOUND, message, error });
  }
}

class BadRequestError extends RequestError {
  constructor({ message = ErrorMessage.BAD_REQUEST, error }) {
    super({ statusCode: ErrorStatusCode.BAD_REQUEST, message, error });
  }
}

class UnauthorizedError extends RequestError {
  constructor({ message= ErrorMessage.UNAUTHORIZED, error }) {
    super({ statusCode: ErrorStatusCode.UNAUTHORIZED, message, error });
  }
}

class ForbiddenError extends RequestError {
  constructor({ message = ErrorMessage.FORBIDDEN, error }) {
    super({ statusCode: ErrorStatusCode.FORBIDDEN, message, error });
  }
}

class InternalServerError extends RequestError {
  constructor({ message = ErrorMessage.INTERNAL_SERVER_ERROR, error }) {
    super({ statusCode: ErrorStatusCode.INTERNAL_SERVER_ERROR, message, error });
  }
}

module.exports = {
  RequestError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
