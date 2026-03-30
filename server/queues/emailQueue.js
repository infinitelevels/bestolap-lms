import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL);

const ioredis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  retryStrategy: () => null // ❌ stop infinite retries
});

export const emailQueue = new Queue("emailQueue", { connection });
