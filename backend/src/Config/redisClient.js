const { createClient } = require('redis');
const { REDIS_URL } = require('../secret');

const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on('error', (err) => {
  console.log(' Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log(' Redis connected successfully');
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;