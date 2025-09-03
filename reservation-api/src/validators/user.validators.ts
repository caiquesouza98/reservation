import { body } from "express-validator";

export const registerUserValidator = [
  body("name").isString().trim().isLength({ min: 2, max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
];
