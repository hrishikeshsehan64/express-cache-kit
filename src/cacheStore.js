const cache = new Map();

let stats = {
  hits: 0,
  misses: 0,
  evictions: 0
};

let maxSize = 1000;

function setMaxSize(size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("maxSize must be a positive integer");
  }

  maxSize = size;
}

function set(key, value, ttl) {
  if (cache.has(key)) {
    cache.delete(key);
  }

  // Remove oldest entry when cache is full
  if (cache.size >= maxSize) {
    const oldestKey = cache.keys().next().value;

    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
      stats.evictions++;
    }
  }

  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl * 1000
  });
}

function get(key) {
  const entry = cache.get(key);

  if (!entry) {
    stats.misses++;
    return undefined;
  }

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    stats.misses++;
    return undefined;
  }

  // Move entry to end (LRU behavior)
  cache.delete(key);
  cache.set(key, entry);

  stats.hits++;
  return entry.value;
}

function remove(key) {
  return cache.delete(key);
}

function clear() {
  cache.clear();
}

function getStats() {
  const totalRequests = stats.hits + stats.misses;

  return {
    ...stats,
    size: cache.size,
    maxSize,
    hitRate:
      totalRequests === 0
        ? 0
        : Number((stats.hits / totalRequests).toFixed(2))
  };
}

function resetStats() {
  stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };
}

module.exports = {set,get,remove,clear,getStats,resetStats,setMaxSize}; 