const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils/httpError");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid Authorization header"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { user_id, user_role, ... }
    return next();
  } catch (e) {
    return next(new HttpError(401, "Invalid/expired token"));
  }
}

module.exports = { authMiddleware };

