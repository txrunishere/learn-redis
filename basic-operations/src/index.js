import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis("redis://localhost:6379");

const MESSAGE_KEY = "app:message";

app.post("/message", async (req, res) => {
  const message = await redis.set(MESSAGE_KEY, req.body.message || "Welcome!");
  console.log(message);
  return res.json({
    success: true,
  });
});

app.get("/message", async (req, res) => {
  const message = await redis.get(MESSAGE_KEY);
  if (!message) {
    return res.json({
      message: "Message not found",
    });
  }

  return res.json({
    message,
  });
});

app.delete("/message", async (req, res) => {
  const response = await redis.del(MESSAGE_KEY);
  console.log(response);
  return res.json({
    deleted: Boolean(response),
  });
});

app.get("/message/exists", async (req, res) => {
  const result = await redis.exists(MESSAGE_KEY);
  console.log(result);
  return res.json({
    exists: Boolean(result),
  });
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
