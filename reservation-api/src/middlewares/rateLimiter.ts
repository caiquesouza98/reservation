import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});

export default limiter;
