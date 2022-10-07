const { sendEmail } = require("../jobs/sendEmail");
const { registerAccount } = require("../jobs/registerUser");
const { forgotPasswordJob } = require("../jobs/forgotPasswordEmail");
const { resetPass } = require("../jobs/resetPassword");
const { Worker } = require("bullmq");
const {
  EMAIL_QUEUE,
  SEND_EMAIL_JOB,
  REGISTER_NEW_USER,
  FORGOT_PASSWORD_JOB,
  RESET_PASSWORD,
} = require("../constants/constants");
const mongoose = require("mongoose");
require("dotenv").config();

const sendEmailWorker = new Worker(
  EMAIL_QUEUE,
  async (job) => {
    mongoose.connect(process.env.MONGODB_URL);
    mongoose.connection.on("connected", async () => {
      console.log("Connection with db good");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Connection with db failed", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Connection with db failed");
    });

    switch (job.name) {
      case RESET_PASSWORD:
        resetPass(job.data);
        break;
      case SEND_EMAIL_JOB:
        sendEmail(job.data);
        break;
      case REGISTER_NEW_USER:
        registerAccount(job.data);
        break;
      case FORGOT_PASSWORD_JOB:
        forgotPasswordJob(job.data);
        break;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASS,
    },
  }
);

sendEmailWorker.on("completed", (job) => {
  console.log(`${job.name} is completed`);
});

sendEmailWorker.on("failed", (job) => {
  console.log(`${job.name} has been failed`);
});
