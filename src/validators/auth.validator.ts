import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("name").notEmpty(),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").notEmpty(),
];
