import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis("redis://localhost:6379");

const EMAIL_QUEUE_KEY = "queue:emails";

app.post("/email/enqueue", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(EMAIL_QUEUE_KEY, JSON.stringify(job));
  res.status(200).json({ message: "Email job enqueued successfully", job });
});

app.get("/email/dequeue", async (req, res) => {
  const jobData = await redis.rpop(EMAIL_QUEUE_KEY);

  if (!jobData) {
    return res.status(200).json({ message: "No email jobs in the queue" });
  }

  const job = JSON.parse(jobData);
  res.status(200).json({ message: "Email job dequeued successfully", job });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

/**
 * primary cons of use redis as a queue:
 * -> No Built-in Retry or Dead Letter Queues
 * -> Single-Threaded Bottleneck / synchronous processing
 * -> Data Loss if job is dequeued but not processed successfully
 */
