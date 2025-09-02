import { body, param, query } from "express-validator";

export const createReservationValidator = [
  body("room")
    .isString().withMessage("room must be a string")
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage("room is required (1-100 chars)"),
  body("user")
    .isString().withMessage("user must be a string")
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage("user is required (1-100 chars)"),
  body("startDate")
    .isISO8601({ strict: true })
    .withMessage("startDate must be ISO 8601"),
  body("endDate")
    .isISO8601({ strict: true })
    .withMessage("endDate must be ISO 8601")
    .custom((end, { req }) => {
      if (new Date(end) <= new Date(req.body.startDate)) {
        throw new Error("endDate must be after startDate");
      }
      return true;
    }),
];

export const listReservationsValidator = [
  query("room").optional().isString().trim().isLength({ max: 100 }),
  query("user").optional().isString().trim().isLength({ max: 100 }),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("sort")
    .optional()
    .isIn(["startDate", "endDate", "createdAt"])
    .withMessage("sort must be startDate, endDate or createdAt"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),
];

export const cancelReservationValidator = [
  param("id").isInt({ min: 1 }).toInt(),
];

export const updateReservationValidator = [
  param("id").isInt({ min: 1 }).toInt(),
  body("startDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("startDate must be ISO 8601"),
  body("endDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("endDate must be ISO 8601")
    .custom((end, { req }) => {
      if (req.body.startDate && new Date(end) <= new Date(req.body.startDate)) {
        throw new Error("endDate must be after startDate");
      }
      return true;
    }),
];

export const createRecurringReservationValidator = [
  body("room")
    .isString().withMessage("room must be a string")
    .trim().isLength({ min: 1, max: 100 }),
  body("user")
    .isString().withMessage("user must be a string")
    .trim().isLength({ min: 1, max: 100 }),
  body("startDate")
    .isISO8601({ strict: true }).withMessage("startDate must be ISO 8601"),
  body("endDate")
    .isISO8601({ strict: true }).withMessage("endDate must be ISO 8601")
    .custom((end, { req }) => {
      if (new Date(end) <= new Date(req.body.startDate)) {
        throw new Error("endDate must be after startDate");
      }
      return true;
    }),
  body("frequency")
    .isIn(["daily", "weekly"]).withMessage("frequency must be daily or weekly"),
  body("occurrences")
    .isInt({ min: 1, max: 52 }).withMessage("occurrences must be between 1 and 52")
    .toInt(),
];
