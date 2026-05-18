function authMiddleware(req, res, next) {
  // Auth is fully disabled for now (public APIs for testing).
  return next();
}

module.exports = { authMiddleware };


