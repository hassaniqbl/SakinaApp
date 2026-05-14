class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const isHttpError = (e) => e && typeof e.statusCode === "number";

module.exports = { HttpError, isHttpError };

