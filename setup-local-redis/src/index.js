import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis("redis://localhost:6379");
const PORT = 8080;

app.get("/redis-ping", async (req, res) => {
  const reply = await redis.ping();
  return res.json({
    message: `Redis replied with ${reply}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
