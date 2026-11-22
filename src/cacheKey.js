function defaultKeyGenerator(req) {
  return `${req.method}:${req.originalUrl}`;
}

module.exports = {defaultKeyGenerator};