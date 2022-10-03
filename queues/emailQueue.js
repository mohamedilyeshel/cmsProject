const { Queue } = require("bullmq");
const { EMAIL_QUEUE } = require("../constants/constants");

module.exports.emailQueue = new Queue(EMAIL_QUEUE, {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
