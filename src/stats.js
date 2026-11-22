const store = require("./cacheStore");

function getCacheStats() {
  return store.getStats();
}

function resetCacheStats() {
  store.resetStats();
}

module.exports = {getCacheStats,resetCacheStats};