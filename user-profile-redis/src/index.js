import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis("redis://localhost:6379");

// store objects in JSON and HASH format in Redis

app.post("/users/:id/json", async (req, res) => {
  await redis.set(
    `users:${req.params.id}:json`,
    JSON.stringify(req.body),
    "EX",
    30,
  );
  return res.json({ message: "User profile stored in JSON format" });
});

app.get("/users/:id/json", async (req, res) => {
  const userData = await redis.get(`users:${req.params.id}:json`);
  return res.json({ user: userData ? JSON.parse(userData) : null });
});

app.post("/users/:id/hash", async (req, res) => {
  await redis.hset(`users:${req.params.id}:hash`, req.body);
  return res.json({ message: "User profile stored in HASH format" });
});

app.get("/users/:id/hash", async (req, res) => {
  const userData = await redis.hgetall(`users:${req.params.id}:hash`);
  const email = await redis.hget(`users:${req.params.id}:hash`, "email");
  console.log("Email:", email);
  return res.json({ user: userData });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
