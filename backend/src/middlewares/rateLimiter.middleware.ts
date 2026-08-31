import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives, veuillez réessayer dans 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
