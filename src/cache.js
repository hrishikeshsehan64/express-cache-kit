const store = require("./cacheStore");
const { defaultKeyGenerator } = require("./cacheKey");

function cache(options = {}) {
  if (typeof options === "number") {
    options = {
      ttl: options
    };
  }

  const {
    ttl = 60,
        methods = ["GET"],
        maxSize,
        keyGenerator = defaultKeyGenerator
  } = options;

  if (typeof ttl !== "number" || ttl <= 0) {
    throw new Error("ttl must be a positive number");
  }

  if (maxSize !== undefined) {
    store.setMaxSize(maxSize);
  }

  return function cacheMiddleware(req, res, next) {
    
    if (!methods.includes(req.method)) {
      return next();
    }

    if (req.headers.authorization) {
      return next();
    }

    const key = keyGenerator(req);

    const cachedResponse = store.get(key);

    if (cachedResponse !== undefined) {
      res.set("X-Cache", "HIT");

      res.status(cachedResponse.status);

      for (const [header, value] of Object.entries(
        cachedResponse.headers
      )) {
        res.set(header, value);
      }

      return res.send(cachedResponse.body);
    }

    res.set("X-Cache", "MISS");

    
    const originalJson = res.json.bind(res);

    res.json = function (body) {
    
      if (res.statusCode >= 400) {
        return originalJson(body);
      }

      
      if (body === undefined) {
        return originalJson(body);
      }

      const headers = {};

      if (res.getHeader("Content-Length")) {
        headers["Content-Length"] = res.getHeader("Content-Length");
      }

      if (res.getHeader("Content-Type")) {
        headers["Content-Type"] = res.getHeader("Content-Type");
      }

      store.set(key, {
        status: res.statusCode,
        headers,
        body
      }, ttl);

      return originalJson(body);
    };

    next();
  };
}

module.exports = cache;