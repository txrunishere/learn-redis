import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phone), otp, "EX", 60); // OTP expires in 60 seconds
  return res.json({ message: "OTP sent", otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  if (otp.length !== 6) {
    return res.status(400).json({ message: "Invalid OTP format" });
  }

  const storedOtp = await redis.get(otpKey(phone));

  if (!storedOtp) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (storedOtp === otp) {
    await redis.del(otpKey(phone));
    return res.json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));
  return res.json({ ttl });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
