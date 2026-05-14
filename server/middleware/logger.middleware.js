const morgan = require("morgan");

module.exports = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    `duration=${tokens['response-time'](req, res)}`,
  ].join(" ");
});

