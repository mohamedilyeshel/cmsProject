const { Queue } = require("bullmq");
const { EMAIL_QUEUE } = require("../constants/constants");
require("dotenv").config();

module.exports.emailQueue = new Queue(EMAIL_QUEUE, {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
