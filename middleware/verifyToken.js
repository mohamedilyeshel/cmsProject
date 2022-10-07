const jwt = require("jsonwebtoken");
const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

module.exports = async function (req, res, next) {
  const logId = req.headers.authorization;
  if (!logId) {
    return res.status(401).json("User must be logged In");
  }

  try {
    const validLogId = await redis.get(logId);

    if (!validLogId) {
      return res.status(403).json("Invalid logId");
    }

    const verifiedUser = jwt.verify(validLogId, process.env.TOKEN_KEY);
    req.verifiedUser = verifiedUser; // tkhalik you can pass el token maa el request bech tekhou acces lel les données li mawjoudin fil payload
    next(); // middlewares are function that can be executed in middle of work then do the next function to execute and complete the normal funciton
  } catch (err) {
    return res.status(403).json("Invalid token");
  }
};
