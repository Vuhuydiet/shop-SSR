const SuccessStatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

const SuccessMessage = {
  OK: 'OK',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
};

/*

type SuccessObject = {
  statusCode: number;
  message: string;
  metadata?: any;
};
*/


class SuccessResponse {
  constructor({
    statusCode = SuccessStatusCode.OK,
    message = SuccessMessage.OK,
    metadata,
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.metadata = metadata;
  }

  send(res) {
    res.status(this.statusCode).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}

class OKResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      statusCode: SuccessStatusCode.OK,
      message: message || SuccessMessage.OK,
      metadata,
    });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      statusCode: SuccessStatusCode.CREATED,
      message: message || SuccessMessage.CREATED,
      metadata,
    });
  }
}

class AcceptedResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      statusCode: SuccessStatusCode.ACCEPTED,
      message: message || SuccessMessage.ACCEPTED,
      metadata,
    });
  }
}

class NoContentResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      statusCode: SuccessStatusCode.NO_CONTENT,
      message: message || SuccessMessage.NO_CONTENT,
      metadata,
    });
  }
}

module.exports = {
  SuccessResponse,
  OKResponse,
  CreatedResponse,
  AcceptedResponse,
  NoContentResponse,
};
