const { isHttpError } = require("../utils/httpError");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = isHttpError(err) ? err.statusCode : 500;

  const payload = isHttpError(err)
    ? errorResponse(err.message || "Something went wrong", err.details || err)
    : errorResponse("Something went wrong", {
        message: err?.message,
        code: err?.code,
        sqlMessage: err?.sqlMessage,
      });

  // Always log the full error object for server-side debugging
  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json(payload);
};

