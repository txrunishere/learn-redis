import { Worker } from "bullmq";
import { connection, emailQueue } from "./queue.js";

export const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Completed job ${job.id}`);
  },
  {
    connection,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.name}(${job.id}) completed successfully.`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.name}(${job.id}) failed with error:`, err);
});
