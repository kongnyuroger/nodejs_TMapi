import { body } from "express-validator";

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),

  body("due_date")
    .optional()
    .custom(value => {
      const dueDate = new Date(value);
      const now = new Date();
      if (isNaN(dueDate.getTime())) throw new Error("Invalid date format");
      if (dueDate < now) throw new Error("Due date must be in the future");
      return true;
    }),

  body("assigned_to")
    .optional()
    .isInt().withMessage("assigned_to must be a valid user ID (integer)"),
];
