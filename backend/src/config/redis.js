/**
 * Redis client with graceful fallback
 * If Redis is unavailable, caching is disabled transparently
 */
const Redis = require("ioredis");
const logger = require("../utils/logger");

let redisClient = null;
let isConnected = false;

const initRedis = () => {
  if (!process.env.REDIS_URL) {
    logger.warn("⚠️  REDIS_URL not set. Caching disabled.");
    return null;
  }

  const client = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) return null; // stop retrying
      return Math.min(times * 200, 2000);
    },
  });

  client.on("connect", () => {
    isConnected = true;
    logger.info("✅ Redis connected");
  });

  client.on("error", (err) => {
    isConnected = false;
    logger.warn(`Redis error (caching disabled): ${err.message}`);
  });

  client.connect().catch(() => {});
  return client;
};

redisClient = initRedis();

/**
 * Get a cached value
 * @param {string} key
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
  if (!redisClient || !isConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Set a cached value with optional TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds - default 5 minutes
 */
const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisClient || !isConnected) return;
  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // silent fail
  }
};

/**
 * Delete a cached key or pattern
 * @param {string} key
 */
const deleteCache = async (key) => {
  if (!redisClient || !isConnected) return;
  try {
    await redisClient.del(key);
  } catch {
    // silent fail
  }
};

/**
 * Delete all keys matching a pattern
 * @param {string} pattern
 */
const deleteCachePattern = async (pattern) => {
  if (!redisClient || !isConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(...keys);
  } catch {
    // silent fail
  }
};

module.exports = { getCache, setCache, deleteCache, deleteCachePattern };
