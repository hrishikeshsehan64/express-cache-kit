const store = require("./cacheStore");

function clearCache(key) {
  if (key === undefined) {
    store.clear();
    return;
  }

  store.remove(key);
}

module.exports = clearCache;