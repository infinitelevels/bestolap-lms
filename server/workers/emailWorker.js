import { Worker } from "bullmq";
import IORedis from "ioredis";
import sendEmail from "../utils/emailService.js";
import logger from "../config/logger.js";

const connection = new IORedis(process.env.REDIS_URL);

const worker = new Worker(
  "emailQueue",
  async job => {
    await sendEmail(job.data);
  },
  { connection }
);

const ioredis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  retryStrategy: () => null // ❌ stop infinite retries
});

worker.on("completed", job => {
  logger.info(`Email job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  logger.error(`Email job failed: ${err.message}`);
});
