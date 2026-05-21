import express from "express";
import Redis from "ioredis";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());
const redis = new Redis();

app.post("/email", async (req, res) => {
  const jobData = {
    to: req.body.to,
    name: req.body.name,
  };

  const job = await emailQueue.add("send-email", jobData, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });

  return res.json({ message: "Email job added to the queue", jobId: job.id });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
