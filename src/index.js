const cache = require("./cache");
const clearCache = require("./invalidation");

const {
  getCacheStats,
  resetCacheStats
} = require("./stats");

const { setMaxSize } = require("./cacheStore");

module.exports = {cache,clearCache,getCacheStats,resetCacheStats,setMaxSize};